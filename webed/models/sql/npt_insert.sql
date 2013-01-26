INSERT INTO node_path

	SELECT npv.id AS node_id,
	       array_to_string (npv.uuid_path, '/') AS uuid_path,
	       array_to_string (npv.name_path, '/') AS name_path,
	       FALSE AS dirty,
	       NULL AS expiry
	FROM node_path_view npv;
