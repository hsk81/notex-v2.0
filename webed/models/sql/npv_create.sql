CREATE OR REPLACE VIEW node_path_view AS

	WITH RECURSIVE graph (id, root_id, base_id, id_path, uuid_path, name_path) AS (
	    SELECT n.id,
	           COALESCE (n.root_id, n.id),
	           COALESCE (n.base_id, n.id),
	           ARRAY[n.id],
	           ARRAY[n.uuid],
	           ARRAY[n.name]
	    FROM node n

	UNION
	    SELECT n.id,
	           COALESCE (n.root_id, n.id),
	           COALESCE (n.base_id, n.id),
	           id_path||ARRAY[n.id],
	           uuid_path||ARRAY[n.uuid],
	           name_path||ARRAY[n.name]
	    FROM node n, graph g
	    WHERE (n.root_id = g.id))

	SELECT g.id AS node_id, g.root_id, g.base_id, id_path,
	       g.uuid_path, g.name_path
	FROM graph g
	WHERE g.base_id = g.id_path[1];

ALTER VIEW node_path_view
OWNER TO webed;
