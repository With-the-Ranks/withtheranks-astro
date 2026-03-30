/** @type {import('tailwindcss').Config} */
export default {
  	darkMode: ['class', '[data-theme="dark"]'],
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    	extend: {
    		fontFamily: {
    			display: [
    				'"League Gothic"',
    				'ui-sans-serif',
    				'system-ui',
    				'sans-serif'
    			],
    			sans: [
    				'"Tofino Personal"',
    				'ui-sans-serif',
    				'system-ui',
    				'sans-serif'
    			]
    		},
    		fontSize: {
    			'display-xl': [
    				'clamp(3rem, 8vw, 6rem)',
    				{ lineHeight: '0.95', letterSpacing: '-0.02em' }
    			],
    			'display-lg': [
    				'clamp(2rem, 5vw, 4rem)',
    				{ lineHeight: '1', letterSpacing: '-0.02em' }
    			],
    			'body-lg': ['1.5rem', { lineHeight: '1.4' }],
    			body: ['1rem', { lineHeight: '1.5' }]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)',
    			card: '2rem'
    		},
    		colors: {
    			background: 'var(--main-bg-color)',
    			foreground: 'var(--main-text-color)',
    			'accent-green': 'var(--stop-one-color)',
    			'accent-purple': 'var(--stop-two-color)'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
}
