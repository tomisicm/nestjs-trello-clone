import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto'
import { TaskStatus } from '../task-status.enum'
import { Task } from '../task.entity'
import { TaskRepository } from '../task.repository'
import { TaskService } from './../task.service'

const mockTaskRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn()
})

const mockUser = { username: 'Testuser' }

describe('TaskService', () => {
    let taskService
    let taskRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TaskService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile()

        taskService = await module.get<TaskService>(TaskService)
        taskRepository = await module.get<TaskRepository>(TaskRepository)
    })

    describe('getTasksWithFilters', () => {
        it('get all tasks from the repository', () => {
            expect(taskRepository.find).not.toHaveBeenCalled()
            const filters: GetTasksFilterDto = {
                status: TaskStatus.OPEN,
                search: 'qwe'
            }

            taskService.getTasksWithFilters(filters)

            expect(taskRepository.find).toHaveBeenCalled()
        })
    })

    describe('getTaskById', () => {
        const mockTask = {
            id: 45,
            title: 'mocked task title',
            description: 'mocked task desc'
        }

        it('cals taskRepository.findOne() and succesfully retrive and return the task', async () => {
            expect(taskRepository.findOne).not.toHaveBeenCalled()
            taskRepository.findOne.mockResolvedValue(mockTask)

            const result = await taskService.getTaskById(mockTask.id)

            expect(taskRepository.findOne).toHaveBeenCalled()
            expect(result).toEqual(mockTask)
        })

        it('throws an error as task is not found', async () => {
            taskRepository.findOne.mockResolvedValue(null)

            expect(taskService.getTaskById(mockTask.id)).rejects.toThrow(NotFoundException)
        })
    })
})
