import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { CreateTaskDto } from '../dto/create-task.dto'
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto'
import { TaskStatus } from '../task-status.enum'
import { TaskRepository } from '../task.repository'
import { TaskService } from './../task.service'

const mockTaskRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn()
})

const mockUser = { username: 'Testuser' }

describe('TaskService', () => {
    let taskService
    let taskRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [TaskService, { provide: TaskRepository, useFactory: mockTaskRepository }]
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

        it('calls taskRepository.findOne() and succesfully retrive and return the task', async () => {
            expect(taskRepository.findOne).not.toHaveBeenCalled()
            taskRepository.findOne.mockResolvedValue(mockTask)

            const result = await taskService.getTaskById(mockTask.id)

            expect(taskRepository.findOne).toHaveBeenCalled()
            expect(result).toEqual(mockTask)
        })

        it('throws an error as task is not found', async () => {
            taskRepository.findOne.mockResolvedValue(null)

            await expect(taskService.getTaskById(mockTask.id)).rejects.toThrow(NotFoundException)
        })
    })

    describe('createTask', () => {
        const mockTask: CreateTaskDto = {
            title: 'mocked task title',
            description: 'mocked task desc'
        }

        it('calls taskRepository.save() and succesfully retrive and return the task', async () => {
            expect(taskRepository.save).not.toHaveBeenCalled()
            taskRepository.save.mockResolvedValue({
                ...mockTask,
                status: 'OPEN'
            })

            const result = await taskService.createTask(mockTask)

            expect(taskRepository.save).toHaveBeenCalled()
            expect(result).toEqual({ ...mockTask, status: 'OPEN' })
        })
    })

    describe('updateTask', () => {
        const mockTask = {
            id: 1,
            title: 'mocked task title',
            description: 'mocked task desc',
            status: 'OPEN'
        }

        it('calls taskRepository.save() and succesfully retrive and return the task', async () => {
            expect(taskRepository.save).not.toHaveBeenCalled()
            taskRepository.save.mockResolvedValue(mockTask)
            jest.spyOn(taskService, 'getTaskById').mockImplementation().mockResolvedValue(mockTask)

            const result = await taskService.updateTask(mockTask.id, 'IN_PROGRESS')

            expect(taskRepository.save).toHaveBeenCalled()
            expect(result).toEqual({ ...mockTask, status: 'IN_PROGRESS' })
        })

        it('throws an error as task is not found', async () => {
            expect(taskRepository.save).not.toHaveBeenCalled()
            taskRepository.save.mockResolvedValue({
                ...mockTask,
                status: 'IN_PROGRESS'
            })

            await expect(taskService.updateTask(mockTask.id, 'IN_PROGRESS')).rejects.toThrow(
                NotFoundException
            )
        })
    })

    describe('deleteTask', () => {
        const mockTask = {
            id: 1,
            title: 'mocked task title',
            description: 'mocked task desc'
        }

        it('calls taskRepository.save() and succesfully retrive and return the task', async () => {
            expect(taskRepository.delete).not.toHaveBeenCalled()
            taskRepository.delete.mockResolvedValue({
                affected: 1
            })

            await taskService.deleteTaskById(mockTask.id)

            expect(taskRepository.delete).toHaveBeenCalled()
        })

        it('throws an error as task is not found', async () => {
            expect(taskRepository.delete).not.toHaveBeenCalled()
            taskRepository.delete.mockResolvedValue({
                affected: 0
            })

            await expect(taskService.deleteTaskById(mockTask.id)).rejects.toThrow(NotFoundException)
        })
    })
})
