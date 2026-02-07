import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression'
import { resolve, join } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';

const srcDir = join(__dirname, 'src');
const srcReactDir = join(__dirname, 'src-react');

const framework = process.env.VITE_APP_FRAMEWORK || 'vue';

const entryFile = framework === 'vue' ? 'main-vue.ts' : 'react/main.tsx';

const alias: Record<string, string> = {
	'@': srcDir,
	'/@': srcDir,
	'/@/': srcDir,
	'@entry': join(srcReactDir, 'main.tsx'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const frameworkPlugins = framework === 'vue' ? [vue()] : [react()];
const frameworkOptimizeDeps = framework === 'vue'
	? ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en', 'element-plus/lib/locale/lang/zh-tw']
	: ['react', 'react-dom', 'react-router-dom'];
const frameworkManualChunks = framework === 'vue'
	? {
		vue: ['vue', 'vue-router', 'vuex'],
		echarts: ['echarts'],
	}
	: {
		react: ['react', 'react-dom', 'react-router-dom'],
	};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		plugins: [
			...frameworkPlugins,
			viteCompression({
				threshold: 1024 * 20,
				algorithm: 'gzip',
				ext: 'gz',
				deleteOriginFile: false,
			})
		],
		root: process.cwd(),
		resolve: { 
			alias,
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		},
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: frameworkOptimizeDeps,
		},
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: true,
			hmr: true,
			proxy: {
				'/gitee': {
					target: 'https://gitee.com',
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/gitee/, ''),
				},
				'/api/v1': {
					target: 'http://127.0.0.1:8199',
					ws: true,
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: 'dist',
			sourcemap: false,
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					entryFileNames: `assets/[name].${new Date().getTime()}.js`,
					chunkFileNames: `assets/[name].${new Date().getTime()}.js`,
					assetFileNames: `assets/[name].${new Date().getTime()}.[ext]`,
					compact: true,
					manualChunks: frameworkManualChunks,
				},
			},
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
				},
				ie8: true,
				output: {
					comments: true,
				},
			},
		},
		css: {
			postcss: {
				plugins: [
					{
						postcssPlugin: 'internal:charset-removal',
						AtRule: {
							charset: (atRule) => {
								if (atRule.name === 'charset') {
									atRule.remove();
								}
							},
						},
					},
				],
			},
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
		},
	};
});

export default viteConfig;
