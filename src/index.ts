// Required by https://github.com/joiful-ts/joiful#basic-usage
import 'reflect-metadata'

// Setup logger
import './common/logger'

import dotenv from 'dotenv-safe'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import v1Router from './api/v1'

/**
 * Terminates the program if a fatal error is encountered during the boot process.
 */
function terminate (): void {
  logger.error('BOOT: Encountered fatal error during boot process. Exiting...')
  process.exit(1)
}

// We can't reliably use TLA (Top-Level Await) yet, so we have to fallback to an async IIFE
void (async () => {
  logger.info('BOOT: Starting up.')
  logger.info(`BOOT: Running in ${process.env.NODE_ENV === 'development' ? 'development' : 'production'} mode.`)

  // Load configuration
  logger.info('BOOT: Loading configuration.')
  dotenv.config()
  logger.info('BOOT: Configuration loaded.')

  // Check database connection
  const { MONGO_HOST, MONGO_PORT, MONGO_USER, MONGO_PASS } = process.env
  const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/remotr?authSource=remotr`

  logger.info(`BOOT: Establishing database connection (URL: ${mongoUrl}).`)

  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
  } catch (err) {
    logger.error(`BOOT: Database connection failed: ${err.stack}`)
    terminate()
  }

  logger.info('BOOT: Database connection established.')

  const app = express()

  if (!process.env.COOKIE_SECRET) {
    logger.error('BOOT: The COOKIE_SECRET environment variable is not set.')
    terminate()
  } else {
    // Need this else here to convince TS that we do actually have the variable set

    // Init session store
    app.use(session({
      secret: process.env.COOKIE_SECRET,
      store: new MongoStore({
        mongoUrl,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native'
      }),
      cookie: {
        sameSite: true
      },
      resave: false,
      saveUninitialized: true
    }))
  }

  // Serve static files
  app.use(express.static('static'))

  // Parse bodies as JSON
  app.use(express.json())

  // Parse cookies in requests
  app.use(cookieParser())

  // Load Helmet
  app.use(helmet())

  // Allow CORS in dev
  if (process.env.NODE_ENV === 'development') {
    app.use(cors({
      credentials: true,
      origin: 'http://localhost:8080'
    }))
  }

  // Apply routers
  app.use('/api/v1', v1Router)

  const host = process.env.SERVER_HOST
  const port = process.env.SERVER_PORT

  if (!host || !port || isNaN(parseInt(port))) {
    logger.error(`BOOT: SERVER_HOST and/or SERVER_PORT not defined correctly; expected string and number, got SERVER_HOST=${host} SERVER_PORT=${port}`)
    terminate()
    return // This is just here to satisfy TS since it doesn't know that this function just terminates the program
  }

  app.listen(parseInt(port), host, () => {
    logger.info(`BOOT: REST server listening on http://${host}:${port}.`)
    logger.info('BOOT: Startup complete.')
  })
})()
