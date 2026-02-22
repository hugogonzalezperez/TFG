-- Actualización de localizaciones (Upsert)
-- Usamos ON CONFLICT para asegurar que si el garaje ya existe, simplemente actualizamos sus datos
-- y si no existe lo insertamos, evitando posibles errores por duplicidad de ID.

INSERT INTO "public"."garages" ("id", "owner_id", "name", "description", "address", "city", "postal_code", "lat", "lng", "total_spots", "is_active", "created_at", "updated_at") 
VALUES 
('06abe550-70f7-476c-8673-bf316791822c', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Garaje TEA', 'Parking del museo TEA', 'Av. de San Sebastián, 10', 'Santa Cruz de Tenerife', '38003', '28.4652000', '-16.2490000', '4', 'true', '2026-02-03 02:02:25.200834+00', '2026-02-03 02:02:25.200834+00'), 
('1727db23-e3e5-4bd5-9e64-0e1096071325', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Garaje Central CENTRO', 'Garaje amplio y seguro en el centro', 'Calle Padre Anchieta, 38003 Santa Cruz de Tenerife, España', 'Santa Cruz de Tenerife', '38003', '28.4640350', '-16.2545767', '5', 'true', '2026-02-03 02:02:22.014901+00', '2026-02-21 02:16:19.95316+00'), 
('2fc7fc86-a81e-47f9-ab9d-0e1cf68266dd', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Parking García Sanabria', 'Parking cubierto cerca del parque', 'Calle del Pilar, 15', 'Santa Cruz de Tenerife', '38004', '28.4655000', '-16.2505000', '3', 'true', '2026-02-03 02:02:21.657213+00', '2026-02-21 02:08:14.683008+00'), 
('3fe0db25-0433-4f71-97c8-6d13e8fe0d28', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Parking Mercado Nuestra Señora', 'Cerca del mercado histórico', 'Plaza de la Candelaria, 8', 'Santa Cruz de Tenerife', '38003', '28.4665000', '-16.2533000', '3', 'true', '2026-02-03 02:02:24.863105+00', '2026-02-03 02:02:24.863105+00'), 
('51da4aff-1f36-44ff-a273-31b548c476b0', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Garaje Palmetum', 'Parking al aire libre cerca del Palmetum', 'Calle Constitución, 5', 'Santa Cruz de Tenerife', '38003', '28.4630000', '-16.2450000', '3', 'false', '2026-02-03 02:02:24.190812+00', '2026-02-21 03:05:18.357774+00'), 
('585a216e-a72b-4b3c-9007-535c4e02802d', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Garaje El Corte Inglés', 'Parking del centro comercial', 'Av. Tres de Mayo, 34', 'Santa Cruz de Tenerife', '38005', '28.4643000', '-16.2577000', '4', 'true', '2026-02-03 02:02:23.177136+00', '2026-02-03 02:02:23.177136+00'), 
('6599e6fc-3258-478d-b7b7-a4f7ccf9e859', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Casa Yeray', '', 'Calle Heraclio Sánchez, 38201 La Cuesta, España', 'La Cuesta', null, '28.4847375', '-16.3161515', '1', 'true', '2026-02-21 15:58:50.261322+00', '2026-02-21 15:58:50.636985+00'), 
('6fbf583b-0c86-4421-b849-c477a6248661', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Parking La Salle', 'Parking residencial, acceso 24h', 'Calle La Salle, 28', 'Santa Cruz de Tenerife', '38005', '28.4625000', '-16.2590000', '3', 'true', '2026-02-03 02:02:22.827632+00', '2026-02-03 02:02:22.827632+00'), 
('ae9660bc-2ce6-443d-a568-3b09596c20ea', '22580321-ed52-4f32-9a27-1810aef4d516', 'GARAJE CASA JAIME', 'Parking dentro de la casa y techado.', 'Calle Antequera, 5, 38109 El Rosario, España', 'El Rosario', null, '28.4041419', '-16.3213326', '1', 'true', '2026-02-21 02:56:22.452623+00', '2026-02-21 02:56:22.677083+00'), 
('b5de4688-1181-4a7e-8589-df3e641b6d28', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Parking Rambla', 'Parking al aire libre en la Rambla', 'Rambla de Santa Cruz, 50', 'Santa Cruz de Tenerife', '38001', '28.4698000', '-16.2510000', '3', 'true', '2026-02-03 02:02:23.52011+00', '2026-02-03 02:02:23.52011+00'), 
('ba5b4eec-a053-4a3a-a4be-79e712dac9a8', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Parking Tenerife Norte', 'Parking cerca de la estación de guaguas', 'Av. Padre Anchieta, 22', 'Santa Cruz de Tenerife', '38006', '28.4720000', '-16.2560000', '4', 'true', '2026-02-03 02:02:23.859408+00', '2026-02-03 02:02:23.859408+00'), 
('c840171c-1728-48d4-b5d5-8095549f7c06', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Garaje Plaza España', 'Parking subterráneo en el corazón de Santa Cruz', 'Plaza de España, 1', 'Santa Cruz de Tenerife', '38003', '28.4682000', '-16.2546000', '4', 'true', '2026-02-03 02:02:21.232761+00', '2026-02-21 02:08:03.600486+00'), 
('d943d6b7-55a2-4583-b816-a1d1ccef524a', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Parking Universidad', 'Ideal para estudiantes', 'Av. de la Trinidad, 61', 'Santa Cruz de Tenerife', '38204', '28.4830000', '-16.3180000', '4', 'true', '2026-02-03 02:02:24.521384+00', '2026-02-03 02:02:24.521384+00'), 
('f3d8d6cd-3d9b-4a6a-b8c9-2942c12e1fac', '15538943-f1c8-470b-a21c-4e03c0c0d7f5', 'Parking Marina Santa Cruz', 'Parking cerca de la zona portuaria', 'Avenida de Anaga, 12', 'Santa Cruz de Tenerife', '38001', '28.4715000', '-16.2482000', '4', 'true', '2026-02-03 02:02:22.418473+00', '2026-02-03 02:02:22.418473+00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  postal_code = EXCLUDED.postal_code,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng;
