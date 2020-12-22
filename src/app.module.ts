import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { typeOrmConfig } from './config/typeOrmConfig'
import { TaskModule } from './tasks/task.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TaskModule
  ],
})
export class AppModule {}
