import {Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {Task} from './task.entity';
import {AuthGuard} from '@nestjs/passport';
import {User} from '../auth/user.entity';
import {GetUser} from '../auth/get-user.decorator';
import {UpdateStatusDto} from './dto/update-status.dto';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto,
             @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }
    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number,
                @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} created a task. Data: ${JSON.stringify(createTaskDto)}`)
        return this.tasksService.createTask(createTaskDto, user);
    }
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStatus: UpdateStatusDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.updateStatus(id, updateStatus.status, user);
    }
    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number,
               @GetUser() user: User,
    ): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }
}
