import { useState, useEffect } from 'react';
import { Unlock, Lock, Loader2, KeyRound, DoorClosed } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Button } from '../../../ui';
import { smartAccessService } from '../services/smartAccess.service';
import { toast } from 'sonner';
import { cn } from '../../../shared/lib/cn';

interface SmartAccessModalProps {
  booking: any | null;
  onClose: () => void;
}

export function SmartAccessModal({ booking, onClose }: SmartAccessModalProps) {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);

  // Realtime countdown state
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [totalTimeMs, setTotalTimeMs] = useState(1);

  useEffect(() => {
    if (!booking) return;

    const start = new Date(booking.start_time).getTime();
    const end = new Date(booking.end_time).getTime();
    setTotalTimeMs(end - start);

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, end - now);
      setTimeLeftMs(remaining);

      if (remaining === 0 && opened) {
        setOpened(false);
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [booking, opened]);

  if (!booking) return null;

  const handleOpenDoor = async () => {
    setOpening(true);
    try {
      const success = await smartAccessService.openDoor(booking.id);
      if (success) {
        setOpened(true);
        toast.success('Puerta abierta correctamente');
      } else {
        toast.error('Error al abrir la puerta.');
      }
    } catch (err: any) {
      if (err.message?.includes('RLS')) {
        toast.error('Error de permisos (RLS). Por favor, contacta con soporte.');
      } else {
        toast.error('Error al abrir la puerta.');
      }
    } finally {
      setOpening(false);
    }
  };

  const handleCloseDoor = async () => {
    setOpening(true);
    try {
      const success = await smartAccessService.closeDoor(booking.id);
      if (success) {
        setOpened(false);
        toast.success('Puerta cerrada correctamente');
      } else {
        toast.error('Error al cerrar la puerta.');
      }
    } catch (err) {
      toast.error('Error al cerrar la puerta.');
    } finally {
      setOpening(false);
    }
  };

  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = totalTimeMs > 0 ? circumference - (timeLeftMs / totalTimeMs) * circumference : circumference;
  const isExpiringSoon = timeLeftMs < 15 * 60 * 1000;

  const garageImage = booking.image || 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=400';

  return (
    <Dialog open={!!booking} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] w-[calc(100%-2rem)] mx-auto p-0 border-none bg-background shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-black tracking-tight text-center">Control de Acceso</DialogTitle>
            <DialogDescription className="text-center mt-2 text-xs uppercase tracking-widest font-bold text-muted-foreground/60">
              {booking.parkingName} <span className="opacity-30 mx-1">•</span> Plaza {booking.spotNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center">
            {/* Minimalist Central UI with Progress Ring */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center mb-8">

              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 160 160">
                <circle
                  cx="80" cy="80" r={radius}
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-muted/10"
                />
                <circle
                  cx="80" cy="80" r={radius}
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={cn(
                    "transition-all duration-1000 ease-linear",
                    isExpiringSoon ? "text-red-500" : "text-primary"
                  )}
                />
              </svg>

              {/* Garage Image */}
              <div className={cn(
                "relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden transition-all duration-500 border-4 border-background shadow-xl",
                opened ? "ring-4 ring-green-500/20" : ""
              )}>
                <img
                  src={garageImage}
                  alt="Garage"
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700",
                    opened ? "scale-110" : "grayscale-[50%] opacity-60"
                  )}
                />
                <div className="absolute inset-0 bg-black/10" />

                {/* Lock/Unlock Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    "p-4 rounded-full backdrop-blur-md transition-all duration-500 border shadow-lg",
                    opened ? "bg-green-500 text-white border-green-400" : "bg-white/90 text-primary border-white"
                  )}>
                    {opened ? <Unlock className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Remaining Time */}
            <div className="text-center mb-10">
              <div className={cn(
                "font-mono text-4xl font-bold tracking-tighter mb-1",
                isExpiringSoon ? "text-red-500" : "text-foreground"
              )}>
                {formatTime(timeLeftMs)}
              </div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">
                Tiempo de reserva restante
              </p>
            </div>

            {/* Simplified Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                size="lg"
                className={cn(
                  "h-16 rounded-2xl font-bold transition-all active:scale-95 shadow-lg",
                  opened ? "bg-muted text-muted-foreground hover:bg-muted" : "bg-primary hover:bg-primary/90 shadow-primary/20"
                )}
                onClick={handleOpenDoor}
                disabled={opening || opened || timeLeftMs <= 0}
              >
                {opening && !opened ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5" />
                    <span>Abrir</span>
                  </div>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "h-16 rounded-2xl font-bold transition-all active:scale-95 border-2",
                  !opened ? "opacity-30 cursor-not-allowed" : "border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                )}
                onClick={handleCloseDoor}
                disabled={!opened || opening}
              >
                <div className="flex items-center gap-2">
                  <DoorClosed className="h-5 w-5" />
                  <span>Cerrar</span>
                </div>
              </Button>
            </div>


          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

