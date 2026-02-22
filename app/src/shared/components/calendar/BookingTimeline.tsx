import { useMemo, useState } from 'react';
import { Card } from '../../../ui';
import { format, addHours, startOfDay, parseISO, differenceInMinutes } from 'date-fns';
import { ChevronDown, ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../../../ui/button';

export interface CalendarBooking {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export interface CalendarSpot {
  id: string;
  name: string;
  bookings: CalendarBooking[];
}

export interface CalendarGarage {
  id: string;
  name: string;
  spots: CalendarSpot[];
}

interface BookingTimelineProps {
  data: CalendarGarage[];
  viewDate: Date;
  onDateChange?: (date: Date) => void;
  onBookingClick?: (booking: CalendarBooking) => void;
}

export function BookingTimeline({ data, viewDate, onDateChange, onBookingClick }: BookingTimelineProps) {
  const [expandedGarages, setExpandedGarages] = useState<Set<string>>(new Set(data.map(g => g.id)));

  const toggleGarage = (id: string) => {
    const newExpanded = new Set(expandedGarages);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedGarages(newExpanded);
  };

  const handlePrevDay = () => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange?.(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange?.(newDate);
  };

  const handleToday = () => {
    onDateChange?.(new Date());
  };

  const TOTAL_HOURS = 29; // 24 hours + 5 extra hours into the next day

  const hours = useMemo(() => {
    return Array.from({ length: TOTAL_HOURS }).map((_, i) => addHours(startOfDay(viewDate), i));
  }, [viewDate]);

  return (
    <div className="space-y-4">
      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-card p-2 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday} className="px-4">
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 font-bold text-primary">
          <CalendarIcon className="h-4 w-4" />
          {viewDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      <Card className="overflow-hidden border-border bg-card shadow-lg relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20">
          <div className="min-w-[1000px]">
            {/* Header with hours */}
            <div className="flex border-b border-border bg-muted/80 sticky top-0 z-40">
              <div className="w-72 shrink-0 p-4 font-bold sticky left-0 bg-muted/95 z-50 border-r border-border backdrop-blur-sm">
                Garaje / Plaza
              </div>
              <div className="flex-1 flex bg-muted/80 backdrop-blur-sm">
                {hours.map((hour) => (
                  <div key={hour.toISOString()} className="flex-1 min-w-[72px] shrink-0 p-2 text-left text-xs font-bold text-muted-foreground border-r border-border/50">
                    {format(hour, 'HH:mm')}
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="divide-y divide-border">
              {data.map((garage) => (
                <div key={garage.id}>
                  {/* Garage Row */}
                  <div
                    className="flex bg-muted/40 items-center cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50"
                    onClick={() => toggleGarage(garage.id)}
                  >
                    <div className="w-72 shrink-0 p-4 font-bold sticky left-0 bg-muted-foreground/10 z-30 border-r border-border flex items-center gap-2 backdrop-blur-sm bg-card/95">
                      {expandedGarages.has(garage.id) ? (
                        <ChevronDown className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      {garage.name}
                    </div>
                    <div className="flex-1 flex h-16 bg-muted/20 relative">
                      {/* Visual pattern for non-rentable space */}
                      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                      {hours.map((hour) => (
                        <div key={hour.toISOString()} className="flex-1 min-w-[72px] shrink-0 border-r border-border/20 last:border-r-0" />
                      ))}
                    </div>
                  </div>

                  {/* Spots Rows */}
                  {expandedGarages.has(garage.id) && garage.spots.map((spot) => (
                    <div key={spot.id} className="flex group border-b border-border/30 last:border-b-0">
                      <div className="w-72 shrink-0 p-4 pl-10 text-sm font-semibold text-muted-foreground sticky left-0 bg-card/95 z-30 border-r border-border flex items-center gap-3 backdrop-blur-sm shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
                        {spot.name}
                      </div>
                      <div className="flex-1 flex relative h-16 bg-card">
                        {/* Hour grids */}
                        {hours.map((hour) => (
                          <div key={hour.toISOString()} className="flex-1 min-w-[72px] shrink-0 border-r border-border/10 last:border-r-0" />
                        ))}

                        {/* Bookings */}
                        {spot.bookings.map((booking) => {
                          const start = parseISO(booking.startTime);
                          const end = parseISO(booking.endTime);

                          // Calculate position
                          const dayStart = startOfDay(viewDate);
                          const timelineEnd = addHours(dayStart, TOTAL_HOURS);

                          // Only show if it overlaps with our 29-hour timeline
                          if (end <= dayStart || start >= timelineEnd) {
                            return null;
                          }

                          const startMinutes = differenceInMinutes(start, dayStart);
                          const endMinutes = differenceInMinutes(end, dayStart);

                          const startHour = startMinutes / 60;
                          const endHour = endMinutes / 60;

                          // Clamp hours to prevent drawing outside the container
                          const clampedStartHour = Math.max(0, startHour);
                          const clampedEndHour = Math.min(TOTAL_HOURS, endHour);
                          const duration = Math.max(0.5, clampedEndHour - clampedStartHour);

                          const left = (clampedStartHour / TOTAL_HOURS) * 100;
                          const width = (duration / TOTAL_HOURS) * 100;

                          return (
                            <div
                              key={booking.id}
                              className={cn(
                                "absolute top-2 h-12 rounded-md border text-[10px] p-1.5 flex flex-col justify-center cursor-pointer transition-all hover:scale-[1.03] z-20 shadow-sm",
                                booking.status === 'confirmed' ? "bg-primary/30 border-primary text-primary font-bold shadow-md shadow-primary/10" :
                                  booking.status === 'pending' ? "bg-accent/30 border-accent text-accent font-bold shadow-md shadow-accent/10" :
                                    "bg-muted border-muted-foreground/30 text-muted-foreground"
                              )}
                              style={{ left: `${left}%`, width: `${width}%` }}
                              onClick={() => onBookingClick?.(booking)}
                            >
                              <span className="font-bold truncate">{booking.title}</span>
                              <span className="opacity-80 truncate">
                                {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4 bg-muted/30 border-border flex gap-6 text-xs font-semibold justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/30 border border-primary shadow-sm" />
          <span>Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/30 border border-accent shadow-sm" />
          <span>Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-grey-200 border border-grey-300 shadow-sm" />
          <span>Finalizada/Otra</span>
        </div>
      </Card>
    </div>
  );
}
