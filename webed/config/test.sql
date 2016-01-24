-------------------------------------------------------------------------------
DROP DATABASE IF EXISTS "webed-t";
DROP ROLE IF EXISTS "webed-t";

-------------------------------------------------------------------------------
CREATE ROLE "webed-t" LOGIN
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

CREATE DATABASE "webed-t"
  WITH OWNER = "webed-t"
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;

