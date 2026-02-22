import { useState, useEffect } from 'react';
import { Unlock, Lock, Loader2, KeyRound, DoorClosed, Clock } from 'lucide-react';
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
  const [totalTimeMs, setTotalTimeMs] = useState(1); // avoid dist by 0

  useEffect(() => {
    if (!booking) return;

    const start = new Date(booking.start_time).getTime();
    const end = new Date(booking.end_time).getTime();
    setTotalTimeMs(end - start);

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, end - now);
      setTimeLeftMs(remaining);

      // Auto-close if reservation expired completely
      if (remaining === 0 && opened) {
        setOpened(false);
      }
    };

    updateTimer(); // Initial call
    const intervalId = setInterval(updateTimer, 1000); // Update every sec

    return () => clearInterval(intervalId);
  }, [booking, opened]);

  if (!booking) return null;

  const handleOpenDoor = async () => {
    setOpening(true);
    const success = await smartAccessService.openDoor(booking.id);
    setOpening(false);

    if (success) {
      setOpened(true);
      toast.success('Puerta abierta correctamente');
    } else {
      toast.error('Error al abrir la puerta.');
    }
  };

  const handleCloseDoor = async () => {
    setOpening(true);
    const success = await smartAccessService.closeDoor(booking.id);
    setOpening(false);

    if (success) {
      setOpened(false);
      toast.success('Puerta cerrada correctamente');
    } else {
      toast.error('Error al cerrar la puerta.');
    }
  };

  // Convert MS to HH:MM:SS
  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate SVG stroke Dasharray for circular progress
  const radius = 64; // roughly matching width/height logic
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = totalTimeMs > 0 ? circumference - (timeLeftMs / totalTimeMs) * circumference : circumference;

  // Choose color based on remaining time (red if < 15 mins)
  const isExpiringSoon = timeLeftMs < 15 * 60 * 1000;

  const garageImage = booking.image || 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=400';

  return (
    <Dialog open={!!booking} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] text-center p-8 bg-background/95 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Decorative background glow based on state */}
        <div className={cn(
          "absolute inset-0 opacity-10 blur-3xl rounded-full transition-colors duration-1000 -z-10",
          opening ? "bg-blue-500 scale-150" :
            opened ? "bg-green-500 scale-150" :
              "bg-primary scale-100"
        )} />

        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-black tracking-tight text-center">Acceso Inteligente</DialogTitle>
          <DialogDescription className="text-center mt-2 text-base font-medium">
            {booking.parkingName} <span className="opacity-50 mx-1">•</span> Plaza {booking.spotNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">

          {/* Central Interactive UI */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-8">

            {/* SVG Countdown Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 144 144">
              {/* Background ring */}
              <circle
                cx="72" cy="72" r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted/30"
              />
              {/* Progress ring (segmented look via dasharray tweak or pure stroke if preferred, doing smooth path) */}
              <circle
                cx="72" cy="72" r={radius}
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

            {/* Inner Image / State Avatar */}
            <div className={cn(
              "relative w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-2xl overflow-hidden border-4",
              opening ? "border-blue-500 scale-95 shadow-blue-500/50" :
                opened ? "border-green-500 scale-100 shadow-green-500/50" :
                  "border-border scale-100"
            )}>
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={garageImage}
                alt="Garage"
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000"
              />

              <div className="relative z-20 text-white flex flex-col items-center drop-shadow-lg">
                {opened ? (
                  <Unlock className="h-10 w-10 text-green-300 mb-2" />
                ) : (
                  <Lock className="h-8 w-8 text-white/80 mb-2" />
                )}

                <div className={cn(
                  "font-mono text-xl font-bold tracking-widest",
                  isExpiringSoon ? "text-red-200" : "text-white"
                )}>
                  {formatTime(timeLeftMs)}
                </div>
                <div className="text-[10px] uppercase font-bold opacity-80 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Tiempo restante
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              size="lg"
              className={cn(
                "h-16 text-sm md:text-base font-bold rounded-2xl transition-all shadow-lg active:scale-95",
                opened ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
              onClick={handleOpenDoor}
              disabled={opening || opened || timeLeftMs <= 0}
            >
              {opening ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Abriendo...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-5 w-5" />
                  Abrir Puerta
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className={cn(
                "h-16 text-sm md:text-base font-bold rounded-2xl transition-all shadow-lg active:scale-95 border-2",
                !opened ? "opacity-50 cursor-not-allowed" : "hover:bg-accent border-destructive/20 hover:border-destructive text-destructive"
              )}
              onClick={handleCloseDoor}
              disabled={!opened}
            >
              <DoorClosed className="mr-2 h-5 w-5" />
              Cerrar Puerta
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground/80 font-medium italic">
            Control de acceso registrado en base de datos
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
