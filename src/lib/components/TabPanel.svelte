<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tab = {
		id: string;
		label: string;
		icon?: Snippet;
		content: Snippet;
	};

	type Props = {
		tabs: Tab[];
		activeTab?: string;
		onTabChange?: (tabId: string) => void;
		class?: string;
	};

	let { tabs, activeTab = tabs[0]?.id, onTabChange, class: className = '' }: Props = $props();

	function handleTabClick(tabId: string) {
		activeTab = tabId;
		onTabChange?.(tabId);
	}

	const currentTab = $derived(tabs.find((tab) => tab.id === activeTab) || tabs[0]);
</script>

<div class="w-full {className}">
	<!-- Tab Headers -->
	<div class="border-b border-gray-200 bg-white">
		<nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
			{#each tabs as tab (tab.id)}
				<button
					class="flex items-center border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					tab.id
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					onclick={() => handleTabClick(tab.id)}
				>
					{#if tab.icon}
						<span class="mr-2">
							{@render tab.icon()}
						</span>
					{/if}
					{tab.label}
				</button>
			{/each}
		</nav>
	</div>

	<!-- Tab Content -->
	<div class="bg-white p-6">
		{#if currentTab}
			{@render currentTab.content()}
		{/if}
	</div>
</div>
