process.env.JET_LOGGER_MODE = 'CONSOLE'
process.env.JET_LOGGER_FILEPATH = "logs/jet-logger.log"
process.env.JET_LOGGER_TIMESTAMP = "TRUE"
process.env.JET_LOGGER_FORMAT = "LINE"

import Logger from 'jet-logger'

const logger = new Logger()

export default logger
