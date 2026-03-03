import { CreditCard, Lock, Shield, Loader2 } from 'lucide-react';
import { Card, Input, Label, Button, ErrorMessage } from '../../../ui';

interface PaymentDetailsProps {
  paymentMethod: 'card' | 'paypal';
  setPaymentMethod: (method: 'card' | 'paypal') => void;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  totalPrice: number;
  onConfirm: () => void;
}

export function PaymentDetails({
  paymentMethod,
  setPaymentMethod,
  error,
  setError,
  loading,
  totalPrice,
  onConfirm,
}: PaymentDetailsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Método de pago</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setPaymentMethod('card')}
          className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'card'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
            }`}
        >
          <CreditCard className="h-6 w-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Tarjeta</p>
        </button>
        <button
          onClick={() => setPaymentMethod('paypal')}
          className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'paypal'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
            }`}
        >
          <div className="h-6 w-6 mx-auto mb-2 bg-[#0070BA] rounded flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
          <p className="text-sm font-medium">PayPal</p>
        </button>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número de tarjeta</Label>
            <div className="relative">
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Fecha de caducidad</Label>
              <Input id="expiry" placeholder="MM/AA" maxLength={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Input id="cvv" placeholder="123" maxLength={3} type="password" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Nombre del titular</Label>
            <Input id="cardName" placeholder="Como aparece en la tarjeta" />
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Pago seguro</p>
              <p className="text-muted-foreground">
                Tu información está protegida con encriptación SSL de 256 bits
              </p>
            </div>
          </div>

          <ErrorMessage message={error || ''} onClose={() => setError(null)} />

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full h-12 bg-accent hover:bg-accent/90 text-white mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Confirmar y pagar {totalPrice.toFixed(2)}€
              </>
            )}
          </Button>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div className="text-center py-8">
          <div className="bg-[#0070BA] text-white rounded-lg p-6 mb-4">
            <p className="font-semibold mb-2">PayPal</p>
            <p className="text-sm opacity-90">Serás redirigido a PayPal para completar el pago</p>
          </div>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full h-12 bg-[#0070BA] hover:bg-[#005ea6] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              'Continuar con PayPal'
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
