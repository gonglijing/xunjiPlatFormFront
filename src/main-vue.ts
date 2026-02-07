import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { directive } from '/@/utils/directive';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import '/@/theme/index.scss';
import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout';
import { getUpFileUrl, handleTree, selectDictLabel } from '/@/utils/common';
import { useDict } from '/@/api/common/dict/data';
import pagination from '/@/components/pagination/index.vue';
import copy from '/@/components/copy/index.vue';
import JsonViewer from 'vue3-json-viewer';

import VForm3 from 'vform3-builds';
import 'vform3-builds/dist/designer.style.css';

const app = createApp(App);

directive(app);
other.elSvg(app);

app.component('pagination', pagination);
app.component('copy', copy);
app
	.use(router)
	.use(store, key)
	.use(ElementPlus, { i18n: i18n.global.t })
	.use(i18n)
	.use(JsonViewer)
	.use(VueGridLayout)
	.use(VForm3)
	.mount('#app');

app.config.globalProperties.getUpFileUrl = getUpFileUrl;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.mittBus = mitt();

const matchMedia = window.matchMedia('(prefers-color-scheme: light)');

matchMedia.addEventListener('change', function () {
	setTheme(this.matches);
});

function setTheme(matches: boolean) {
	const body = document.documentElement as HTMLElement;
	body.setAttribute('data-theme', matches ? '' : 'dark');
	document.querySelector('html')!.className = matches ? '' : 'dark';
}
