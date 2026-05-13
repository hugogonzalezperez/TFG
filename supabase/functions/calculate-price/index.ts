import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Authorization requerida' }, 401);
  }

  let body: { spotId?: string; startTime?: string; endTime?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Body JSON inválido' }, 400);
  }

  const { spotId, startTime, endTime } = body;
  if (!spotId || !startTime || !endTime) {
    return json({ error: 'Requeridos: spotId, startTime, endTime' }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: spot, error: spotError } = await supabase
    .from('parking_spots')
    .select('base_price_per_hour, is_active')
    .eq('id', spotId)
    .single();

  if (spotError || !spot) return json({ error: 'Plaza no encontrada' }, 404);
  if (!spot.is_active) return json({ error: 'Plaza no disponible' }, 400);

  const { data: rules } = await supabase
    .from('pricing_rules')
    .select('day_of_week, start_time, end_time, multiplier, rule_name')
    .eq('parking_spot_id', spotId)
    .eq('is_active', true);

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return json({ error: 'Fechas inválidas' }, 400);
  }

  const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const dayOfWeek = start.getDay();
  const pad = (n: number) => String(n).padStart(2, '0');
  const startTimeStr = `${pad(start.getHours())}:${pad(start.getMinutes())}:${pad(start.getSeconds())}`;

  type Rule = { day_of_week: number | null; start_time: string | null; end_time: string | null; multiplier: number; rule_name: string };

  const applicable = (rules as Rule[] ?? []).filter((rule) => {
    if (rule.day_of_week !== null && rule.day_of_week !== dayOfWeek) return false;
    if (rule.start_time && rule.end_time) {
      if (startTimeStr < rule.start_time || startTimeStr > rule.end_time) return false;
    }
    return true;
  });

  const multiplierApplied = applicable.length > 0
    ? Math.max(...applicable.map((r) => r.multiplier))
    : 1.0;

  const totalPrice = Number((spot.base_price_per_hour * totalHours * multiplierApplied).toFixed(2));

  return json({
    totalPrice,
    pricePerHour: spot.base_price_per_hour,
    multiplierApplied,
    totalHours,
    rulesApplied: applicable.map((r) => r.rule_name),
  });
});
