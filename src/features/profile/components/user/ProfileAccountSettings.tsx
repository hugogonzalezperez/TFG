import { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Edit, X, Check } from 'lucide-react';
import { Card, Input, Label, Button, Switch, ErrorMessage } from '../../../../ui';

interface ProfileAccountSettingsProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  onSave: (data: any) => Promise<void>;
}

export function ProfileAccountSettings({ initialData, onSave }: ProfileAccountSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formData, setFormData] = useState({ ...initialData });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark' || document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Map avatar back to avatar_url for backend if needed, or just pass as is if backend handles it
      // Assuming backend expects avatar_url based on previous code
      const payload = {
        ...formData,
        avatar_url: formData.avatar
      };
      await onSave(payload);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Configuración de perfil</h2>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2 self-start sm:self-auto">
            <Edit className="h-4 w-4" /> Editar
          </Button>
        ) : (
          <div className="flex gap-2 self-start sm:self-auto w-full sm:w-auto">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} className="flex-1 sm:flex-none">
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-secondary hover:bg-secondary/90 flex-1 sm:flex-none">
              <Check className="h-4 w-4 mr-2" /> {isSaving ? 'Guardar...' : 'Guardar'}
            </Button>
          </div>
        )}
      </div>

      <ErrorMessage message={error || ''} onClose={() => setError(null)} />

      <Card className="p-6">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /> Nombre completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
            <Input id="email" type="email" value={initialData.email} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
              placeholder="+34 600 000 000"
            />
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="avatar" className="flex items-center gap-2"><Camera className="h-4 w-4" /> URL del Avatar</Label>
              <Input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>
          )}

          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold mb-4">Preferencias</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo oscuro</p>
                <p className="text-sm text-muted-foreground">Cambiar entre tema claro y oscuro</p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
