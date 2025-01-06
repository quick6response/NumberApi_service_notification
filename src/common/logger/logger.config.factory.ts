import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModuleAsyncParams, Params, PinoLogger } from 'nestjs-pino';
import { createWriteStream } from 'pino-sentry';

export const getLoggerConfig = () => {
  const configService = new ConfigService();

  const nodeEnv = configService.get<string>('NODE_ENV');
  const sentryDSN = configService.get<string>('SENTRY_DSN');
  const version = configService.get<string>('APP_VERSION');
  const mode = configService.get<string>('MODE');

  const isProduction = nodeEnv === 'production';

  if (isProduction && !sentryDSN) {
    throw new Error('SENTRY_DSN must be defined');
  }

  const stream = isProduction
    ? createWriteStream({
        dsn: sentryDSN,
        normalizeDepth: 5,
        release: version,
        maxBreadcrumbs: 0,
        stackAttributeKey: 'err.stack',
        extraAttributeKeys: ['extra'],
        environment: mode,
      })
    : undefined;

  const transport = isProduction ? undefined : { target: 'pino-pretty' };
  const level = isProduction ? 'info' : 'debug';

  const config: Params = {
    pinoHttp: {
      level,
      transport,
      stream,
    },
    exclude: [{ method: RequestMethod.ALL, path: '*' }],
  };

  // SentryNestJs.init({
  //   dsn: sentryDsn,
  //   integrations: [
  //     // Add our Profiling integration
  //     nodeProfilingIntegration(),
  //     SentryNestJs.anrIntegration({ captureStackTrace: true }),
  //   ],
  //   profilesSampleRate: 1,
  //   tracesSampleRate: 1,
  // });

  return config;
};

export const loggerConfigFactory: LoggerModuleAsyncParams & {
  provide: string;
} = {
  provide: 'loggerConfig',
  inject: [],
  useFactory: async () => {
    return getLoggerConfig();
  },
};

export class Logger extends PinoLogger {
  static contextsToIgnore = [
    'InstanceLoader',
    'RoutesResolver',
    'RouterExplorer',
    'NestFactory', // I prefer not including this one
  ];

  constructor() {
    const logger = getLoggerConfig();
    super(logger);
  }

  public log(message: any, context?: string): void {
    if (Logger.contextsToIgnore.includes(context)) {
      super.debug(message);
      return;
    }
    if (
      typeof message === 'string' &&
      message.includes('dependencies initialized')
    ) {
      super.debug(message);
      return;
    }
    super.info(message, context);
  }

  public info(message: any, ...optionalParams: [...any, string?]): void {
    if (Logger.contextsToIgnore.includes(message)) {
      super.debug(message);
      return;
    }
    if (
      typeof message === 'string' &&
      message.includes('dependencies initialized')
    ) {
      super.debug(message);
      return;
    }
    super.info(message, optionalParams);
  }
}
