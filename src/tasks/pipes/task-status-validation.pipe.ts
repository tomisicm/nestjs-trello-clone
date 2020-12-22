import { BadRequestException, PipeTransform } from '@nestjs/common'
import { TaskStatus } from '../task-status.enum'

export class TaskStatusValidationPipe implements PipeTransform {

    readonly allowedStatuses = [
        TaskStatus.OPEN,  TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED,
    ]

    transform(value: any) {
        const isValid = this.isStatusValid(value)

        if (!isValid) {
            throw new BadRequestException('Status is not valid.')
        }

        return value
    }

    isStatusValid(status) {
        return this.allowedStatuses.includes(status)
    }

}