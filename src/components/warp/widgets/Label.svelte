<script lang="ts">
	export let id
</script>

<p id="{id}" contenteditable="true"><slot></slot></p>

<style>
	p {
		background-color: white;
		padding: 10px;
		color: black;
		width: 50%;
	}
</style>
