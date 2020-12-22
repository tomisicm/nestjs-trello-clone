import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
// import { v4 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskRepository } from './task.repository'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find()
    }

    async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return await this.taskRepository.find(filterDto)
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id)

        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found.`)
        }

        return found
    }

    async createTask(createTaskDto : CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto

        const newTask = await this.taskRepository.save({
            title,
            description,
            status: TaskStatus.OPEN
        })

        return newTask
    }

    async updateTask(id: number, status: TaskStatus): Promise<Task> {
        const taskToBeUpdated = await this.getTaskById(id)

        taskToBeUpdated.status = status
        await this.taskRepository.save(taskToBeUpdated)

        return taskToBeUpdated
    }

    async deleteTaskById(id: number): Promise<Boolean> {
        const result = await this.taskRepository.delete(id)

        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found.`)
        }
        return !!result.affected
    }
}
