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

const DAY_LABELS: { dow: keyof AvailabilitySchedule; label: string }[] = [
  { dow: '1', label: 'Lunes' },
  { dow: '2', label: 'Martes' },
  { dow: '3', label: 'Miércoles' },
  { dow: '4', label: 'Jueves' },
  { dow: '5', label: 'Viernes' },
  { dow: '6', label: 'Sábado' },
  { dow: '0', label: 'Domingo' },
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
  const [schedule, setSchedule] = useState<AvailabilitySchedule>(() =>
    buildInitial(initialSchedule),
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateDay = (dow: keyof AvailabilitySchedule, patch: Partial<DaySchedule>) => {
    setSchedule((prev) => ({ ...prev, [dow]: { ...prev[dow], ...patch } }));
  };

  const handleSave = async () => {
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
      toast.error(err instanceof Error ? err.message : 'Error al guardar el horario');
    } finally {
      setIsSaving(false);
    }
  };

  const enabledCount = DAY_LABELS.filter(({ dow }) => schedule[dow].enabled).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Horario semanal</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {enabledCount === 0
            ? 'Bloqueado todos los días'
            : enabledCount === 7
              ? 'Toda la semana'
              : `${enabledCount} día${enabledCount !== 1 ? 's' : ''} activo${enabledCount !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Day rows */}
      <div className="rounded-lg border border-border overflow-hidden">
        {DAY_LABELS.map(({ dow, label }, idx) => {
          const day = schedule[dow];
          const isWeekend = dow === '0' || dow === '6';

          return (
            <div
              key={dow}
              className={[
                'flex items-center gap-2 px-2.5 py-2',
                idx !== DAY_LABELS.length - 1 ? 'border-b border-border' : '',
                isWeekend ? 'bg-muted/30' : '',
                !day.enabled ? 'opacity-55' : '',
              ].join(' ')}
            >
              {/* Toggle + label — fixed, compact */}
              <div className="flex items-center gap-1.5 w-[7.5rem] shrink-0">
                <Switch
                  checked={day.enabled}
                  onCheckedChange={(checked) => updateDay(dow, { enabled: checked })}
                />
                <span className="text-sm font-medium truncate">{label}</span>
              </div>

              {/* Time window — fills remaining space */}
              {day.enabled ? (
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <Clock className="h-3 w-3 text-muted-foreground shrink-0" />

                  <Select
                    value={day.open}
                    onValueChange={(val) => updateDay(dow, { open: val })}
                  >
                    <SelectTrigger className="h-8 flex-1 min-w-0 text-xs px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.filter((t) => t < day.close).map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-xs text-muted-foreground shrink-0">–</span>

                  <Select
                    value={day.close}
                    onValueChange={(val) => updateDay(dow, { close: val })}
                  >
                    <SelectTrigger className="h-8 flex-1 min-w-0 text-xs px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.filter((t) => t > day.open).map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {t}
                        </SelectItem>
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

      <Button onClick={handleSave} disabled={isSaving} size="sm" className="w-full">
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
