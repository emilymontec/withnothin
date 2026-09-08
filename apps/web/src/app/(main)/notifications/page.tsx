'use client';

import { useMarkAllNotificationsRead, useNotifications } from '@/features/notifications/hooks/use-notifications';
import { NotificationItem } from '@/features/notifications/components/notification-item';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Notificaciones</h2>
        {notifications.length > 0 && (
          <Button variant="secondary" onClick={() => markAllRead.mutate()}>
            Marcar todas como leídas
          </Button>
        )}
      </div>
      {isLoading && <p>Cargando...</p>}
      {!isLoading && notifications.length === 0 && <p>No tienes notificaciones todavía.</p>}
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
