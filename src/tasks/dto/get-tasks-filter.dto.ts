import { TaskStatus } from "../task.model"
import { IsOptional, IsNotEmpty, IsIn } from 'class-validator'
export class GetTasksFilterDto {

    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
    status: TaskStatus

    @IsOptional()
    @IsNotEmpty()
    search: string
}