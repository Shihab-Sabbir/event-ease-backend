import mongoose from 'mongoose'
import app from './app'
import { PORT, DB_URL } from './config'
import { logger, errorLogger } from './shared/logger'
import { Server } from 'http'
import { serverExitHandler } from './errors/serverExitHandler'

// this is for sync udefined/null value error handler , so it is at top !
// this type of error can be deected by global error handler also.
process.on('uncaughtException', err => {
  logger.error(err)
  process.exit(1)
})

let server: Server

async function connectDb() {
  try {
    await mongoose.connect(`${DB_URL}`)
    logger.info('Database connection established !')
    server = app.listen(PORT, () => {
      logger.info(`App is listening on port ${PORT}`)
    })
  } catch (error) {
    errorLogger.error('Failed to connect database', error)
  }

  // async error handler
  // this type of error can not be deected by global error handler.
  process.on('unhandledRejection', err => {
    serverExitHandler(server, err)
  })
}

connectDb()

//signal termination handler
//server will be closed if specific signal is received by process manager on emergency.
process.on('SIGTERM', () => {
  if (server) {
    logger.info('SIGTERM is received')
    server.close()
  }
})
