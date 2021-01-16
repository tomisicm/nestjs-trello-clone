type variables = {
    APP_ENV: string
    POSTGRES_DATABASE: string
}

export class ConfigService {
    constructor() {
        this.cache = {
            APP_ENV: process.env.NODE_ENV,
            POSTGRES_DATABASE: process.env.POSTGRES_DATABASE
        }
    }

    cache: variables

    accessEnv(key: string, defaultValue: any) {
        if (!(key in process.env)) {
            if (defaultValue) {
                return defaultValue
            }

            throw new Error(`${key} not found in process.env!`)
        }

        if (this.cache[key]) return this.cache[key]

        this.cache[key] = process.env[key]

        return process.env[key]
    }

    isEnv(env: string) {
        return this.cache.APP_ENV === env
    }
}

export default new ConfigService()
