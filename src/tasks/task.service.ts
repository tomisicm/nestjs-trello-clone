import { Injectable } from '@nestjs/common'
import { v4 as uuid } from "uuid"
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
        return this.tasks[0]
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
        this.tasks[0].status = status
        return this.tasks[0]
    }

    deleteTaskById(id: string): Boolean {
        this.tasks.length = 0
        return true
    }
}
