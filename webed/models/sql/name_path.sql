-- Function: name_path(node)
-- DROP FUNCTION name_path(node);

CREATE OR REPLACE FUNCTION name_path(node)
  RETURNS text AS
$BODY$

WITH RECURSIVE graph (id, root_id, id_path, name_path) AS (
    SELECT n.id, n.root_id, ARRAY[n.id], ARRAY[n.name]
    FROM node n
UNION
    SELECT n.id, n.root_id, id_path||ARRAY[n.id], name_path||ARRAY[n.name]
    FROM node n, graph g
    WHERE n.root_id = g.id)

SELECT array_to_string (g.name_path, '/')
FROM graph g
WHERE (g.id_path[1] = $1.base_id OR g.root_id IS NULL)
AND (g.id = $1.id)

$BODY$
  LANGUAGE sql STABLE
  COST 100;
ALTER FUNCTION name_path(node)
  OWNER TO webed;
