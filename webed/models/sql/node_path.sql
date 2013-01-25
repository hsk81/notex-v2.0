-- DROP FUNCTION name_path(node); -- SLOW!
CREATE OR REPLACE FUNCTION name_path(node)
	RETURNS text AS
$BODY$
	SELECT array_to_string (v.name_path, '/') AS name_path
	FROM name_path_view v
	WHERE (v.id = $1.id)
	AND (v.id_path[1] = $1.base_id)
$BODY$
LANGUAGE sql STABLE LEAKPROOF
COST 100;
ALTER FUNCTION name_path(node)
OWNER TO webed;
--
SELECT n.id, n.root_id, n.base_id, n.name_path
FROM node n
ORDER BY n.base_id, n.name_path;

-- DROP VIEW node_path_view;
CREATE OR REPLACE VIEW node_path_view AS

	WITH RECURSIVE graph (id, root_id, base_id, id_path, name_path) AS (
	    SELECT n.id, n.root_id, n.base_id, 
	           ARRAY[n.id], ARRAY[n.name]
	    FROM node n

	UNION
	    SELECT n.id, n.root_id, n.base_id,
	           id_path||ARRAY[n.id], name_path||ARRAY[n.name]
	    FROM node n, graph g
	    WHERE (n.root_id = g.id))

	SELECT g.id, g.root_id, g.base_id, g.id_path, g.name_path
	FROM graph g
	WHERE g.base_id = g.id_path[1] OR g.base_id IS NULL;

ALTER VIEW node_path_view
OWNER TO webed;

-- DROP TABLE node_ex;
CREATE TABLE node_ex AS

	SELECT n.id AS node_id,
	       array_to_string (npv.name_path, '/') AS name_path
	FROM node n, node_path_view npv
	WHERE (n.id = npv.id);

ALTER TABLE node_ex
OWNER TO webed;

-- DROP INDEX ix_node_ex_name_path;
CREATE INDEX ix_node_ex_name_path ON node_ex USING btree (name_path COLLATE pg_catalog."default");
-- DROP INDEX ix_node_ex_node_id;
CREATE INDEX ix_node_ex_node_id ON node_ex USING btree (node_id);

--
SELECT n.node_id, n.name_path
FROM node_ex n
ORDER BY n.node_id, n.name_path;
