import { CircleX } from 'lucide-react';
import { Card, Button, Label, Input, Textarea, ConfirmationDialog } from '../../../../ui';
import { AddressSearch } from '../../../../ui/address-search';
import { LocationPicker } from '../../../../shared/components/map/LocationPicker';
import { GarageImageUploader } from '../GarageImageUploader';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Map, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../../auth';
import { parkingService } from '../../../parking/services/parking.service';
import { toast } from 'sonner';

interface AddSpotFormProps {
  userId: string;
  onCancel: () => void;
}

export function AddSpotForm({ userId, onCancel }: AddSpotFormProps) {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    lat: 0,
    lng: 0,
    price: '',
    type: 'Cubierta',
    spotNumber: '',
    description: '',
    images: [] as string[],  // Spot images
    garageImages: [] as string[]  // Garage image (max 1)
  });
  const [createSpot, setCreateSpot] = useState(true);

  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleAddressSelect = (result: any) => {
    // Intentar extraer la ciudad de los componentes de OpenCage
    const city = result.components?.city ||
      result.components?.town ||
      result.components?.village ||
      result.components?.suburb ||
      'Tenerife';

    setFormData(prev => ({
      ...prev,
      address: result.formatted,
      city: city,
      postalCode: result.components?.postcode || '',
      lat: result.lat,
      lng: result.lng
    }));
    setShowMap(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) {
      setError('Por favor, selecciona una dirección válida usando el buscador.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (createSpot) {
        await parkingService.createGarageWithSpot({
          owner_id: userId,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          lat: formData.lat,
          lng: formData.lng,
          price: Math.max(0, parseFloat(formData.price)),
          type: formData.type,
          spot_number: formData.spotNumber,
          description: formData.description,
          images: formData.images,
          garageImages: formData.garageImages,
        });
      } else {
        const garage = await parkingService.createGarage({
          owner_id: userId,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          lat: formData.lat,
          lng: formData.lng,
          description: formData.description
        });

        if (formData.garageImages.length > 0) {
          await parkingService.addGarageImages(garage.id, formData.garageImages);
        }
      }

      // Éxito: Invalidamos queries para refrescar el panel
      await queryClient.invalidateQueries({ queryKey: ['owner-stats', userId] });
      await queryClient.invalidateQueries({ queryKey: ['owner-garages', userId] });

      // Actualizamos el rol en el contexto de Auth
      await refreshUser();

      toast.success(createSpot ? '¡Garaje y plaza publicados con éxito!' : '¡Garaje creado con éxito!');
      onCancel();
    } catch (err: any) {
      console.error('Error al publicar:', err);
      setError(err.message || 'Error al publicar el garaje. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6 border-2 border-primary bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Configurar nuevo garaje</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}><CircleX className="h-5 w-5" /></Button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
            <CircleX className="h-4 w-4" />
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="spotName">Nombre del garaje / plaza</Label>
          <Input id="spotName" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Garaje Centro" />
        </div>

        <div className="space-y-2">
          <Label>Dirección</Label>
          <AddressSearch onAddressSelect={handleAddressSelect} initialAddress={formData.address} />
        </div>

        {formData.lat !== 0 && (
          <div className="space-y-2 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" />
                Ubicación en el mapa
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? (
                  <>Ocultar mapa <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>Ajustar posición <ChevronDown className="h-3 w-3" /></>
                )}
              </Button>
            </div>

            {showMap && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <LocationPicker
                  lat={formData.lat}
                  lng={formData.lng}
                  onChange={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
                  onAddressUpdate={(result) => {
                    const city = result.components?.city ||
                      result.components?.town ||
                      result.components?.village ||
                      result.components?.suburb ||
                      'Tenerife';
                    setFormData(prev => ({
                      ...prev,
                      address: result.formatted,
                      city: city,
                      postalCode: result.components?.postcode || prev.postalCode
                    }));
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input id="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Código Postal</Label>
            <Input id="postalCode" value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} placeholder="38001" />
          </div>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input
            type="checkbox"
            id="createSpot"
            checked={createSpot}
            onChange={(e) => setCreateSpot(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="createSpot" className="cursor-pointer">Crear primera plaza inmediatamente</Label>
        </div>

        {createSpot && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="spotNumber">Nombre/Número de la plaza</Label>
              <Input
                id="spotNumber"
                value={formData.spotNumber}
                onChange={e => setFormData({ ...formData, spotNumber: e.target.value })}
                placeholder="Ej: Plaza 1, A-12..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Precio por hora (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="2.50"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de plaza</Label>
                <select className="w-full h-10 px-3 py-2 border border-border rounded-lg bg-background" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option>Cubierta</option>
                  <option>Subterránea</option>
                  <option>Al aire libre</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea placeholder="Detalles de acceso..." rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>

        {/* Garage Image - always visible */}
        <div className="space-y-2">
          <Label>Foto del garaje</Label>
          <GarageImageUploader
            userId={userId}
            currentImages={formData.garageImages}
            onImagesChange={urls => setFormData(prev => ({ ...prev, garageImages: urls }))}
            maxImages={1}
          />
        </div>

        {/* Spot Images - only when creating a spot */}
        {createSpot && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <Label>Fotos de la plaza (máx. 5)</Label>
            <GarageImageUploader
              userId={userId}
              currentImages={formData.images}
              onImagesChange={urls => setFormData(prev => ({ ...prev, images: urls }))}
              maxImages={5}
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (formData.name || formData.address) {
                setShowCancelConfirm(true);
              } else {
                onCancel();
              }
            }}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-secondary hover:bg-secondary/90"
            disabled={isLoading || !formData.name || !formData.address || (createSpot && (!formData.price || !formData.spotNumber))}
          >
            {isLoading ? 'Guardando...' : createSpot ? 'Publicar plaza' : 'Crear garaje'}
          </Button>
        </div>
      </form>

      {showCancelConfirm && (
        <ConfirmationDialog
          isOpen={showCancelConfirm}
          onClose={() => setShowCancelConfirm(false)}
          onConfirm={onCancel}
          title="Descartar cambios"
          description="¿Estás seguro de que quieres cancelar? Perderás toda la información introducida en el formulario."
          confirmText="Sí, cancelar"
          variant="destructive"
        />
      )}
    </Card>
  );
}
