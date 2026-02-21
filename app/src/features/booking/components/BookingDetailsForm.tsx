import { Card, Input, Label, Button, Checkbox } from '../../../ui';

interface BookingDetailsFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licensePlate: string;
    carModel: string;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

export function BookingDetailsForm({ formData, setFormData, onNext }: BookingDetailsFormProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Tus datos</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Juan"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Pérez García"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="juan@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+34 600 000 000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">Matrícula del vehículo</Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
            placeholder="1234 ABC"
            className="uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="carModel">Marca y modelo (opcional)</Label>
          <Input
            id="carModel"
            value={formData.carModel}
            onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
            placeholder="Ej: Toyota Corolla"
          />
        </div>

        <div className="flex items-start space-x-2 pt-4">
          <Checkbox id="terms" required />
          <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
            Acepto las{' '}
            <a href="#" className="text-primary hover:underline" onClick={(e) => e.preventDefault()}>
              condiciones de la reserva
            </a>{' '}
            y la{' '}
            <a href="#" className="text-primary hover:underline" onClick={(e) => e.preventDefault()}>
              política de cancelación
            </a>
          </label>
        </div>

        <Button
          type="button"
          onClick={onNext}
          className="w-full h-12 bg-primary hover:bg-primary/90 mt-6"
        >
          Continuar al pago
        </Button>
      </form>
    </Card>
  );
}
