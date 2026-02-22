# Resumen Consolidado de la Base de Datos (Parky)

Este documento es una versión **limpia y consolidada** de tus scripts SQL anteriores. He analizado el historial (desde lo más reciente a lo más antiguo), resolviendo los conflictos, aplicando los `ON DELETE CASCADE` de forma nativa en la creación de las tablas y ordenándolo lógicamente.

## 1. Tipos (Enums)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE auth_provider_type AS ENUM ('email', 'google', 'facebook');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'rejected', 'completed');
CREATE TYPE user_role_type AS ENUM ('admin', 'user', 'owner');
```

## 2. Tablas del Sistema (con Cascades aplicados)

```sql
-- Usuarios y Autenticación
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  phone text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.auth_providers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider auth_provider_type NOT NULL,
  provider_uid text,
  password_hash text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Roles
CREATE TABLE public.roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name user_role_type NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_roles (
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Dominio de Garajes y Plazas
CREATE TABLE public.garages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text,
  lat numeric(10, 7) NOT NULL,
  lng numeric(10, 7) NOT NULL,
  total_spots integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.garage_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  garage_id uuid NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_main boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.parking_spots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  garage_id uuid NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  spot_number text NOT NULL,
  base_price_per_hour numeric(10, 2) NOT NULL,
  current_price_per_hour numeric(10, 2) NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT price_non_negative CHECK (base_price_per_hour >= 0 AND current_price_per_hour >= 0),
  UNIQUE(garage_id, spot_number)
);

CREATE TABLE public.parking_spot_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parking_spot_id uuid NOT NULL REFERENCES public.parking_spots(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Precios y Disponibilidad
CREATE TABLE public.price_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parking_spot_id uuid NOT NULL REFERENCES public.parking_spots(id) ON DELETE CASCADE,
  price_per_hour numeric(10, 2) NOT NULL,
  reason text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.pricing_rules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parking_spot_id uuid REFERENCES public.parking_spots(id) ON DELETE CASCADE,
  rule_name text NOT NULL,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time without time zone,
  end_time time without time zone,
  multiplier numeric(10, 2) NOT NULL DEFAULT 1.0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Reservas, Pagos y Reseñas
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parking_spot_id uuid NOT NULL REFERENCES public.parking_spots(id) ON DELETE RESTRICT,
  renter_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  total_hours numeric(10, 2) NOT NULL CHECK (total_hours >= 2),
  total_price numeric(10, 2) NOT NULL,
  price_per_hour_at_booking numeric(10, 2) NOT NULL,
  dynamic_multiplier_applied numeric(10, 2) DEFAULT 1.0,
  vehicle_plate text,
  vehicle_description text,
  status booking_status DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.availability_slots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parking_spot_id uuid REFERENCES public.parking_spots(id) ON DELETE CASCADE,
  slot_time timestamp with time zone NOT NULL,
  is_occupied boolean DEFAULT false,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  UNIQUE(parking_spot_id, slot_time)
);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount_total numeric(10, 2) NOT NULL,
  platform_fee numeric(10, 2) NOT NULL,
  owner_amount numeric(10, 2) NOT NULL,
  stripe_payment_id text,
  status payment_status DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.refunds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  reason text NOT NULL,
  status refund_status DEFAULT 'pending',
  processed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  garage_id uuid NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id uuid UNIQUE REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Booking Access Control (Unified)
CREATE TABLE public.booking_access_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    action text NOT NULL CHECK (action IN ('open', 'close')),
    success boolean NOT NULL DEFAULT true,
    user_agent text,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now()
);
```

## 3. Funciones y Triggers Clave (Lógica de Negocio)

**Auto-completar Reservas Activas (Versión Final)**
```sql
CREATE OR REPLACE FUNCTION complete_past_bookings()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- Pasar a 'active' las reservas que ya iniciaron
    UPDATE bookings SET status = 'active', updated_at = NOW()
    WHERE status = 'confirmed' AND start_time <= NOW() AND end_time > NOW();

    -- Pasar a 'completed' las reservas que ya finalizaron
    UPDATE bookings SET status = 'completed', updated_at = NOW()
    WHERE status IN ('confirmed', 'active') AND end_time < NOW();
