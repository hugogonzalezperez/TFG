import { useState } from 'react';
import { Card, Input, Label, Button, Checkbox } from '../../../ui';
import { AlertCircle } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licensePlate: string;
  carModel: string;
}

interface BookingDetailsFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
}

export function BookingDetailsForm({ formData, setFormData, onNext }: BookingDetailsFormProps) {
  // Local state prevents stale-closure race between fast typing + immediate submit
  const [local, setLocal] = useState<FormData>(formData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const update = (field: keyof FormData, value: string) =>
    setLocal((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!local.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!local.lastName.trim()) newErrors.lastName = 'Los apellidos son obligatorios';
    if (!local.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(local.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!local.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';

    const normalizedPlate = local.licensePlate.replace(/\s+/g, ' ').trim();
    if (!normalizedPlate) {
      newErrors.licensePlate = 'La matrícula es obligatoria';
    } else {
      const plateRegex = /^([0-9]{4}\s?[A-Z]{3}|[A-Z]{1,2}\s?[0-9]{4}\s?[A-Z]{1,2})$/i;
      if (!plateRegex.test(normalizedPlate)) {
        newErrors.licensePlate = 'Formato inválido (ej: 1234 ABC o TF 1234 AB)';
      }
    }

    if (!local.carModel.trim()) {
      newErrors.carModel = 'La marca y modelo son obligatorios';
    } else if (local.carModel.length > 50) {
      newErrors.carModel = 'Máximo 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate() && acceptedTerms) {
      setFormData(local);
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
              value={local.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              placeholder="Juan"
              className={errors.firstName ? 'border-destructive' : ''}
            />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              id="lastName"
              value={local.lastName}
              onChange={(e) => update('lastName', e.target.value)}
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
            value={local.email}
            onChange={(e) => update('email', e.target.value)}
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
            value={local.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+34 600 000 000"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">Matrícula del vehículo</Label>
          <Input
            id="licensePlate"
            value={local.licensePlate}
            onChange={(e) => update('licensePlate', e.target.value.toUpperCase())}
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
            value={local.carModel}
            onChange={(e) => update('carModel', e.target.value)}
            placeholder="Ej: Tesla Model 3"
            className={errors.carModel ? 'border-destructive' : ''}
            maxLength={50}
          />
          {errors.carModel && <p className="text-xs text-destructive">{errors.carModel}</p>}
          <p className="text-[10px] text-muted-foreground text-right">{local.carModel.length}/50</p>
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
