import { NextFunction, Response, Router } from 'express'
import { header, body, param } from 'express-validator'
import unless from 'express-unless'
import register from './handlers/register'
import identify from './handlers/identify'
import getAll from './handlers/getAll'
import getByMAC from './handlers/mac/getByMAC'
import deregister from './handlers/mac/deregister'
import boot from './handlers/mac/boot'
import reboot from './handlers/mac/reboot'
import shutdown from './handlers/mac/shutdown'
import restart from './handlers/mac/restart'
import logout from './handlers/mac/logout'
import { WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH, WINDOWS_MAX_SHUTDOWN_TIMEOUT } from '../../../../common/constants'
import { ExpressHandlerRequest } from '../../../../types/ExpressHandlerRequest'
import { unauthorized } from '../../../../utils/cannedHTTPResponses'

const router = Router()

const needsMac = param('mac').isMACAddress().withMessage('Must be a MAC address')

const needsOpParams = [
  needsMac,
  body('force').optional().isBoolean().toBoolean(true).withMessage('Must be true or false'),
  body('timeout').optional().isInt({ min: 0, max: WINDOWS_MAX_SHUTDOWN_TIMEOUT }).withMessage('Must be in range 0-315360000'),
  body('comment').optional().isLength({ max: WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH }).withMessage('Must be <= 512 characters')
]

const auth = (req: ExpressHandlerRequest, res: Response, next: NextFunction): void => {
  if (req.session.token) next()
  else unauthorized(res)
}

auth.unless = unless

router.use(auth.unless({ path: ['/api/v1/daemons/register', '/api/v1/daemons/identify'], method: ['DELETE'] }))

// Registration routes with special authentication

router.post(
  '/register',
  header('X-Secret').notEmpty().withMessage('X-Secret header must be present'),
  body('mac').isMACAddress().withMessage('Must be a MAC address'),
  register
)

router.post(
  '/identify',
  header('Authorization').notEmpty().withMessage('Authorization header must be present'),
  body('mac').isMACAddress().withMessage('Must be a MAC address'),
  body('ip').isIP().withMessage('Must be an IP address'),
  body('user').notEmpty().withMessage('Must be present'),
  body('hostname').notEmpty().withMessage('Must be present'),
  identify
)

// Authenticated routes

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', getAll)
router.get('/:mac', needsMac, getByMAC)
router.delete('/:mac', header('Authorization').notEmpty().withMessage('Authorization header must be present'), needsMac, deregister)
router.post('/:mac/boot', ...needsOpParams, boot)
router.post('/:mac/reboot', ...needsOpParams, reboot)
router.post('/:mac/shutdown', ...needsOpParams, shutdown)
router.post('/:mac/restart', needsMac, restart)
router.post('/:mac/logout', ...needsOpParams, logout)

export default router
