import Link from 'next/link';
import type { AppNotification } from '../services/notifications-service';
import { useMarkNotificationRead } from '../hooks/use-notifications';
import styles from './notification-item.module.css';

function describe(notification: AppNotification): string {
  switch (notification.type) {
    case 'LIKE':
      return 'Le dio like a tu post';
    case 'COMMENT':
      return 'Comentó tu post';
    case 'FOLLOW':
      return 'Empezó a seguirte';
    default:
      return 'Tienes una notificación nueva';
  }
}

function linkFor(notification: AppNotification): string | null {
  const postId = notification.payload?.postId;
  if (typeof postId === 'string') {
    return `/posts/${postId}`;
  }
  return null;
}

export function NotificationItem({ notification }: { notification: AppNotification }) {
  const markRead = useMarkNotificationRead();
  const href = linkFor(notification);
  const content = describe(notification);

  function handleClick() {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  }

  const body = (
    <div
      className={`${styles.item} ${notification.isRead ? '' : styles.unread}`}
      onClick={handleClick}
    >
      <p>{content}</p>
    </div>
  );

  return href ? (
    <Link href={href} onClick={handleClick} className={styles.link}>
      {body}
    </Link>
  ) : (
    body
  );
}