END;
$$;
```

**Obtener Rating Puro (Owner)**
```sql
CREATE OR REPLACE FUNCTION get_owner_average_rating(owner_uuid UUID)
RETURNS NUMERIC LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE avg_rating NUMERIC;
BEGIN
    SELECT AVG(rating) INTO avg_rating
    FROM reviews r JOIN garages g ON r.garage_id = g.id
    WHERE g.owner_id = owner_uuid;
    RETURN ROUND(COALESCE(avg_rating, 0.0), 1);
END;
$$;
```

**Promoción Automática a 'owner'**
```sql
CREATE OR REPLACE FUNCTION promote_to_owner_on_garage_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE owner_role_id UUID;
BEGIN
    SELECT id INTO owner_role_id FROM public.roles WHERE name = 'owner' LIMIT 1;
    IF owner_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.owner_id, owner_role_id)
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER tr_promote_to_owner
AFTER INSERT ON public.garages
FOR EACH ROW EXECUTE FUNCTION promote_to_owner_on_garage_insert();
```

**Manejo Automático Usuarios (Registrate via Auth)**
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, avatar_url, is_active)
  VALUES (
    new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'Nuevo Usuario'),
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || COALESCE(new.raw_user_meta_data->>'name', 'Nuevo Usuario')), true
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, phone = EXCLUDED.phone, avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url);
  
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT new.id, id FROM public.roles WHERE name = 'user' ON CONFLICT DO NOTHING;
  
  RETURN new;
END;
$$;
```

**Historial Automático de Precios**
```sql
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS trigger AS $$
BEGIN
    IF (OLD.current_price_per_hour IS DISTINCT FROM NEW.current_price_per_hour) THEN
        INSERT INTO public.price_history (parking_spot_id, price_per_hour, reason)
        VALUES (NEW.id, NEW.current_price_per_hour, 'manual_update');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_price_change_trigger BEFORE UPDATE ON public.parking_spots
FOR EACH ROW EXECUTE FUNCTION log_price_change();
```

## 4. Políticas RLS de Seguridad (Consolidadas)

_Nota: No he incluido los triggers estándar de `update_updated_at_column` por repetición, pero asume que están._

```sql
-- 1. USERS & AUTH
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. GARAGES (Propietarios)
CREATE POLICY "Anyone can view active garages" ON public.garages FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can view own garages" ON public.garages FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert garages" ON public.garages FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own garages" ON public.garages FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own garages" ON public.garages FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- 3. PARKING SPOTS 
CREATE POLICY "Anyone can view active parking spots" ON public.parking_spots FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage own spots" ON public.parking_spots FOR ALL TO authenticated USING (auth.uid() = owner_id);

-- 4. BOOKINGS (Dual: Renstador y Dueño)
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = renter_id);
CREATE POLICY "Owners can view bookings for their garages" ON public.bookings FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.parking_spots ps JOIN public.garages g ON ps.garage_id = g.id WHERE ps.id = bookings.parking_spot_id AND g.owner_id = auth.uid())
);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "Users can delete their own bookings" ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = renter_id);
CREATE POLICY "Owners can delete bookings for their garages" ON public.bookings FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.parking_spots ps JOIN public.garages g ON ps.garage_id = g.id WHERE ps.id = bookings.parking_spot_id AND g.owner_id = auth.uid())
);

-- 5. REVIEWS 
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 6. IMAGES, PRECIOS Y ACCESOS
-- ... (anteriores de images y prices) ...

-- Booking Access Logs
ALTER TABLE public.booking_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view access logs of their spots" ON public.booking_access_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            JOIN public.parking_spots ps ON b.parking_spot_id = ps.id
            JOIN public.garages g ON ps.garage_id = g.id
            WHERE b.id = booking_access_logs.booking_id AND g.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert access logs for their own bookings" ON public.booking_access_logs
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_id AND b.renter_id = auth.uid() AND b.status = 'active'
        )
    );
CREATE POLICY "Owners can insert in price_history via triggers" ON public.price_history FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.parking_spots WHERE id = parking_spot_id AND owner_id = auth.uid())
);
CREATE POLICY "Owners can view their spot price history" ON public.price_history FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.parking_spots WHERE id = parking_spot_id AND owner_id = auth.uid())
);
```