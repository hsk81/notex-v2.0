-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_cancel_node (IN nid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
  BEGIN
UPDATE ONLY node_path npt
   SET dirty = TRUE
 WHERE npt.node_id = nid;
   END
$BODY$;

ALTER FUNCTION public.npt_cancel_node (IN nid integer)
  OWNER TO webed;

-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_cancel_base (IN bid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
  BEGIN
UPDATE ONLY node_path npt
   SET dirty = TRUE
 WHERE npt.base_id = bid;
   END
$BODY$;

ALTER FUNCTION public.npt_cancel_base (IN bid integer)
  OWNER TO webed;

-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_cancel_full ()
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
  BEGIN
UPDATE ONLY node_path npt
   SET dirty = TRUE;
   END
$BODY$;

ALTER FUNCTION public.npt_cancel_full ()
  OWNER TO webed;

-------------------------------------------------------------------------------
