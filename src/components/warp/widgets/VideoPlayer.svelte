<script lang="ts">
	export let id
	export let src
</script>

<iframe
	id="{id}"
	width="auto"
	height="auto"
	src="{src}"
	title="YouTube video player"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	allowfullscreen></iframe>

<style>
	iframe {
		width: 100%;
		height: 512px;
	}
</style>
