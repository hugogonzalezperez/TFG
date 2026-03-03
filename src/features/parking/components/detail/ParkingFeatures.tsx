import { Shield, Camera, Wifi, Zap } from 'lucide-react';

interface ParkingFeaturesProps {
  description?: string;
  amenities?: string[];
  rules?: string[];
}

export function ParkingFeatures({ description, amenities = [], rules = [] }: ParkingFeaturesProps) {
  const icons = [Shield, Camera, Wifi, Zap];

  return (
    <div className="space-y-8">
      {description && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      )}

      {amenities.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Servicios incluidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenities.map((amenity, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span>{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {rules.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Normas y condiciones</h2>
          <ul className="space-y-2">
            {rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="bg-secondary/10 p-1 rounded-full mt-0.5">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                </div>
                <span className="text-muted-foreground">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
