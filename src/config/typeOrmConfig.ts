import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as config from 'config'
import ConfigService from './config.service'

const dbConfig = config.get('db')

console.error(ConfigService)

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: ConfigService.accessEnv('DATABASE_TYPE', dbConfig.type),
    host: ConfigService.accessEnv('DATABASE_HOST', dbConfig.host),
    port: ConfigService.accessEnv('DATABASE_PORT', dbConfig.port),
    username: ConfigService.accessEnv('DATABASE_USERNAME', dbConfig.username),
    password: ConfigService.accessEnv('DATABASE_PASSWORD', dbConfig.password),
    database: ConfigService.accessEnv('POSTGRES_DATABASE', dbConfig.dababase),
    entities: [__dirname + '/../**/*.entity.js'],
    synchronize: dbConfig.synchronize
}
