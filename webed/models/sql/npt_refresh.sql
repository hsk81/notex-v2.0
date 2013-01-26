CREATE OR REPLACE FUNCTION npt_refresh_node (IN nid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
  BEGIN
 DELETE
   FROM node_path npt
  WHERE npt.node_id = nid;
PERFORM npt_insert_node (nid);
    END
$BODY$;

ALTER FUNCTION public.npt_refresh_node (IN nid integer)
  OWNER TO webed;

CREATE OR REPLACE FUNCTION npt_refresh_base (IN bid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
  BEGIN
 DELETE
   FROM node_path npt
  WHERE npt.base_id = bid;
PERFORM npt_insert_base (bid);
    END
$BODY$;

ALTER FUNCTION public.npt_refresh_base (IN bid integer)
  OWNER TO webed;
