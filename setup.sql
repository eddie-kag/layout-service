CREATE SCHEMA layout_service;

CREATE TABLE layout_service.room (
	id text PRIMARY KEY,
	name text,
	created_at timestamp,
	updated_at timestamp
);

CREATE TABLE layout_service.object (
	id text PRIMARY KEY,
	room_id text REFERENCES layout_service.room(id),
	name text,
	created_at timestamp,
	updated_at timestamp,
	coordinates geometry('POLYGON')
);