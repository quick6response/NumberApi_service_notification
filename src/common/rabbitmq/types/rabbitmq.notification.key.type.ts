import { CommentCreateDto } from '../../../comments/dto/comment.create.dto';
import { OperatorCreateDto } from '../../../operators/dto/operator.create.dto';
import { ParameterStartDateDto } from './parameter.start.date.dto';

export type RabbitmqNotificationKey = keyof RabbitmqNotificationKeyType;
export type RabbitmqNotificationKeyType = {
  /**
   * Логин пользователя
   */
  auth_login_user: ParameterStartDateDto;
  /**
   * Регистрация
   */
  auth_register_user: ParameterStartDateDto & { userId: number };

  /**
   * Удаление комментария
   */
  comment_delete: ParameterStartDateDto & { commentId: number; number: string };

  /**
   * Создание комментария
   */
  comment_create: ParameterStartDateDto &
    Required<Pick<CommentCreateDto, 'text' | 'number' | 'isAnon'>> & {
      commentId: number;
    };

  /**
   * поиск номера
   */
  number_find: ParameterStartDateDto & {
    number: string;
    numberId: number;
    isNewNumber: boolean;
    isUpdate?: boolean;
  };
  /**
   * Ошибка поиск номера.
   * TODO: Добавить передачу текста ошибки
   */
  number_find_error: ParameterStartDateDto & { error: unknown };

  /**
   * Создание нового оператора
   */
  operator_create_auto: OperatorCreateDto;

  /**
   * Поиск номера человека пользователя
   */
  users_number_get: ParameterStartDateDto & {
    number: string;
    isAnon: boolean;
    isBlock: boolean;
  };
};
