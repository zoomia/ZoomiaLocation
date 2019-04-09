import Vue from 'nativescript-vue';
import VueDevtools from 'nativescript-vue-devtools';
import { MapViewBase } from 'nativescript-google-maps-sdk';
import routes from './router';
import store from "./store";

import Init from './components/Init';
import MapFragment from './fragments/Map';
import ListFragment from './fragments/List';

import { setStatusBarColors } from './utils/statusBar';

if(TNS_ENV !== 'production') {
    Vue.use(VueDevtools)
}

Vue.prototype.$routes = routes;
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

Vue.registerElement('MapView', ()=> require('nativescript-google-maps-sdk').MapView);
Vue.component('MapFragment', MapFragment);
Vue.component('ListFragment', ListFragment);

setStatusBarColors();

new Vue({
    store,
    render: h => h('frame', [h(Init)])
}).$start();