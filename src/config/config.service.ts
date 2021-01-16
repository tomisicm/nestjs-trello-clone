type variables = { APP_ENV: string }

export class ConfigService {
    constructor() {}

    cache: variables = {
        APP_ENV: process.env.NODE_ENV
    }

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