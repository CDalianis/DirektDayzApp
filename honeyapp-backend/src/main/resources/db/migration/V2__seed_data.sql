INSERT INTO roles (id, name) VALUES
    (1, 'ADMIN'),
    (2, 'CONSUMER'),
    (3, 'PRODUCER');

INSERT INTO capabilities (id, name, description) VALUES
    (1, 'VIEW_PRODUCERS', 'View all producers'),
    (2, 'VIEW_PRODUCER', 'View a single producer'),
    (3, 'EDIT_PRODUCER', 'Edit any producer'),
    (4, 'DELETE_PRODUCER', 'Delete any producer'),
    (5, 'VIEW_OWN_PRODUCER', 'View own producer profile'),
    (6, 'EDIT_OWN_PRODUCER', 'Edit own producer profile'),
    (7, 'MANAGE_OWN_PRODUCTS', 'Manage own products'),
    (8, 'VIEW_PRODUCTS', 'View products'),
    (9, 'VIEW_OWN_CONSUMER', 'View own consumer profile'),
    (10, 'VIEW_REPORTS', 'View reports');

INSERT INTO roles_capabilities (role_id, capability_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 8), (1, 10),
    (2, 1), (2, 2), (2, 8), (2, 9),
    (3, 5), (3, 6), (3, 7), (3, 8);

INSERT INTO regions (id, name) VALUES
    (1, 'Attica'),
    (2, 'Thessaly'),
    (3, 'Crete'),
    (4, 'Macedonia'),
    (5, 'Peloponnese'),
    (6, 'Epirus');

SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('capabilities_id_seq', (SELECT MAX(id) FROM capabilities));
SELECT setval('regions_id_seq', (SELECT MAX(id) FROM regions));
