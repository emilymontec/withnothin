'use client';

import { useState } from 'react';
import { useAdminReports, useUpdateReportStatus } from '@/features/admin/hooks/use-admin';
import { Button } from '@/components/ui/button';

export default function AdminReportsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>('PENDING');
  const { data: reports = [], isLoading } = useAdminReports(statusFilter);
  const updateStatus = useUpdateReportStatus();

  return (
    <div>
      <h2>Reportes</h2>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        {['PENDING', 'REVIEWED', 'DISMISSED', undefined].map((status) => (
          <Button
            key={status ?? 'all'}
            variant={statusFilter === status ? 'primary' : 'secondary'}
            onClick={() => setStatusFilter(status)}
          >
            {status ?? 'Todos'}
          </Button>
        ))}
      </div>

      {isLoading && <p>Cargando...</p>}
      {!isLoading && reports.length === 0 && <p>No hay reportes con este filtro.</p>}

      {reports.map((report) => (
        <div key={report.id} style={{ borderTop: '1px solid var(--color-muted)', padding: '0.85rem 0' }}>
          <p>
            <strong>{report.targetType}</strong> · {report.targetId}
          </p>
          <p>{report.reason}</p>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>Estado: {report.status}</p>
          {report.status === 'PENDING' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button onClick={() => updateStatus.mutate({ reportId: report.id, status: 'REVIEWED' })}>
                Marcar revisado
              </Button>
              <Button
                variant="secondary"
                onClick={() => updateStatus.mutate({ reportId: report.id, status: 'DISMISSED' })}
              >
                Descartar
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
