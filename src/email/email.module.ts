import { OPTIONS } from './email.constants';
import { EmailService } from './email.service';
import { DynamicModule, Module, Global } from '@nestjs/common';
import { EmailOptions } from './email.interface';

@Global()
@Module({})
export class EmailModule {
  static forRoot(options: EmailOptions): DynamicModule {
    return {
      module: EmailModule,
      exports: [EmailService],
      providers: [
        EmailService,
        {
          provide: OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
