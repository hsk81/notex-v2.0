-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION node_path_view (IN bid integer)
    RETURNS TABLE (
        node_id integer,
        root_id integer,
        base_id integer,
        id_path integer[],
        name_path character varying[])
    LANGUAGE sql STABLE AS
$BODY$
WITH RECURSIVE graph (id, root_id, base_id, id_path, name_path) AS (
    SELECT n.id,
           COALESCE (n.root_id, n.id),
           COALESCE (n.base_id, n.id),
           ARRAY[n.id],
           ARRAY[n.name]
      FROM node n
     WHERE COALESCE (n.base_id, n.id) = bid

UNION
    SELECT n.id,
           COALESCE (n.root_id, n.id),
           COALESCE (n.base_id, n.id),
           g.id_path||ARRAY[n.id],
           g.name_path||ARRAY[n.name]
      FROM node n, graph g
     WHERE COALESCE (n.base_id, n.id) = bid
       AND n.root_id = g.id)

SELECT g.id AS node_id, g.root_id, g.base_id, g.id_path, g.name_path
  FROM graph g
 WHERE g.base_id = g.id_path[1];
$BODY$;

-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION node_path_view (IN bid integer, IN rid integer)
    RETURNS TABLE (
        node_id integer,
        root_id integer,
        base_id integer,
        id_path integer[],
        name_path character varying[])
    LANGUAGE sql STABLE AS
$BODY$
WITH RECURSIVE graph (id, root_id, base_id, id_path, name_path) AS (
    SELECT n.id,
           COALESCE (n.root_id, n.id),
           COALESCE (n.base_id, n.id),
           ARRAY[n.id],
           ARRAY[n.name]
      FROM node n
     WHERE COALESCE (n.base_id, n.id) = bid

UNION
    SELECT n.id,
           COALESCE (n.root_id, n.id),
           COALESCE (n.base_id, n.id),
           g.id_path||ARRAY[n.id],
           g.name_path||ARRAY[n.name]
      FROM node n, graph g
     WHERE COALESCE (n.base_id, n.id) = bid
       AND n.root_id = g.id)

SELECT g.id AS node_id, g.root_id, g.base_id, g.id_path, g.name_path
  FROM graph g
 WHERE g.base_id = g.id_path[1]
   AND rid = ANY (g.id_path);
$BODY$;

