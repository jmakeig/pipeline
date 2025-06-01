<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<form action="?/login" method="POST">
	<div class="control">
		<label for="user_name">User</label>
		<input type="text" name="user_name" id="user_name" placeholder=" " />
	</div>
	<div class="control">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" placeholder=" " />
	</div>
	<div class="actions">
		<button>Login</button>
	</div>
</form>
