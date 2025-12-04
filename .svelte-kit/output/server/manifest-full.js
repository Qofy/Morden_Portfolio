export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store",".gitkeep","assets/.DS_Store","assets/profile/.DS_Store","assets/profile/profile.png","data/article.json","wasm/.gitkeep","wasm/wasm_logic.js","wasm/wasm_logic_bg.wasm"]),
	mimeTypes: {".png":"image/png",".json":"application/json",".js":"text/javascript",".wasm":"application/wasm"},
	_: {
		client: {start:"_app/immutable/entry/start.CfLuRJtS.js",app:"_app/immutable/entry/app.CpIOtSrt.js",imports:["_app/immutable/entry/start.CfLuRJtS.js","_app/immutable/chunks/D9LE-Bjo.js","_app/immutable/chunks/Ddzy9yRd.js","_app/immutable/chunks/C5DPmBWz.js","_app/immutable/entry/app.CpIOtSrt.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/Ddzy9yRd.js","_app/immutable/chunks/DorMfE8p.js","_app/immutable/chunks/D4fZ_g2E.js","_app/immutable/chunks/C5DPmBWz.js","_app/immutable/chunks/BmrWgj5Q.js","_app/immutable/chunks/Ca_15C3y.js","_app/immutable/chunks/BRm5XKiR.js","_app/immutable/chunks/Ca1ymtt3.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/[username]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
