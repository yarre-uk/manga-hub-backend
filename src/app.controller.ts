import { Controller, Get } from '@nestjs/common';

import { Public } from '@common/decorators';

@Controller('app')
export class AppController {
  @Public()
  @Get('test')
  test() {
    return 'works!';
  }
}
