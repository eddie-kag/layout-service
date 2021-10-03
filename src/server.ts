import { initialize as initializeDb } from '@db/db'
import logger from '@shared/logger'
import express, { NextFunction, Request, Response } from 'express'
import router from '@routes/routes'
import { StatusCodes } from 'http-status-codes';

const app = express()

;(async () => {
  // Initialization
  try {
    await initializeDb()
    logger.info('DB successfully initialized.')
  } catch (err) {
    logger.err('Failed to initialize DB.')
  }

  logger.info('Server initialized and ready.')

  // Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/', router)

  // Print API errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true)
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: err.message,
    })
  })
})()

export default app

