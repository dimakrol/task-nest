import {Test} from '@nestjs/testing';
import {TasksService} from './tasks.service';
import {TaskRepository} from './task.repository';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {TaskStatus} from './task-status.enum';
import {NotFoundException} from '@nestjs/common';

const mockUser = {username: 'Joker', id: 5};
const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});
describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository},
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });
    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some Value');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'Some search',
            };
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('some Value');
        });
    });
    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = { title: 'title', description: 'description'};
            taskRepository.findOne.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1, userId: mockUser.id,
                }});
        });

        it('throw an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
    describe('createTask', () => {
        it('should create task', async () => {
            const createTaskDto = {
                title: 'some title',
                description: 'some Description',
            };
            const mockTask = {
                id: 2,
                ...createTaskDto,
            };
            taskRepository.createTask.mockResolvedValue(mockTask);
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const res = await tasksService.createTask(createTaskDto, mockUser);
            expect(res).toEqual(mockTask);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
        });
    });

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete a task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id});

        });
        it('throw an error if task could not be found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateStatus', () => {
        it('should update status of task', async () => {
            const save = jest.fn().mockResolvedValue(true)
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const res = await tasksService.updateStatus(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(res.status).toEqual(TaskStatus.DONE);
        });
    });
});
