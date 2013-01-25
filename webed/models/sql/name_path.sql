-- Function: name_path(node)
-- DROP FUNCTION name_path(node);

CREATE OR REPLACE FUNCTION name_path(node)
  RETURNS text AS
$BODY$

WITH RECURSIVE graph (id, root_id, base_id, id_path, path) AS (
    SELECT n.id, n.root_id, n.base_id, ARRAY[n.id],
           ARRAY[n.name]
    FROM node n
    WHERE (n.base_id = $1.base_id OR n.base_id IS NULL)

UNION
    SELECT n.id, n.root_id, n.base_id, id_path||ARRAY[n.id],
           path||ARRAY[n.name]
    FROM node n, graph g
    WHERE (n.root_id = g.id)
    AND (n.base_id = $1.base_id OR n.base_id IS NULL)
    AND (g.base_id = $1.base_id OR g.base_id IS NULL))

SELECT array_to_string (g.path, '/')
FROM graph g
WHERE (g.id = $1.id)
AND (g.id_path[1] = $1.base_id OR g.base_id IS NULL)

$BODY$
  LANGUAGE sql STABLE LEAKPROOF
  COST 100;
ALTER FUNCTION name_path(node)
  OWNER TO webed;