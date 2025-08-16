INSERT INTO auth.users(
	user_name,
	password_hash,
	first_name,
	last_name
)
VALUES(
	'jmakeig',
	'$2a$10$K.0TshcwCoGX4tWNkGZG3Ofb3XV2cZLgZDvCnT9zSTxdS8pVnkEf6',
	'Justin',
	'Makeig'
)
ON CONFLICT (LOWER(user_name))
DO UPDATE
	SET
		password_hash = EXCLUDED.password_hash,
		first_name = EXCLUDED.first_name,
		last_name = EXCLUDED.last_name
;
