'use client';

import { useState } from 'react';
import { useReport } from '../hooks/use-moderation';
import type { ReportTargetType } from '../services/moderation-service';
import { Button } from '@/components/ui/button';
import styles from './report-button.module.css';

interface ReportButtonProps {
  targetType: ReportTargetType;
  targetId: string;
}

export function ReportButton({ targetType, targetId }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const report = useReport();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (reason.trim().length < 3) return;
    await report.mutateAsync({ targetType, targetId, reason });
    setIsOpen(false);
    setReason('');
  }

  if (!isOpen) {
    return (
      <button type="button" onClick={() => setIsOpen(true)} className={styles.trigger}>
        Reportar
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="¿Por qué quieres reportar esto?"
        rows={2}
        maxLength={500}
        className={styles.textarea}
      />
      <div className={styles.actions}>
        <Button type="submit" disabled={report.isPending}>
          {report.isPending ? 'Enviando...' : 'Enviar reporte'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
          Cancelar
        </Button>
      </div>
      {report.isSuccess && <p className={styles.success}>Gracias, lo revisaremos.</p>}
    </form>
  );
}
