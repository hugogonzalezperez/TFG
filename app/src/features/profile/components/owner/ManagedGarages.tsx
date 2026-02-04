import { MapPin, Star, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Card, Badge, Button } from '../../../../ui';
import { parkingService } from '../../../parking/services/parking.service';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { AddSpotToGarageModal } from './AddSpotToGarageModal';

interface ManagedGaragesProps {
  garages: any[];
  isLoading: boolean;
}

export function ManagedGarages({ garages, isLoading }: ManagedGaragesProps) {
  const queryClient = useQueryClient();
  const [selectedGarageForSpot, setSelectedGarageForSpot] = useState<any>(null);

  const handleDeleteSpot = async (spotId: string, garageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plaza?')) return;

    try {
      await parkingService.deleteParkingSpot(spotId, garageId);
      queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
      alert('Plaza eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar plaza:', err);
      alert('Error al eliminar la plaza');
    }
  };

  const handleDeleteGarage = async (garageId: string, garageName: string, ownerId: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el garaje "${garageName}"? Esta acción borrará todas sus plazas y fotos asociadas.`)) return;

    try {
      await parkingService.deleteGarage(garageId);

      // Invalidación forzada
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['owner-garages', ownerId] }),
        queryClient.invalidateQueries({ queryKey: ['owner-stats', ownerId] })
      ]);

      alert('Garaje eliminado correctamente');
    } catch (err: any) {
      console.error('Error al eliminar garaje:', err);
      const message = err.message?.includes('violates foreign key constraint')
        ? 'No se puede eliminar el garaje porque tiene reservas activas o pasadas.'
        : 'Error al eliminar el garaje. Inténtalo de nuevo.';
      alert(message);
    }
  };

  if (isLoading) return (
    <Card className="p-12 text-center text-muted-foreground">
      No tienes ningún garaje registrado todavía.
    </Card>
  );

  return (
    <div className="space-y-6">
      {garages.map((garage) => (
        <Card key={garage.id} className="overflow-hidden border-2 border-border/50">
          {/* Garage Header */}
          <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {garage.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {garage.address}, {garage.city}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{garage.parking_spots?.length || 0} plazas</Badge>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 h-8"
                onClick={() => setSelectedGarageForSpot(garage)}
              >
                <Plus className="h-3.5 w-3.5" /> Añadir plaza
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteGarage(garage.id, garage.name, garage.owner_id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Spots List */}
          <div className="p-4 space-y-4">
            {garage.parking_spots && garage.parking_spots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {garage.parking_spots.map((spot: any) => (
                  <div key={spot.id} className="flex items-center gap-4 p-3 border border-border rounded-xl bg-card hover:border-primary transition-colors">
                    <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center text-muted-foreground overflow-hidden">
                      <img
                        src={'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400'}
                        alt={spot.spot_number}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-bold">Plaza {spot.spot_number}</span>
                        <Badge className={spot.is_active ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-muted text-muted-foreground'}>
                          {spot.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-primary font-bold">{spot.current_price_per_hour}€/h</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDeleteSpot(spot.id, garage.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No hay plazas registradas en este garaje.</p>
            )}
          </div>
        </Card>
      ))}

      {selectedGarageForSpot && (
        <AddSpotToGarageModal
          garage={selectedGarageForSpot}
          isOpen={!!selectedGarageForSpot}
          onClose={() => {
            setSelectedGarageForSpot(null);
            queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
          }}
        />
      )}
    </div>
  );
}
