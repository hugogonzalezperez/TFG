import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '../shared/lib/cn';

export interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable "HH:MM". Slots before this are disabled. */
  minTime?: string;
  /** Minute increment. Defaults to 1 (every minute). */
  step?: 1 | 5 | 15 | 30;
  /** Extra predicate for disabling specific slots (e.g. owner schedule). */
  disabledTimes?: (time: string) => boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// ─── constants ───────────────────────────────────────────────────────────────

const ITEM_H = 36;
const VISIBLE = 5;
const PAD = Math.floor(VISIBLE / 2);
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

function buildMinutes(step: number): string[] {
  const arr: string[] = [];
  for (let m = 0; m < 60; m += step)
    arr.push(String(m).padStart(2, '0'));
  return arr;
}

// ─── slot disable logic ───────────────────────────────────────────────────────

function isSlotDisabled(
  hh: string,
  mm: string,
  minTime?: string,
  extra?: (t: string) => boolean,
): boolean {
  const t = `${hh}:${mm}`;
  if (minTime && t < minTime) return true;
  return extra?.(t) ?? false;
}

// ─── scroll column ────────────────────────────────────────────────────────────

function ScrollColumn({
  items,
  selected,
  onSelect,
  checkDisabled,
  ariaLabel,
}: {
  items: string[];
  selected: string | null;
  onSelect: (v: string) => void;
  checkDisabled: (v: string) => boolean;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected || !ref.current) return;
    const idx = items.indexOf(selected);
    if (idx >= 0) ref.current.scrollTop = idx * ITEM_H;
  }, [selected, items]);

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
      className="overflow-y-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden w-full"
      style={{ height: VISIBLE * ITEM_H, scrollbarWidth: 'none' }}
      onWheel={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        const idx = selected ? items.indexOf(selected) : -1;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = items.slice(idx + 1).find(v => !checkDisabled(v));
          if (next) onSelect(next);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = [...items].slice(0, Math.max(idx, 0)).reverse().find(v => !checkDisabled(v));
          if (prev) onSelect(prev);
        }
      }}
    >
      <div style={{ height: PAD * ITEM_H }} aria-hidden="true" />

      {items.map((v) => {
        const dis = checkDisabled(v);
        const active = v === selected;
        return (
          <div
            key={v}
            role="option"
            aria-selected={active}
            aria-disabled={dis}
            onClick={() => !dis && onSelect(v)}
            className={cn(
              'flex w-full items-center justify-center font-mono text-sm transition-colors rounded-md select-none',
              dis
                ? 'opacity-20 cursor-not-allowed'
                : active
                  ? 'bg-primary text-primary-foreground font-semibold z-10 relative'
                  : 'cursor-pointer hover:bg-accent/70',
            )}
            style={{ height: ITEM_H }}
          >
            {v}
          </div>
        );
      })}

      <div style={{ height: PAD * ITEM_H }} aria-hidden="true" />
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function TimePicker({
  value,
  onChange,
  minTime,
  step = 1,
  disabledTimes,
  placeholder = 'Hora',
  className,
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const minutes = React.useMemo(() => buildMinutes(step), [step]);

  const selectedHH = value ? value.slice(0, 2) : null;
  const selectedMM = value ? value.slice(3, 5) : null;

  const findValidMM = (hh: string, preferMM: string | null): string => {
    const pref = preferMM ?? minutes[0];
    if (!isSlotDisabled(hh, pref, minTime, disabledTimes)) return pref;
    return minutes.find(m => !isSlotDisabled(hh, m, minTime, disabledTimes)) ?? pref;
  };

  const handleHH = (hh: string) => {
    const mm = findValidMM(hh, selectedMM);
    onChange(`${hh}:${mm}`);
  };

  const handleMM = (mm: string) => {
    const hh = selectedHH ?? '00';
    if (!isSlotDisabled(hh, mm, minTime, disabledTimes)) {
      onChange(`${hh}:${mm}`);
    }
  };

  const isHourDisabled = (h: string) =>
    minutes.every(m => isSlotDisabled(h, m, minTime, disabledTimes));

  const isMinuteDisabled = (m: string) =>
    isSlotDisabled(selectedHH ?? '00', m, minTime, disabledTimes);

  // Center band: 8px top-padding + PAD rows above center slot
  const bandTop = 8 + PAD * ITEM_H;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="select"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal px-4 border border-border',
            'hover:bg-foreground/5 hover:text-foreground transition-all',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-primary shrink-0" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 overflow-hidden"
        style={{ width: '12rem' }}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Column labels — grid mirrors body layout */}
        <div
          className="grid border-b border-border bg-muted/30 px-2 py-2"
          style={{ gridTemplateColumns: '1fr 2rem 1fr' }}
        >
          <span className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">HH</span>
          <span />
          <span className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">MM</span>
        </div>

        {/* Scroll area */}
        <div className="relative p-2">
          {/* Center selection indicator band */}
          <div
            className="pointer-events-none absolute inset-x-2 rounded-md border border-border bg-muted/40"
            style={{ top: bandTop, height: ITEM_H }}
            aria-hidden="true"
          />

          {/* Columns — grid ensures equal widths without flex collapse */}
          <div
            className="grid"
            style={{ gridTemplateColumns: '1fr 2rem 1fr' }}
          >
            <ScrollColumn
              items={HOURS}
              selected={selectedHH}
              onSelect={handleHH}
              checkDisabled={isHourDisabled}
              ariaLabel="Hora"
            />
            <div className="self-center text-center text-muted-foreground text-sm font-bold leading-none">
              :
            </div>
            <ScrollColumn
              items={minutes}
              selected={selectedMM}
              onSelect={handleMM}
              checkDisabled={isMinuteDisabled}
              ariaLabel="Minutos"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
