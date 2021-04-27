import axios, { AxiosResponse } from 'axios'
import { Response } from 'express'
import { DaemonOpCode, DaemonOpCtx, DaemonOpHandlerCtx } from '../../../../types/DaemonOps'
import { ExpressHandlerRequest } from '../../../../types/ExpressHandlerRequest'
import { badRequest, daemonReturnedError, internalServerError, notFound, ok, unauthorized } from '../../../../utils/cannedHTTPResponses'
import requestWasValid from '../../../../utils/requestWasValid'
import DaemonDatabaseDriver from '../../../../db/drivers/daemon'
import { getAddressForOp } from '../../../../utils/daemonHTTPAddress'

const dbDriver = new DaemonDatabaseDriver()

export async function performDaemonOp (ctx: DaemonOpCtx, op: (ctx: DaemonOpHandlerCtx) => void | Promise<void>): Promise<void> {
  const { opCode, req, res } = ctx

  try {
    if (!requestWasValid(req, res)) return

    logger.info(`Received daemon ${opCode} request from IP ${req.ip}: daemon=${req.params?.mac}, token=${req.headers.authorization}.`)

    const daemon = await dbDriver.getByMac(req.params?.mac)

    if (daemon === null) {
      logger.warn(`Received daemon ${opCode} request from IP ${req.ip} for non-existent daemon ${req.params?.mac}.`)
      notFound(res, 'No daemon with this MAC address found')
    } else {
      await op({ ...ctx, daemon })
    }
  } catch (err) {
    logger.error(`Encountered an error while performing ${opCode} operation for daemon ${req.params?.mac}: ${err.stack}`)
    internalServerError(res)
  }
}

export function checkDaemonToken (ctx: DaemonOpHandlerCtx): void {
  const { opCode, req, res, daemon } = ctx

  if (daemon.token !== req.headers.authorization) {
    logger.warn(`Received daemon ${opCode} request from IP ${req.ip} for daemon ${req.params?.mac}, but token was incorrect (Expected ${daemon.token}, got ${req.headers.authorization}).`)
    return unauthorized(res, 'Invalid token')
  }
}

export function handleDaemonResponse (opCode: DaemonOpCode, daemonRes: AxiosResponse, req: ExpressHandlerRequest, res: Response): void {
  switch (daemonRes.status) {
    case 200:
      ok(res)
      logger.info(`Op ${opCode} on ${req.params?.mac} executed successfully.`)
      break
    case 400:
      badRequest(res, daemonRes.data)
      logger.warn(`Sent ${opCode} request to ${req.params?.mac}, but got 400: ${JSON.stringify(daemonRes.data)}`)
      break
    case 401:
      unauthorized(res, daemonRes.data)
      logger.warn(`Sent ${opCode} request to ${req.params?.mac}, but got 401: ${JSON.stringify(daemonRes.data)}`)
      break
    case 429:
      badRequest(res, daemonRes.data)
      logger.warn(`Sent ${opCode} request to ${req.params?.mac}, but got 429: ${JSON.stringify(daemonRes.data)}`)
      break
    case 500:
      daemonReturnedError(res, daemonRes.data)
      logger.warn(`Sent ${opCode} request to ${req.params?.mac}, but got 500: ${JSON.stringify(daemonRes.data)}`)
      break
    default:
      logger.warn(`Received out-of-spec response from daemon ${req.params?.mac} in reply to ${opCode} request: ${daemonRes.status}`)
  }
}

export async function genericOpHandler (ctx: DaemonOpCtx): Promise<void> {
  const { opCode, req, res } = ctx

  await performDaemonOp({ opCode, req, res }, async ctx => {
    const { opCode, daemon } = ctx

    // This is just here to satisfy TS since we will always have an IP thanks to the performDaemonOp filtering
    if (!daemon.ip) return

    try {
      const response = await axios.post(getAddressForOp(opCode, daemon.ip))
      handleDaemonResponse(opCode, response, req, res)
    } catch (err) {
      res.status(523).json({ error: err.stack })
    }
  })
}