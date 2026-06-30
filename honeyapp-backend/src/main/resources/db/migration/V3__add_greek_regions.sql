INSERT INTO regions (id, name) VALUES
    (7, 'Central Greece'),
    (8, 'Western Greece'),
    (9, 'Ionian Islands'),
    (10, 'North Aegean'),
    (11, 'South Aegean'),
    (12, 'Central Macedonia'),
    (13, 'Western Macedonia'),
    (14, 'Eastern Macedonia and Thrace')
ON CONFLICT (id) DO NOTHING;

UPDATE producers SET region_id = 12 WHERE region_id = 4;

DELETE FROM regions WHERE id = 4;

SELECT setval('regions_id_seq', (SELECT MAX(id) FROM regions));
