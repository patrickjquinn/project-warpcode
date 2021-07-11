<script>
	export let items = []
    export let add
	export let activeTabValue = 1

	const handleClick = (tabValue) => () => (activeTabValue = tabValue)
</script>

<ul>
	{#each items as item}
		<li class="{activeTabValue === item.value ? 'active' : ''}">
			<span on:click="{handleClick(item.value)}">{item.label}</span>
		</li>
	{/each}
    {#if add}
        <li>
            <span>+</span>
        </li>
    {/if}
</ul>

<style>
	:root {
		background-color: #282828;
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
		margin-top: 0;
	}
	li {
		margin-bottom: -1px;
	}

	span {
		border: 1px solid transparent;
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
		color: white;
		font-size: 12px;
	}

	span:hover {
		border-color: darkgray;
	}

	li.active > span {
		color: white;
		background-color: black;
	}
</style>
