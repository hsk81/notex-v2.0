-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION node_path_view (IN bid integer)
    RETURNS TABLE (
        node_id integer,
        root_id integer,
        base_id integer,
        id_path integer[],
        uuid_path uuid[],
        name_path character varying[])
    LANGUAGE sql STABLE AS
$BODY$
WITH RECURSIVE graph (id, root_id, base_id, id_path, uuid_path, name_path) AS (
SELECT n.id,
       COALESCE (n.root_id, n.id) AS "coalesce",
       COALESCE (n.base_id, n.id) AS "coalesce",
       ARRAY[n.id] AS "array",
       ARRAY[n.uuid] AS "array",
       ARRAY[n.name] AS "array"
  FROM node n
 WHERE COALESCE (n.base_id, n.id) = bid
 UNION
SELECT n.id,
       COALESCE (n.root_id, n.id) AS "coalesce",
       COALESCE (n.base_id, n.id) AS "coalesce",
       g.id_path||ARRAY[n.id],
       g.uuid_path||ARRAY[n.uuid],
       g.name_path||ARRAY[n.name]
  FROM node n, graph g
 WHERE COALESCE (n.base_id, n.id) = bid
   AND n.root_id = g.id)

SELECT g.id AS node_id,
       g.root_id,
       g.base_id,
       g.id_path,
       g.uuid_path,
       g.name_path
  FROM graph g
 WHERE g.base_id = g.id_path[1];
$BODY$;

ALTER FUNCTION node_path_view (IN integer)
      OWNER TO webed;

