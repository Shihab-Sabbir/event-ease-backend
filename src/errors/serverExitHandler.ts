import { errorLogger } from '../shared/logger'
import { Server } from 'http'

export const serverExitHandler = (server: Server, err: any) => {
  errorLogger.error(err)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}
