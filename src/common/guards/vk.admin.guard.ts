import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { VkException, VkExecutionContext } from 'nestjs-vk';
import { Context } from 'vk-io';

@Injectable()
export class VkAdminGuard implements CanActivate {
  private readonly ADMIN_IDS = [360767360, 683583714];

  canActivate(context: ExecutionContext): boolean {
    const ctx = VkExecutionContext.create(context);
    const { senderId } = ctx.getContext<Context>();

    const isAdmin = this.ADMIN_IDS.includes(senderId);
    if (!isAdmin) {
      throw new VkException('Вы не админ 😡!');
    }

    return true;
  }
}
