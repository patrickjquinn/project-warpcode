<script>
	export let items = []
	export let add
	export let activeTabValue = 1

	const handleClick = (tabValue) => () => {
		activeTabValue = tabValue
		const index = items.findIndex((el) => el.value === activeTabValue)
		const tab = items[index]
		notifyAppOfFileChange(tab)
	}

	const notifyAppOfFileChange = (tab) => {
		const event = new CustomEvent('fileSelectedDirect', {
			detail: { name: tab.label, type: tab.type, path: tab.path },
			bubbles: true,
			cancelable: true,
			composed: false
		})
		window.dispatchEvent(event)
	}

	const removeTab = () => {
		const i = items.findIndex((el) => el.value === activeTabValue)
		items.splice(i, 1)
		for (let [index] of items.entries()) {
			items[index].value = index + 1
		}
		if (items.length > 0) {
			notifyAppOfFileChange(items[0])
			activeTabValue = items[0].value
		}
	}
</script>

<ul>
	{#each items as item}
		<li class="{activeTabValue === item.value ? 'active' : ''}">
			{#if activeTabValue === item.value}
				<span
					>{item.label}
					<span on:click="{removeTab}" style="display:inline-block; padding:0;">x</span></span
				>
			{:else}
				<span on:click="{handleClick(item.value)}">{item.label}</span>
			{/if}
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
