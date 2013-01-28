-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_insert_node (IN bid integer, IN nid integer)
  RETURNS void LANGUAGE sql VOLATILE AS
$BODY$
INSERT INTO node_path
SELECT nextval ('node_path_id_seq') AS id,
       npv.base_id AS base_id,
       npv.node_id AS node_id,
       array_to_string (npv.name_path, '/') AS name_path
  FROM node_path_view (bid, nid) npv;
$BODY$;

ALTER FUNCTION public.npt_insert_node (IN integer, IN integer)
      OWNER TO webed;

-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_insert_base (IN bid integer)
  RETURNS void LANGUAGE sql VOLATILE AS
$BODY$
INSERT INTO node_path
SELECT nextval ('node_path_id_seq') AS id,
       npv.base_id AS base_id,
       npv.node_id AS node_id,
       array_to_string (npv.name_path, '/') AS name_path
  FROM node_path_view (bid) npv;
$BODY$;

ALTER FUNCTION public.npt_insert_base (IN integer)
      OWNER TO webed;

