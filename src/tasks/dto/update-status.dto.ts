import {IsIn, IsNotEmpty} from 'class-validator';
import {TaskStatus} from '../task-status.enum';

export class UpdateStatusDto {
    @IsNotEmpty()
    @IsIn([TaskStatus.IN_PROGRESS, TaskStatus.OPEN, TaskStatus.DONE])
    status: TaskStatus;
}
