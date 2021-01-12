import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as config from 'config'

const dbConfig = config.get('db')

console.error(dbConfig)
console.error('--------------------------------------')
console.error(process.env)
console.error('--------------------------------------')

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: dbConfig.host,
    // port: dbConfig.port,
    // username: dbConfig.username,
    // password: dbConfig.password,
    // database: dbConfig.dababase,
    url: dbConfig.url,
    entities: [__dirname + '/../**/*.entity.js'],
    synchronize: dbConfig.synchronize
}
