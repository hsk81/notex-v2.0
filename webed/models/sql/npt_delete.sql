-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_delete_node (IN bid integer, IN nid integer)
  RETURNS void LANGUAGE sql VOLATILE AS
$BODY$
DELETE
  FROM node_path npt
 WHERE npt.base_id = bid
   AND nid = ANY (npt.id_path);
$BODY$;

-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_delete_base (IN bid integer)
  RETURNS void LANGUAGE sql VOLATILE AS
$BODY$
DELETE
  FROM node_path npt
 WHERE npt.base_id = bid;
$BODY$;

