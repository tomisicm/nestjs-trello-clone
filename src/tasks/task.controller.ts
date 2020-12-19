import { Body, Controller, Get, Param, Post, Delete, Patch, Query } from '@nestjs/common';
import { TaskService } from './task.service'
import { Task, TaskStatus } from './task.model'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.taskService.getTasksWithFilters(filterDto)
        }
        else {
            return this.taskService.getAllTasks()
        }
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id: string
    ): Task {
        const task = this.taskService.getTaskById(id)
        return task
    }

    @Post()
    createTask(
        @Body() createTaskDto : CreateTaskDto
    ): Task {
        const newTask : Task = this.taskService.createTask(createTaskDto)
        return newTask
    }

    @Patch('/:id/status')
    updateTask(
        @Param('id') id : string,
        @Body('status') status : TaskStatus
    ): Task {
        const updatedTask : Task = this.taskService.updateTask(id, status)
        return updatedTask
    }

    @Delete('/:id')
    deleteTask(
        @Param('id') id: string
    ): Boolean {
        const taskDeleted : Boolean = this.taskService.deleteTaskById(id)
        return taskDeleted
    }
}
