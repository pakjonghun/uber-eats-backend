import { EmailOptions, Emailvalues, TemplateValues } from './email.interface';
import { Inject, Injectable } from '@nestjs/common';
import { OPTIONS } from './email.constants';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class EmailService {
  constructor(@Inject(OPTIONS) private readonly options: EmailOptions) {}

  templateValuesMaker(values: TemplateValues) {
    const tempArr = [];
    for (const v in values) tempArr.push(`"${v}":"${values[v]}"`);
    return tempArr.join(',');
  }

  formMaker(values: Emailvalues, templateValues: TemplateValues) {
    const form = new FormData();
    const tempForm = this.templateValuesMaker(templateValues);
    for (const v in values) form.append(v, values[v]);
    form.append('h:X-Mailgun-Variables', `{${tempForm}}`);
    form.append(
      'from',
      `${this.options.MAIL_FROM} <hihi@${this.options.MAIL_DOMAIN}>`,
    );

    return form;
  }

  async send(emailVal: Emailvalues, templateVal: TemplateValues) {
    const form = this.formMaker(emailVal, templateVal);

    await got.post(
      `https://api.mailgun.net/v3/${this.options.MAIL_DOMAIN}/messages`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.EMAI_KEY}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
  }
}
