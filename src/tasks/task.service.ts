import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { Task, TaskStatus } from './task.model'

@Injectable()
export class TaskService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        return this.tasks
    }


    getTaskById(id: string): Task {
        const found = this.tasks[0]

        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found.`)
        }

        return found
    }

    createTask(createTaskDto : CreateTaskDto): Task {
        const { title, description } = createTaskDto

        const newTask: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(newTask)

        return newTask
    }

    updateTask(id: string, status: TaskStatus) {
        const taskToBeUpdated = this.getTaskById(id)

        taskToBeUpdated.status = status

        return taskToBeUpdated
    }

    deleteTaskById(id: string): Boolean {
        const taskToBeDeleted = this.getTaskById(id)

        this.tasks.length = 0
        return true
    }
}
