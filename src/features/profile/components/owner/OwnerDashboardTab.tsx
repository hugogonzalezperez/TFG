import { useMemo, useState } from 'react';
import { OwnerStatsRow } from './OwnerStatsRow';
import { BookingTimeline, CalendarGarage } from '../../../../shared/components/calendar/BookingTimeline';

interface OwnerDashboardTabProps {
  stats: any;
  garages: any[];
  bookings: any[];
}

export function OwnerDashboardTab({ stats, garages, bookings }: OwnerDashboardTabProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const timelineData = useMemo(() => {
    return garages.map((garage): CalendarGarage => {
      return {
        id: garage.id,
        name: garage.name,
        spots: garage.parking_spots.map((spot: any) => {
          // Find bookings for this spot
          // Note: Check both spot_id and parking_spot_id for compatibility
          const spotBookings = bookings
            .filter((b) => (b.spot_id === spot.id || b.parking_spot_id === spot.id))
            .map((b) => ({
              id: b.id,
              startTime: b.start_time,
              endTime: b.end_time,
              title: b.renter?.name || 'Reserva',
              status: b.status,
            }));

          return {
            id: spot.id,
            name: spot.spot_number,
            bookings: spotBookings,
          };
        }),
      };
    });
  }, [garages, bookings]);

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <OwnerStatsRow stats={stats} />

      {/* Timeline Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold px-1">Calendario de Ocupación</h2>
        <BookingTimeline
          data={timelineData}
          viewDate={viewDate}
          onDateChange={setViewDate}
        />
      </div>
    </div>
  );
}
