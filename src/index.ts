import config from '@config/config'
import app from './server'
import logger from '@shared/logger'

const port = Number(config.port)

app.listen(port, () => {
  logger.info(
    `Server listening on port ${port}.`
  )
})