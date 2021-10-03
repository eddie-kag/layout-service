import config from "@config/config"
import logger from "@shared/logger"
import { Sequelize } from "sequelize-typescript"

export const SCHEMA = 'layout-service'

const db = new Sequelize({
  dialect: 'postgres',
  host: config.postgresHost,
  port: Number(config.postgresPort),
  database: config.postgresDb,
  username: config.postgresUser,
  password: config.postgresPassword,
  logging: false,
  define: {
    underscored: true,
  },
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

export const initialize = async () => {
  try {
    await db.authenticate()
    await db.addModels([__dirname + '/models'])
  } catch (err) {
    logger.err('[DB] ' + err)
    throw err
  }
}

export default db
