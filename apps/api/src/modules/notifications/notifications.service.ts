import { Injectable, Logger } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationType } from '@withnothin/shared-types';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  /**
   * Punto único desde el que Likes/Comments/Follows disparan una
   * notificación. Deliberadamente NO propaga errores: si notificar
   * falla, la acción principal (dar like, comentar, seguir) igual
   * debe completarse — una notificación perdida no es motivo para
   * romper la experiencia del usuario.
   */
  async notify(params: {
    userId: string;
    type: NotificationType;
    payload?: Record<string, unknown>;
    // Evita autonotificarse (ej. comentar tu propio post).
    skipIfActorIsRecipient?: { actorId: string };
  }): Promise<void> {
    if (params.skipIfActorIsRecipient && params.skipIfActorIsRecipient.actorId === params.userId) {
      return;
    }

    try {
      await this.notificationsRepository.create({
        userId: params.userId,
        type: params.type,
        payload: params.payload,
      });
    } catch (error) {
      this.logger.error(`No se pudo crear notificación para ${params.userId}`, error as Error);
    }
  }

  async findMyNotifications(
    userId: string,
    cursor: string | undefined,
    limit: number,
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationsRepository.findByUser(userId, cursor, limit);
    return notifications.map((n) => this.toResponseDto(n));
  }

  getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.countUnread(userId);
  }

  markRead(userId: string, id: string): Promise<void> {
    return this.notificationsRepository.markRead(id, userId);
  }

  markAllRead(userId: string): Promise<void> {
    return this.notificationsRepository.markAllRead(userId);
  }

  private toResponseDto(notification: Notification): NotificationResponseDto {
    return new NotificationResponseDto({
      id: notification.id,
      type: notification.type,
      payload: notification.payload as Record<string, unknown> | null,
      isRead: notification.readAt !== null,
      createdAt: notification.createdAt,
    });
  }
}
