import Vue from "nativescript-vue";
import Vuex from "vuex";
import vuexI18n from "vuex-i18n/dist/vuex-i18n.umd.js";

import profile from "./modules/profile";

import translationsEn from "../locale/en";
import translationsRu from "../locale/ru";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        profile
    }
});

Vue.use(vuexI18n.plugin, store);
Vue.i18n.add('en', translationsEn);
Vue.i18n.add('ru', translationsRu);
Vue.i18n.fallback('en');
Vue.i18n.set(store.state.profile.language);

Vue.prototype.$store = store;

export default store;