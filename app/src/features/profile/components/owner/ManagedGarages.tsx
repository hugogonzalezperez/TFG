import { MapPin, Edit, Trash2, Plus, Building2 } from 'lucide-react';
import { Card, Badge, Button, Switch, ConfirmationDialog, EmptyState, GarageCardSkeleton } from '../../../../ui';
import { parkingService } from '../../../parking/services/parking.service';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { AddSpotToGarageModal } from './AddSpotToGarageModal';
import { EditGarageModal } from './EditGarageModal';
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
    return (
      <div className="space-y-6">
        <GarageCardSkeleton />
        <GarageCardSkeleton />
      </div>
    );
  }

  if (garages.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="Sin garajes registrados"
        description="Todavía no has registrado ningún garaje. ¡Empieza ahora para ganar dinero alquilando tus plazas!"
        actionLabel="Registrar primer garaje"
        onAction={onAddGarage}
      />
    );
  }
  return (
    <div className="space-y-6">
      {garages.map((garage) => {
        const garageImage = garage.images?.[0] ||
          garage.garage_images?.find((img: any) => img.is_main)?.image_url ||
          garage.garage_images?.[0]?.image_url || null;

        return (
          <Card key={garage.id} className="overflow-hidden border border-border/50">
            {/* Garage Header */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                {/* Garage Photo */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 border border-border bg-muted">
                  {garageImage ? (
                    <img
                      src={garageImage}
                      alt={garage.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold truncate">{garage.name}</h3>
                    <Switch
                      checked={garage.is_active}
                      onCheckedChange={(checked) => handleToggleGarageStatus(garage.id, checked)}
                      className="scale-90"
                    />
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1 truncate font-medium">
                    <MapPin className="h-3 w-3 flex-shrink-0" /> {garage.address}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-1.5 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-border/30">
                <div className="sm:hidden">
                  <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0">
                    {garage.parking_spots?.length || 0} PLAZAS
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    {garage.parking_spots?.length || 0} plazas
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-8 md:h-9 text-[10px] md:text-xs font-bold px-2 md:px-4 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary"
                    onClick={() => setSelectedGarageForSpot(garage)}
                  >
                    <Plus className="h-3.5 w-3.5" /> <span>Añadir plaza</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9"
                    onClick={() => setEditingItem({ garage })}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9 text-destructive hover:bg-destructive/10"
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
            </div>

            {/* Spots List */}
            <div className="p-3 space-y-2">
              {garage.parking_spots && garage.parking_spots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {garage.parking_spots.map((spot: any) => {
                    const spotImage = spot.images?.[0] ||
                      spot.parking_spot_images?.[0]?.image_url ||
                      garageImage ||
                      'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400';

                    return (
                      <div
                        key={spot.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-border rounded-xl bg-card/50 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex-shrink-0 overflow-hidden border border-border shadow-sm">
                            <img
                              src={spotImage}
                              alt={spot.spot_number}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                              <div className="flex items-center gap-1.5 md:gap-2">
                                <span className="font-bold text-[14px] md:text-base">Plaza {spot.spot_number}</span>
                                <SpotFavoritesUsers spotId={spot.id} />
                              </div>
                              <Switch
                                checked={spot.is_active}
                                onCheckedChange={(checked) => handleToggleSpotStatus(spot.id, checked)}
                                className="sm:hidden scale-75"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-primary">{spot.current_price_per_hour}€/h</span>
                              <Badge
                                variant={spot.is_active ? 'default' : 'secondary'}
                                className={`text-[9px] font-black px-1.5 py-0 leading-tight ${spot.is_active ? 'bg-green-500 hover:bg-green-600' : ''}`}
                              >
                                {spot.is_active ? 'ACTIVA' : 'INACTIVA'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-border/30">
                          <div className="hidden sm:block">
                            <Switch
                              checked={spot.is_active}
                              onCheckedChange={(checked) => handleToggleSpotStatus(spot.id, checked)}
                              className="scale-90"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 md:h-9 gap-1.5 text-xs font-semibold px-2 md:px-3 hover:bg-primary/5"
                              onClick={() => setEditingItem({ garage, spot })}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="md:inline">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 md:h-9 md:w-9 text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteConfirmation({
                                type: 'spot',
                                id: spot.id,
                                garageId: garage.id
                              })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic py-2">No hay plazas registradas en este garaje.</p>
              )}
            </div>
          </Card>
        );
      })}

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
