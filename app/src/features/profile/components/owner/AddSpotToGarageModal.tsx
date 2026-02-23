import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../../../ui/dialog';
import { Button, Input, Label, Textarea } from '../../../../ui';
import { AlertCircle, Loader2 } from 'lucide-react';
import { parkingService } from '../../../parking/services/parking.service';

interface AddSpotToGarageModalProps {
  garage: {
    id: string;
    name: string;
    owner_id: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function AddSpotToGarageModal({ garage, isOpen, onClose }: AddSpotToGarageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    spot_number: '',
    price: '',
    type: 'Cubierta',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.spot_number || !formData.price) {
      setError('Por favor, completa los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await parkingService.createParkingSpot({
        garage_id: garage.id,
        owner_id: garage.owner_id,
        spot_number: formData.spot_number,
        price: parseFloat(formData.price),
        type: formData.type,
        description: formData.description
      });

      toast.success('¡Nueva plaza añadida con éxito!');
      onClose();
    } catch (err: any) {
      console.error('Error al añadir plaza:', err);
      setError(err.message || 'Error al añadir la plaza. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir plaza a {garage.name}</DialogTitle>
          <DialogDescription>
            Introduce los detalles de la nueva plaza de aparcamiento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="spot_number">Número de plaza</Label>
            <Input
              id="spot_number"
              placeholder="Ej: A-12 o 24"
              value={formData.spot_number}
              onChange={(e) => setFormData({ ...formData, spot_number: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio por hora (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="2.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                className="w-full h-10 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={isLoading}
              >
                <option>Cubierta</option>
                <option>Subterráneo</option>
                <option>Al aire libre</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Ej: Segunda planta, cerca del ascensor..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar plaza
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
