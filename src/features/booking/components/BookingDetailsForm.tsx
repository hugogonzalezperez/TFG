import { useState } from 'react';
import { Card, Input, Label, Button, Checkbox } from '../../../ui';
import { AlertCircle } from 'lucide-react';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'Los apellidos son obligatorios';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';

    // Vehicle validation
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'La matrícula es obligatoria';
    } else {
      const plateRegex = /^([0-9]{4}\s?[A-Z]{3}|[A-Z]{1,2}\s?[0-9]{4}\s?[A-Z]{1,2})$/i;
      if (!plateRegex.test(formData.licensePlate.trim())) {
        newErrors.licensePlate = 'Formato de matrícula inválido (ej: 1234 ABC o TF 1234 AB)';
      }
    }

    if (!formData.carModel.trim()) {
      newErrors.carModel = 'La marca y modelo son obligatorios';
    } else if (formData.carModel.length > 50) {
      newErrors.carModel = 'Máximo 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate() && acceptedTerms) {
      onNext();
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Tus datos</h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Juan"
              className={errors.firstName ? 'border-destructive' : ''}
            />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Pérez García"
              className={errors.lastName ? 'border-destructive' : ''}
            />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
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
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+34 600 000 000"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">Matrícula del vehículo</Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
            placeholder="1234 ABC"
            className={errors.licensePlate ? 'border-destructive' : 'uppercase'}
            maxLength={10}
          />
          {errors.licensePlate && (
            <div className="flex items-center gap-1 text-xs text-destructive mt-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.licensePlate}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="carModel">Marca y modelo</Label>
          <Input
            id="carModel"
            value={formData.carModel}
            onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
            placeholder="Ej: Tesla Model 3"
            className={errors.carModel ? 'border-destructive' : ''}
            maxLength={50}
          />
          {errors.carModel && <p className="text-xs text-destructive">{errors.carModel}</p>}
          <p className="text-[10px] text-muted-foreground text-right">{formData.carModel.length}/50</p>
        </div>

        <div className="flex items-start space-x-2 pt-4">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
          />
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
          onClick={handleNext}
          className="w-full h-12 bg-primary hover:bg-primary/90 mt-6"
          disabled={!acceptedTerms}
        >
          Continuar al pago
        </Button>
      </form>
    </Card>
  );
}
