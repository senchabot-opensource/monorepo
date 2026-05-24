import type { AlertEvent, AlertPosition } from '#/lib/alert-config';
import { POSITION_CLASSES } from '#/lib/alert-config';
import { AlertCard } from './alert-card';

interface AlertContainerProps {
  alerts: AlertEvent[];
  position: AlertPosition;
  glow?: boolean;
}

export function AlertContainer({ alerts, position, glow = true }: AlertContainerProps) {
  const positionClass = POSITION_CLASSES[position] || POSITION_CLASSES['center-right'];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col gap-3 pointer-events-none ${positionClass}`}
      style={{ paddingTop: '15vh', paddingBottom: '15vh' }}
    >
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          glow={glow}
        />
      ))}
    </div>
  );
}
