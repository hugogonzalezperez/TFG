-- Función para incrementar el contador de plazas
CREATE OR REPLACE FUNCTION public.increment_garage_spots(garage_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.garages
    SET total_spots = total_spots + 1
    WHERE id = garage_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para decrementar el contador de plazas
CREATE OR REPLACE FUNCTION public.decrement_garage_spots(garage_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.garages
    SET total_spots = GREATEST(0, total_spots - 1)
    WHERE id = garage_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
