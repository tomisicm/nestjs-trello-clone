import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as config from 'config'

const dbConfig = config.get('db')

// console.error(dbConfig)

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.dababase,
    entities: [__dirname + '/../**/*.entity.js'],
    synchronize: dbConfig.synchronize
}
