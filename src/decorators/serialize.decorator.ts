import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

export const Serialize = () => UseInterceptors(ClassSerializerInterceptor);
