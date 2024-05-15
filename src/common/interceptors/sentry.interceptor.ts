import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const errorsToTrackInSentry = [InternalServerErrorException, TypeError];
const enableSentry = (error) => {
  const sendToSentry = errorsToTrackInSentry.some(
    (errorType) => error instanceof errorType,
  );
  if (sendToSentry) Sentry.captureException(error);
  return throwError(error);
};

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  private readonly env: string;

  constructor(environment: string) {
    this.env = environment;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return this.env == 'production'
      ? next.handle().pipe(catchError(enableSentry))
      : next.handle().pipe(catchError((error) => throwError(error)));
  }
}
