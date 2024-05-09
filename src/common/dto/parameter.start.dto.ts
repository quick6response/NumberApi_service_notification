import { ParameterRequestVkUserEventInterface } from '@quick_response/number_api_event/dist/_types';
import { IsNumber, IsString } from 'class-validator';

export class ParameterStartDto implements ParameterRequestVkUserEventInterface {
  @IsString()
  vk_access_token_settings: string;
  @IsNumber()
  vk_app_id: number;
  @IsNumber()
  vk_are_notifications_enabled: number;
  @IsNumber()
  vk_is_app_user: number;
  @IsNumber()
  vk_is_favorite: number;
  @IsString()
  vk_language: string;
  @IsString()
  vk_platform: string;
  @IsString()
  vk_ref: string;
  @IsString()
  vk_ts: string;
  @IsNumber()
  vk_user_id: number;
  @IsString()
  sign: string;
  @IsString()
  ip: string;
  @IsString()
  userAgent: string;
  @IsNumber()
  date: number;
}
