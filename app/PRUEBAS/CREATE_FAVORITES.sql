-- Creación de la tabla de favoritos
CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL,
    "parking_spot_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "favorites_parking_spot_id_fkey" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spots"("id") ON DELETE CASCADE,
    CONSTRAINT "favorites_user_spot_unique" UNIQUE ("user_id", "parking_spot_id")
);

-- Habilitar RLS
ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (RLS)
-- Los usuarios pueden ver sus propios favoritos
CREATE POLICY "Users can view their own favorites" ON "public"."favorites"
    FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios pueden añadir favoritos
CREATE POLICY "Users can insert their own favorites" ON "public"."favorites"
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus propios favoritos
CREATE POLICY "Users can delete their own favorites" ON "public"."favorites"
    FOR DELETE USING (auth.uid() = user_id);

-- Los propietarios pueden ver quién ha añadido a favoritos sus plazas
CREATE POLICY "Owners can view who favorited their spots" ON "public"."favorites"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "public"."parking_spots"
            WHERE "parking_spots"."id" = "favorites"."parking_spot_id"
            AND "parking_spots"."owner_id" = auth.uid()
        )
    );
