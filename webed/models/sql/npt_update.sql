-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION npt_update_node (IN nid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
  BEGIN
UPDATE ONLY node_path npt
   SET base_id = npv.base_id,
       node_id = npv.node_id,
       uuid_path = array_to_string (npv.uuid_path, '/'),
       name_path = array_to_string (npv.name_path, '/'),
       dirty = FALSE
  FROM node_path_view npv
 WHERE npt.node_id = nid AND npv.node_id = nid
   AND npt.dirty = TRUE;
   END
$BODY$;

ALTER FUNCTION public.npt_update_node (IN nid integer)
  OWNER TO webed;

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
CREATE OR REPLACE FUNCTION npt_update_base (IN bid integer)
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
 BEGIN
UPDATE ONLY node_path npt
   SET base_id = npv.base_id,
       node_id = npv.node_id,
       uuid_path = array_to_string (npv.uuid_path, '/'),
       name_path = array_to_string (npv.name_path, '/'),
       dirty = FALSE
  FROM node_path_view npv
 WHERE npt.base_id = bid AND npv.base_id = bid
   AND npt.node_id = npv.node_id
   AND npt.dirty = TRUE;
   END
$BODY$;

ALTER FUNCTION public.npt_update_base (IN bid integer)
  OWNER TO webed;

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
CREATE OR REPLACE FUNCTION npt_update_full ()
  RETURNS void LANGUAGE plpgsql VOLATILE AS
$BODY$
 BEGIN
UPDATE ONLY node_path npt
   SET base_id = npv.base_id,
       node_id = npv.node_id,
       uuid_path = array_to_string (npv.uuid_path, '/'),
       name_path = array_to_string (npv.name_path, '/'),
       dirty = FALSE
  FROM node_path_view npv
 WHERE npt.node_id = npv.node_id
   AND npt.dirty = TRUE;
   END
$BODY$;

ALTER FUNCTION public.npt_update_full ()
  OWNER TO webed;

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
