
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/dashboard" | "/login" | "/register" | "/[username]";
		RouteParams(): {
			"/[username]": { username: string }
		};
		LayoutParams(): {
			"/": { username?: string };
			"/dashboard": Record<string, never>;
			"/login": Record<string, never>;
			"/register": Record<string, never>;
			"/[username]": { username: string }
		};
		Pathname(): "/" | "/dashboard" | "/dashboard/" | "/login" | "/login/" | "/register" | "/register/" | `/${string}` & {} | `/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/.gitkeep" | "/assets/.DS_Store" | "/assets/profile/.DS_Store" | "/assets/profile/profile.png" | "/data/article.json" | "/wasm/.gitkeep" | "/wasm/wasm_logic.js" | "/wasm/wasm_logic_bg.wasm" | string & {};
	}
}