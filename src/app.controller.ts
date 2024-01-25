import { Controller, Get } from '@nestjs/common';

import { Public } from './decorators';

@Controller('app')
export class AppController {
  @Public()
  @Get('test')
  test() {
    return 'works!!';
  }
}
