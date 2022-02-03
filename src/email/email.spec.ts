import { Emailvalues } from './email.interface';
import { TemplateValues } from './../../dist/email/email.interface.d';
import { OPTIONS } from './email.constants';
import { Test } from '@nestjs/testing';
import { EmailService } from './email.service';
import got from 'got';
import FormData, * as formData from 'form-data';
import { introspectionFromSchema } from 'graphql';

jest.mock('got');

jest.mock('form-data');

const tempvalues = {
  test: 'test',
  user: 'user',
  href: 'href',
};

const emailOptions = {
  EMAIL_KEY: 'key',
  MAIL_DOMAIN: 'domain',
  EMAIL_FROM: 'from',
};

const emailValues = {
  subject: 'subject',
  template: 'template',
  to: 'to',
};

describe('emailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: OPTIONS,
          useValue: emailOptions,
        },
      ],
    }).compile();

    service = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('tempMaker', () => {
    it('should be called', () => {
      const template = jest.spyOn(
        EmailService.prototype as any,
        'templateValuesMaker',
      );

      const t = service.templateValuesMaker(tempvalues);
      expect(t).toEqual('"test":"test","user":"user","href":"href"');
    });

    it('should retrun form data', async () => {
      const formSpy = jest.spyOn(formData.prototype, 'append');
      await service.send(emailValues, tempvalues);
      expect(formSpy).toBeCalledTimes(5);
    });

    it('should be called formMaker', async () => {
      service.formMaker = jest.fn();
      await service.send(emailValues, tempvalues);
      expect(service.formMaker).toHaveBeenCalledTimes(1);
      expect(service.formMaker).toHaveBeenCalledWith(emailValues, tempvalues);
    });

    it('shoul be called', async () => {
      await service.send(emailValues, tempvalues);

      expect(got.post).toHaveBeenCalled();
      expect(got.post).toBeCalledWith(
        `https://api.mailgun.net/v3/${emailOptions.MAIL_DOMAIN}/messages`,
        expect.any(Object),
      );
    });

    it('should throw error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error('');
      });

      try {
        await service.send(emailValues, tempvalues);
      } catch (err) {
        expect(err).toStrictEqual(new Error(''));
      }
    });
  });
});
