-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_delete_node (IN bid integer, IN nid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
 BEGIN
DELETE
  FROM node_path npt
 WHERE npt.base_id = bid
   AND npt.node_id = nid;
   END
$BODY$;

ALTER FUNCTION public.npt_delete_node (IN integer, IN integer)
      OWNER TO webed;

-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_delete_base (IN bid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
 BEGIN
DELETE
  FROM node_path npt
 WHERE npt.base_id = bid;
   END
$BODY$;

ALTER FUNCTION public.npt_delete_base (IN integer)
      OWNER TO webed;

