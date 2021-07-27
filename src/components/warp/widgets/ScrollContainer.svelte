<script lang="ts">
	export let id
</script>

<div id="{id}"><slot></slot></div>

<style>
	div {
		background-color: gray;
		width: 100%;
		height: 10rem;
		overflow: scroll;
		resize: both;
	}
</style>
