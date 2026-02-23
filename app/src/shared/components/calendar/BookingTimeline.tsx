import { useMemo, useState, useEffect } from 'react';
import { Card } from '../../../ui';
import { format, addHours, startOfDay, parseISO, differenceInMinutes, isWithinInterval, isSameHour, isSameDay } from 'date-fns';
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
      {/* Date Navigation & Legend */}
      <Card className="bg-card p-3 rounded-xl border border-border shadow-sm space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <Button variant="outline" size="sm" onClick={handlePrevDay} className="h-9 w-9 p-0 rounded-full sm:rounded-md">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday} className="h-9 px-3 sm:px-4 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              Hoy
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextDay} className="h-9 w-9 p-0 rounded-full sm:rounded-md">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 flex items-center gap-2 font-bold text-primary px-3 py-2 bg-primary/5 rounded-full sm:rounded-lg justify-center sm:justify-end min-w-0">
            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="text-xs sm:text-sm md:text-base capitalize truncate">
              {viewDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>

        {/* Legend - Moved up & tightened */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[9px] sm:text-xs font-bold justify-center sm:justify-start px-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-green-500/30 border border-green-500 shadow-sm" />
            <span className="text-muted-foreground uppercase tracking-tight">En curso</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary/30 border border-primary/50 shadow-sm" />
            <span className="text-muted-foreground uppercase tracking-tight">Confirmada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-accent/30 border border-accent/50 shadow-sm" />
            <span className="text-muted-foreground uppercase tracking-tight">Pendiente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted border border-muted-foreground/30 shadow-sm" />
            <span className="text-muted-foreground uppercase tracking-tight">Finalizada/Otra</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-border bg-card shadow-lg relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20">
          <div className="min-w-[800px] sm:min-w-[1000px]">
            {/* Header with hours */}
            <div className="flex border-b border-border bg-muted/80 sticky top-0 z-40">
              <div className="w-40 sm:w-72 shrink-0 p-3 sm:p-4 font-bold sticky left-0 bg-muted/95 z-50 border-r border-border backdrop-blur-sm text-xs sm:text-base">
                Garaje / Plaza
              </div>
              <div className="flex-1 flex bg-muted/80 backdrop-blur-sm">
                {hours.map((hour) => {
                  const isCurrent = isSameHour(hour, currentTime) && isSameDay(hour, currentTime);
                  return (
                    <div
                      key={hour.toISOString()}
                      className={cn(
                        "flex-1 min-w-[60px] sm:min-w-[72px] shrink-0 p-2 text-left text-[10px] sm:text-xs font-bold border-r border-border/50",
                        isCurrent ? "bg-primary/15 text-primary" : "text-muted-foreground"
                      )}
                    >
                      {format(hour, 'HH:mm')}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="divide-y divide-border">
              {data.map((garage) => {
                // Collect all bookings for the aggregate garage row
                const allGarageBookings = garage.spots.flatMap(s => s.bookings);

                return (
                  <div key={garage.id}>
                    {/* Garage Row */}
                    <div
                      className="flex bg-muted/40 items-center cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50"
                      onClick={() => toggleGarage(garage.id)}
                    >
                      <div className="w-40 sm:w-72 shrink-0 p-3 sm:p-4 font-bold sticky left-0 bg-muted-foreground/10 z-30 border-r border-border flex items-center gap-2 backdrop-blur-sm bg-card/95 text-xs sm:text-sm truncate">
                        {expandedGarages.has(garage.id) ? (
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                        ) : (
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="truncate">{garage.name}</span>
                      </div>
                      <div className="flex-1 flex h-12 sm:h-16 bg-muted/20 relative">
                        {/* Visual pattern for non-rentable space */}
                        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                        {hours.map((hour) => {
                          const isCurrent = isSameHour(hour, currentTime) && isSameDay(hour, currentTime);
                          return (
                            <div
                              key={hour.toISOString()}
                              className={cn(
                                "flex-1 min-w-[60px] sm:min-w-[72px] shrink-0 border-r border-border/20 last:border-r-0",
                                isCurrent && "bg-primary/5"
                              )}
                            />
                          );
                        })}

                        {/* Aggregate Bookings in Garage Row */}
                        {!expandedGarages.has(garage.id) && allGarageBookings.map((booking, idx) => {
                          const start = parseISO(booking.startTime);
                          const end = parseISO(booking.endTime);
                          const dayStart = startOfDay(viewDate);
                          const timelineEnd = addHours(dayStart, TOTAL_HOURS);

                          if (end <= dayStart || start >= timelineEnd) return null;

                          const startMinutes = differenceInMinutes(start, dayStart);
                          const endMinutes = differenceInMinutes(end, dayStart);
                          const clampedStartHour = Math.max(0, startMinutes / 60);
                          const clampedEndHour = Math.min(TOTAL_HOURS, endMinutes / 60);
                          const duration = Math.max(0.5, clampedEndHour - clampedStartHour);

                          const left = (clampedStartHour / TOTAL_HOURS) * 100;
                          const width = (duration / TOTAL_HOURS) * 100;
                          const isActive = isWithinInterval(currentTime, { start, end });

                          return (
                            <div
                              key={`${booking.id}-agg-${idx}`}
                              className={cn(
                                "absolute top-4 bottom-4 rounded-full opacity-60 pointer-events-none transition-all z-10",
                                isActive ? "bg-green-500" :
                                  booking.status === 'confirmed' ? "bg-primary" :
                                    booking.status === 'pending' ? "bg-accent" :
                                      "bg-muted-foreground"
                              )}
                              style={{ left: `${left}%`, width: `${width}%` }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Spots Rows */}
                    {expandedGarages.has(garage.id) && garage.spots.map((spot) => (
                      <div key={spot.id} className="flex group border-b border-border/30 last:border-b-0">
                        <div className="w-40 sm:w-72 shrink-0 p-3 sm:p-4 pl-6 sm:pl-10 text-[10px] sm:text-sm font-semibold text-muted-foreground sticky left-0 bg-card/95 z-30 border-r border-border flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-sm truncate">
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(var(--primary),0.4)] shrink-0" />
                          <span className="truncate">{spot.name}</span>
                        </div>
                        <div className="flex-1 flex relative h-12 sm:h-16 bg-card">
                          {/* Hour grids */}
                          {hours.map((hour) => {
                            const isCurrent = isSameHour(hour, currentTime) && isSameDay(hour, currentTime);
                            return (
                              <div
                                key={hour.toISOString()}
                                className={cn(
                                  "flex-1 min-w-[60px] sm:min-w-[72px] shrink-0 border-r border-border/10 last:border-r-0",
                                  isCurrent && "bg-primary/5"
                                )}
                              />
                            );
                          })}

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

                            // Check if booking is currently active
                            const isActive = isWithinInterval(currentTime, { start, end });

                            return (
                              <div
                                key={booking.id}
                                className={cn(
                                  "absolute top-1.5 bottom-1.5 rounded-md border text-[8px] sm:text-[10px] p-1 sm:p-1.5 flex flex-col justify-center cursor-pointer transition-all hover:scale-[1.03] z-20 shadow-sm overflow-hidden",
                                  isActive ? "bg-green-500/30 border-green-500 text-green-700 font-bold shadow-md shadow-green-500/10" :
                                    booking.status === 'confirmed' ? "bg-primary/30 border-primary text-primary font-bold shadow-md shadow-primary/10" :
                                      booking.status === 'pending' ? "bg-accent/30 border-accent text-accent font-bold shadow-md shadow-accent/10" :
                                        "bg-muted border-muted-foreground/30 text-muted-foreground"
                                )}
                                style={{ left: `${left}%`, width: `${width}%` }}
                                onClick={() => onBookingClick?.(booking)}
                              >
                                <span className="font-bold truncate leading-tight">{booking.title}</span>
                                <span className="opacity-80 truncate leading-tight">
                                  {format(start, 'HH:mm')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
