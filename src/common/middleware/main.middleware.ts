import { Inject, Injectable } from '@nestjs/common';
import { HearManager } from '@vk-io/hear';
import { SceneManager } from '@vk-io/scenes';
import { SessionManager } from '@vk-io/session';
import { VK_HEAR_MANAGER, VK_SCENE_MANAGER } from 'nestjs-vk';
import { Composer, Context, MessageContext } from 'vk-io';

@Injectable()
export class MainMiddleware {
  private readonly sessionManager: SessionManager;
  @Inject(VK_HEAR_MANAGER)
  private readonly hearManagerProvider: HearManager<MessageContext>;
  @Inject(VK_SCENE_MANAGER)
  private readonly sceneManager: SceneManager;

  constructor() {
    this.sessionManager = new SessionManager({
      // ...
    });
  }

  get middlewaresBefore() {
    const composer = Composer.builder<Context>();

    composer.use(this.sessionManager.middleware);
    composer.use(this.sceneManager.middleware);

    return composer.compose();
  }

  get middlewaresAfter() {
    const composer = Composer.builder<Context>();

    composer.use(this.hearManagerProvider.middleware);

    return composer.compose();
  }
}
