import { useState } from 'react';
import { toast } from 'sonner';
import { Clock, Save, Loader2, Calendar } from 'lucide-react';
import { Button } from '../../../../ui';
import { Switch } from '../../../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select';
import { parkingService } from '../../../parking/services/parking.service';
import { AvailabilitySchedule, DaySchedule } from '../../../parking/types/parking.types';

interface SpotScheduleEditorProps {
  spotId: string;
  initialSchedule?: AvailabilitySchedule | null;
  onSaved?: () => void;
}

const DAY_LABELS: { dow: keyof AvailabilitySchedule; label: string; short: string }[] = [
  { dow: '1', label: 'Lunes',     short: 'L' },
  { dow: '2', label: 'Martes',    short: 'M' },
  { dow: '3', label: 'Miércoles', short: 'X' },
  { dow: '4', label: 'Jueves',    short: 'J' },
  { dow: '5', label: 'Viernes',   short: 'V' },
  { dow: '6', label: 'Sábado',    short: 'S' },
  { dow: '0', label: 'Domingo',   short: 'D' },
];

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 30]) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
}

const DEFAULT_SCHEDULE: AvailabilitySchedule = {
  '0': { enabled: false, open: '08:00', close: '20:00' },
  '1': { enabled: true,  open: '08:00', close: '20:00' },
  '2': { enabled: true,  open: '08:00', close: '20:00' },
  '3': { enabled: true,  open: '08:00', close: '20:00' },
  '4': { enabled: true,  open: '08:00', close: '20:00' },
  '5': { enabled: true,  open: '08:00', close: '20:00' },
  '6': { enabled: false, open: '08:00', close: '20:00' },
};

function buildInitial(schedule: AvailabilitySchedule | null | undefined): AvailabilitySchedule {
  if (!schedule) return DEFAULT_SCHEDULE;
  const result = { ...DEFAULT_SCHEDULE };
  for (const key of Object.keys(schedule) as (keyof AvailabilitySchedule)[]) {
    result[key] = schedule[key];
  }
  return result;
}

export function SpotScheduleEditor({ spotId, initialSchedule, onSaved }: SpotScheduleEditorProps) {
  const [schedule, setSchedule] = useState<AvailabilitySchedule>(() => buildInitial(initialSchedule));
  const [isSaving, setIsSaving] = useState(false);

  const updateDay = (dow: keyof AvailabilitySchedule, patch: Partial<DaySchedule>) => {
    setSchedule(prev => ({
      ...prev,
      [dow]: { ...prev[dow], ...patch },
    }));
  };

  const handleSave = async () => {
    // Client-side coherence check before hitting the server
    for (const { dow, label } of DAY_LABELS) {
      const day = schedule[dow];
      if (day.enabled && day.open >= day.close) {
        toast.error(`${label}: la hora de apertura debe ser anterior al cierre.`);
        return;
      }
    }

    setIsSaving(true);
    try {
      await parkingService.updateSpotSchedule(spotId, schedule);
      toast.success('Horario guardado correctamente');
      onSaved?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el horario';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const enabledCount = DAY_LABELS.filter(({ dow }) => schedule[dow].enabled).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Horario de disponibilidad</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {enabledCount === 0
            ? 'Plaza bloqueada todos los días'
            : enabledCount === 7
              ? 'Disponible toda la semana'
              : `${enabledCount} día${enabledCount !== 1 ? 's' : ''} activo${enabledCount !== 1 ? 's' : ''}`}
        </span>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        {DAY_LABELS.map(({ dow, label }, idx) => {
          const day = schedule[dow];
          const isWeekend = dow === '0' || dow === '6';

          return (
            <div
              key={dow}
              className={[
                'flex items-center gap-3 px-3 py-2.5',
                idx !== DAY_LABELS.length - 1 ? 'border-b border-border' : '',
                isWeekend ? 'bg-muted/30' : '',
                !day.enabled ? 'opacity-60' : '',
              ].join(' ')}
            >
              {/* Day toggle */}
              <div className="flex items-center gap-2 w-28 shrink-0">
                <Switch
                  checked={day.enabled}
                  onCheckedChange={(checked) => updateDay(dow, { enabled: checked })}
                />
                <span className="text-sm font-medium">{label}</span>
              </div>

              {/* Time window */}
              {day.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Select
                    value={day.open}
                    onValueChange={(val) => updateDay(dow, { open: val })}
                  >
                    <SelectTrigger className="h-8 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.filter(t => t < day.close).map(t => (
                        <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-xs text-muted-foreground">→</span>

                  <Select
                    value={day.close}
                    onValueChange={(val) => updateDay(dow, { close: val })}
                  >
                    <SelectTrigger className="h-8 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.filter(t => t > day.open).map(t => (
                        <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic flex-1">No disponible</span>
              )}
            </div>
          );
        })}
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        size="sm"
        className="w-full"
      >
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Guardar horario
      </Button>
    </div>
  );
}
