import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskController } from './task.controller'
import { TaskRepository } from './task.repository'
import { TaskService } from './task.service'
import { AuthModule } from './../auth/auth.module'

@Module({
    imports: [TypeOrmModule.forFeature([TaskRepository]), AuthModule],
    controllers: [TaskController],
    providers: [TaskService]
})
export class TaskModule {}
