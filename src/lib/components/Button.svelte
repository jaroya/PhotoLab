<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		class?: string;
		onclick?: () => void;
		children: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

	const variants = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
		outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
</script>

<button {disabled} class={classes} {onclick}>
	{@render children()}
</button>
