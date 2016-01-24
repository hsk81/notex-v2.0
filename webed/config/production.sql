-------------------------------------------------------------------------------
DROP DATABASE IF EXISTS "webed-p";
DROP ROLE IF EXISTS "webed-p";

-------------------------------------------------------------------------------
CREATE ROLE "webed-p" LOGIN
  ENCRYPTED PASSWORD 'md54ca2863ad7dc4cacaa8e2d473f2444d6'
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

CREATE DATABASE "webed-p"
  WITH OWNER = "webed-p"
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;

-------------------------------------------------------------------------------
