import { MapPin, Edit, Trash2, Plus } from 'lucide-react';
import { Card, Badge, Button, Switch, ConfirmationDialog } from '../../../../ui';
import { parkingService } from '../../../parking/services/parking.service';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { AddSpotToGarageModal } from './AddSpotToGarageModal';
import { EditGarageModal } from './EditGarageModal';
import { GarageSkeletonLoader } from '../shared/ProfileSkeletonLoaders';
import { SpotFavoritesUsers } from './SpotFavoritesUsers';

interface ManagedGaragesProps {
  garages: any[];
  isLoading: boolean;
  onAddGarage?: () => void;
}

export function ManagedGarages({ garages, isLoading, onAddGarage }: ManagedGaragesProps) {
  const queryClient = useQueryClient();
  const [selectedGarageForSpot, setSelectedGarageForSpot] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<{ garage: any; spot?: any } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'garage' | 'spot';
    id: string;
    name?: string;
    garageId?: string;
    ownerId?: string;
  } | null>(null);

  const handleToggleGarageStatus = async (garageId: string, isActive: boolean) => {
    try {
      await parkingService.updateGarage(garageId, { is_active: isActive });
      queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
      toast.success(`Garaje ${isActive ? 'activado' : 'desactivado'} correctamente`);
    } catch (err) {
      console.error('Error al cambiar estado del garaje:', err);
      toast.error('Error al cambiar el estado del garaje');
    }
  };

  const handleToggleSpotStatus = async (spotId: string, isActive: boolean) => {
    try {
      await parkingService.updateParkingSpot(spotId, { is_active: isActive });
      queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
      toast.success(`Plaza ${isActive ? 'activada' : 'desactivada'} correctamente`);
    } catch (err) {
      console.error('Error al cambiar estado de la plaza:', err);
      toast.error('Error al cambiar el estado de la plaza');
    }
  };

  const handleDeleteSpot = async (spotId: string, garageId: string) => {
    try {
      await parkingService.deleteParkingSpot(spotId, garageId);
      queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
      toast.success('Plaza eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar plaza:', err);
      toast.error('Error al eliminar la plaza');
    }
  };

  const handleDeleteGarage = async (garageId: string, ownerId: string) => {
    try {
      await parkingService.deleteGarage(garageId);

      // Invalidación forzada
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['owner-garages', ownerId] }),
        queryClient.invalidateQueries({ queryKey: ['owner-stats', ownerId] })
      ]);

      toast.success('Garaje eliminado correctamente');
    } catch (err: any) {
      console.error('Error al eliminar garaje:', err);
      const message = err.message?.includes('violates foreign key constraint')
        ? 'No se puede eliminar el garaje porque tiene reservas activas o pasadas.'
        : 'Error al eliminar el garaje. Inténtalo de nuevo.';
      toast.error(message);
    }
  };

  if (isLoading) {
    return <GarageSkeletonLoader />;
  }

  if (garages.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2">
        <div className="max-w-[300px] mx-auto space-y-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Plus className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Sin garajes registrados</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Todavía no has registrado ningún garaje. ¡Empieza ahora para ganar dinero alquilando tus plazas!
            </p>
            {onAddGarage && (
              <Button onClick={onAddGarage} className="bg-primary hover:bg-primary/90">
                Registrar primer garaje
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {garages.map((garage) => (
        <Card key={garage.id} className="overflow-hidden border-2 border-border/50">
          {/* Garage Header */}
          <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {garage.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {garage.address}, {garage.city}
                </p>
              </div>
              <div className="flex flex-col items-center border-l border-border pl-4 hidden sm:flex">
                <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                  {garage.is_active ? 'Activo' : 'Inactivo'}
                </span>
                <Switch
                  checked={garage.is_active}
                  onCheckedChange={(checked) => handleToggleGarageStatus(garage.id, checked)}
                />
              </div>
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
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditingItem({ garage })}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteConfirmation({
                  type: 'garage',
                  id: garage.id,
                  name: garage.name,
                  ownerId: garage.owner_id
                })}
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
                  <div
                    key={spot.id}
                    className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card hover:border-primary/50 transition-all group relative"
                  >
                    <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center text-muted-foreground overflow-hidden border border-border">
                      <img
                        src={spot.parking_spot_images?.[0]?.image_url || garage.garage_images?.find((img: any) => img.is_main)?.image_url || garage.garage_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400'}
                        alt={spot.spot_number}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Plaza {spot.spot_number}</span>
                          <SpotFavoritesUsers spotId={spot.id} />
                          <span className="ml-2 text-sm text-primary font-semibold">{spot.current_price_per_hour}€/h</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Disponible</span>
                            <Switch
                              checked={spot.is_active}
                              onCheckedChange={(checked) => handleToggleSpotStatus(spot.id, checked)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <Badge
                          variant={spot.is_active ? 'default' : 'secondary'}
                          className={spot.is_active ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {spot.is_active ? 'ACTIVA' : 'INACTIVA'}
                        </Badge>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem({ garage, spot });
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmation({
                                type: 'spot',
                                id: spot.id,
                                garageId: garage.id
                              });
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      {editingItem && (
        <EditGarageModal
          isOpen={!!editingItem}
          garage={editingItem.garage}
          spot={editingItem.spot}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
          }}
        />
      )}

      {deleteConfirmation && (
        <ConfirmationDialog
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          onConfirm={() => {
            if (deleteConfirmation.type === 'garage') {
              handleDeleteGarage(deleteConfirmation.id, deleteConfirmation.ownerId!);
            } else {
              handleDeleteSpot(deleteConfirmation.id, deleteConfirmation.garageId!);
            }
          }}
          title={deleteConfirmation.type === 'garage' ? 'Eliminar Garaje' : 'Eliminar Plaza'}
          description={
            deleteConfirmation.type === 'garage'
              ? `¿Estás seguro de que quieres eliminar el garaje "${deleteConfirmation.name}"? Esta acción borrará todas sus plazas y fotos asociadas.`
              : '¿Estás seguro de que quieres eliminar esta plaza?'
          }
          confirmText="Eliminar"
          variant="destructive"
        />
      )}
    </div>
  );
}
