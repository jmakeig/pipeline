INSERT INTO auth.users(
	user_name,
	password_hash,
	first_name,
	last_name
)
VALUES(
	'jmakeig',
	E'\0442y\04410\044CUemxCeWjVgpcCe3T2/HkOyNtFaYVTh3COhqwMWQcd/jP2wH/agkG',
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
