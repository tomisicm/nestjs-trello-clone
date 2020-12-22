import { Body, Controller, Get, Param, Post, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common'
import { TaskService } from './task.service'
import { Task } from './task.entity'    // ?
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
        if (Object.keys(filterDto).length) {
            return await this.taskService.getTasksWithFilters(filterDto)
        }
        else {
            return await this.taskService.getAllTasks()
        }
    }

    @Get('/:id')
    async getTaskById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<Task> {
        const task = await this.taskService.getTaskById(id)
        return task
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(
        @Body() createTaskDto : CreateTaskDto
    ): Promise<Task> {
        const newTask : Task = await this.taskService.createTask(createTaskDto)
        return newTask
    }

    @Patch('/:id/status')
    async updateTask(
        @Param('id', ParseIntPipe) id : number,
        @Body('status', TaskStatusValidationPipe) status : TaskStatus
    ): Promise<Task> {
        const updatedTask : Task = await this.taskService.updateTask(id, status)
        return updatedTask
    }

    @Delete('/:id')
    async deleteTask(
        @Param('id', ParseIntPipe) id: number
    ): Promise<Boolean> {
        const taskDeleted = await this.taskService.deleteTaskById(id)
        return taskDeleted
    }
}
