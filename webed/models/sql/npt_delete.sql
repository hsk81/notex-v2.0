-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_delete_node (IN bid integer, IN nid integer)
  RETURNS void LANGUAGE sql VOLATILE AS
$BODY$
DELETE
  FROM node_path npt
 WHERE npt.base_id = bid
   AND npt.node_id = nid;
$BODY$;

ALTER FUNCTION public.npt_delete_node (IN integer, IN integer)
      OWNER TO webed;

COMMENT ON FUNCTION npt_insert_node (IN integer, IN integer) IS
    'Not optimal since `O(n)` where n ~ #rows in `node`, instead of `O(1)`.';

-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_delete_base (IN bid integer)
  RETURNS void LANGUAGE sql VOLATILE AS
$BODY$
DELETE
  FROM node_path npt
 WHERE npt.base_id = bid;
$BODY$;

ALTER FUNCTION public.npt_delete_base (IN integer)
      OWNER TO webed;

