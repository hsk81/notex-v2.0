-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_insert_node (IN nid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
 BEGIN
INSERT INTO node_path
SELECT npv.base_id AS base_id,
       npv.node_id AS node_id,
       array_to_string (npv.uuid_path, '/') AS uuid_path,
       array_to_string (npv.name_path, '/') AS name_path,
       FALSE AS dirty
  FROM node_path_view npv
 WHERE npv.node_id = nid;
   END
$BODY$;

ALTER FUNCTION public.npt_insert_node (IN bid integer)
  OWNER TO webed;

-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_insert_base (IN bid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
 BEGIN
INSERT INTO node_path
SELECT npv.base_id AS base_id,
       npv.node_id AS node_id,
       array_to_string (npv.uuid_path, '/') AS uuid_path,
       array_to_string (npv.name_path, '/') AS name_path,
       FALSE AS dirty
  FROM node_path_view npv
 WHERE npv.base_id = bid;
   END
$BODY$;

-------------------------------------------------------------------------------
ALTER FUNCTION public.npt_insert_base (IN bid integer)
  OWNER TO webed;

CREATE OR REPLACE FUNCTION npt_insert_full ()
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
 BEGIN
INSERT INTO node_path
SELECT npv.base_id AS base_id,
       npv.node_id AS node_id,
       array_to_string (npv.uuid_path, '/') AS uuid_path,
       array_to_string (npv.name_path, '/') AS name_path,
       FALSE AS dirty
  FROM node_path_view npv;
   END
$BODY$;

ALTER FUNCTION public.npt_insert_full ()
  OWNER TO webed;

-------------------------------------------------------------------------------
