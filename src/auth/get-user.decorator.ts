import {createParamDecorator} from '@nestjs/common';
import {User} from './user.entity';

export const GetUser = createParamDecorator((date, req): User => {
    return req.user;
})
