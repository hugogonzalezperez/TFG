import { AlertCircle } from 'lucide-react';
import { Card, Button, Label, Input, Textarea } from '../../../../ui';
import { AddressSearch } from '../../../../ui/address-search';
import { GarageImageUploader } from '../GarageImageUploader';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../auth';
import { parkingService } from '../../../parking/services/parking.service';

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
    lat: 0,
    lng: 0,
    price: '',
    type: 'Cubierta',
    spotNumber: '',
    description: '',
    images: [] as string[]
  });
  const [createSpot, setCreateSpot] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      lat: result.lat,
      lng: result.lng
    }));
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
          lat: formData.lat,
          lng: formData.lng,
          price: parseFloat(formData.price),
          type: formData.type,
          spot_number: formData.spotNumber,
          description: formData.description,
          images: formData.images
        });
      } else {
        const garage = await parkingService.createGarage({
          owner_id: userId,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          lat: formData.lat,
          lng: formData.lng,
          description: formData.description
        });

        if (formData.images.length > 0) {
          await parkingService.addGarageImages(garage.id, formData.images);
        }
      }

      // Éxito: Invalidamos queries para refrescar el panel
      await queryClient.invalidateQueries({ queryKey: ['owner-stats', userId] });
      await queryClient.invalidateQueries({ queryKey: ['owner-garages', userId] });

      // Actualizamos el rol en el contexto de Auth
      await refreshUser();

      alert(createSpot ? '¡Garaje y plaza publicados con éxito!' : '¡Garaje creado con éxito! Puedes añadir plazas después.');
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
        <Button variant="ghost" size="icon" onClick={onCancel}><AlertCircle className="h-5 w-5" /></Button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4" />
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
                <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="2.50" />
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

        <div className="space-y-2">
          <Label>Fotos</Label>
          <GarageImageUploader userId={userId} currentImages={formData.images} onImagesChange={urls => setFormData({ ...formData, images: urls })} />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
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
    </Card>
  );
}
