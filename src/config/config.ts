import logger from "@shared/logger"

const envVarMappings: Record<string, string> = {
    port: 'PORT',
    postgresHost: 'POSTGRES_HOST',
    postgresPort: 'POSTGRES_PORT',
    postgresDb: 'POSTGRES_DB',
    postgresUser: 'POSTGRES_USER',
    postgresPassword: 'POSTGRES_PASSWORD'
}

const config = (() => {
    const _config: Record<string, string> = {}

    for (const configKey in envVarMappings) {
        const envVar = envVarMappings[configKey]
        const configValue = process.env[envVar]

        if (!configValue) {
            logger.err(`[Config] Environment variable '${envVar}' must be set.`)
            process.exit()
        }

        _config[configKey] = configValue
    }

    return _config
})()

export default config