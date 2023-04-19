import { ServerStartDto } from './server.start.dto';

export class ServerStopDto extends ServerStartDto {
  signal: string;
}
