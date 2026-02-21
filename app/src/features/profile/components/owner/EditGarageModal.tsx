import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../../ui/dialog';
import { Button, Input, Textarea } from '../../../../ui';
import { AddressSearch } from '../../../../ui/address-search';
import { parkingService } from '../../../parking/services/parking.service';
import { Garage, Parking } from '../../../parking/types/parking.types';
import { GarageImageUploader } from '../GarageImageUploader';
import { Loader2 } from 'lucide-react';

interface EditGarageModalProps {
  garage: Garage;
  spot?: Parking | null; // If provided, we are editing a specific spot
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  price?: number | string; // Spot specific
}

export function EditGarageModal({ garage, spot, isOpen, onClose, onSuccess }: EditGarageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<FormData>();
  const isSpotEdit = !!spot;

  useEffect(() => {
    if (isOpen) {
      if (isSpotEdit && spot) {
        setImages(spot.images || (spot.image ? [spot.image] : []));
        reset({
          name: spot.spot_number,
          description: spot.description || '',
          address: garage.address, // Read-only context
          city: garage.city, // Read-only context
          lat: garage.lat,
          lng: garage.lng,
          price: spot.current_price_per_hour
        });
      } else {
        setImages(garage.images || (garage.image ? [garage.image] : []));
        reset({
          name: garage.name,
          description: garage.description || '',
          address: garage.address,
          city: garage.city,
          lat: garage.lat,
          lng: garage.lng,
        });
      }
    }
  }, [isOpen, garage, spot, isSpotEdit, reset]);

  const handleAddressSelect = (result: any) => {
    const city = result.components?.city ||
      result.components?.town ||
      result.components?.village ||
      result.components?.suburb ||
      'Tenerife';

    setValue('address', result.formatted, { shouldValidate: true });
    setValue('city', city, { shouldValidate: true });
    setValue('lat', result.lat);
    setValue('lng', result.lng);
  };


  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isSpotEdit && spot) {
        await parkingService.updateParkingSpot(spot.id, {
          spot_number: data.name,
          description: data.description,
          current_price_per_hour: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        });
        await parkingService.updateParkingSpotImages(spot.id, images);
      } else {
        await parkingService.updateGarage(garage.id, {
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          lat: data.lat,
          lng: data.lng,
        });
        await parkingService.updateGarageImages(garage.id, images);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating:', error);
      alert('Error al actualizar. Por favor inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isSpotEdit ? 'Editar Plaza' : 'Editar Garaje'}</DialogTitle>
          <DialogDescription>
            {isSpotEdit
              ? `Actualizando información para la plaza ${spot?.spot_number}`
              : 'Modifica los detalles generales de tu garaje'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isSpotEdit && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Garaje</label>
                <Input
                  {...register('name', { required: 'El nombre es obligatorio' })}
                  placeholder="Ej: Parking Centro"
                />
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dirección</label>
                  <AddressSearch
                    onAddressSelect={handleAddressSelect}
                    initialAddress={getValues('address')}
                  />
                  {/* Campos ocultos para validación de RHF */}
                  <input type="hidden" {...register('address', { required: 'La dirección es obligatoria' })} />
                  <input type="hidden" {...register('city')} />
                  <input type="hidden" {...register('lat')} />
                  <input type="hidden" {...register('lng')} />
                  {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
                </div>
              </div>
            </>
          )}

          {isSpotEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la plaza</label>
                <Input
                  {...register('name', { required: 'El nombre es obligatorio' })}
                  placeholder="Ej: Plaza 1"
                />
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio por hora (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('price', {
                    required: 'El precio es obligatorio',
                    min: { value: 0, message: 'el precio no puede ser negativo' }
                  })}
                  placeholder="2.5"
                />
                {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              {...register('description')}
              placeholder="Añade detalles útiles para tus clientes..."
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos</label>
            <GarageImageUploader
              userId={garage.owner_id}
              currentImages={images}
              onImagesChange={setImages}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  );
}
