import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { VkArgumentsHost, VkException } from 'nestjs-vk';
import { Context } from 'vk-io';

@Catch()
export class VkExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(VkExceptionFilter.name);

  async catch(exception: VkException, host: ArgumentsHost): Promise<void> {
    const vkContext = VkArgumentsHost.create(host);
    const ctx = vkContext.getContext<Context>();

    this.logger.error(exception);
    await ctx.send(`Произошла ошибка`);
  }
}
