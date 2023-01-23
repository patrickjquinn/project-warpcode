<script>
	export let value, label, type
	function typeAction(node) {
		node.type = type
	}
</script>

<div>
	<label>
		{label}
		<input use:typeAction bind:value="{value}" placeholder="Enter value..." />
	</label>
</div>

<style>
	div {
		width: 90%;
		margin: auto;
		margin-top: 10%;
	}
	input {
		background-color: #18191a;
		color: white;
		border: none;
		border-radius: 4px;
		margin: 10px;
		margin-left: 0px;
		display: block;
		padding: 10px;
	}
</style>
