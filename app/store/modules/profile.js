import localstorage from "nativescript-localstorage";


function initialState() {
    return {
        language: "en",
        initRoute: "login",
        user_id: "",
        access_key: "",
        owners: [],
        device_id: "",
        lastPosition: {gps_lat: 76.889709, gps_lon: 43.238949, gps_alt: 0, time_unix: 0},
        positions: [],
        destinations: []
    }
}

let profile = localStorage.getItem('profile');

if (profile) {
    profile = JSON.parse(profile);
    const s = initialState();
    Object.keys(s).forEach(key => {
        if (!(key in profile)) {
            profile[key] = s[key];
        }
    });
} else {
    profile = initialState();
}

let state = profile;

const mutations = {
    changeLanguage (state) {
        state.language == "en" ? state.language = "ru" : state.language = "en";
        localStorage.setItem('profile', JSON.stringify(state));
    },
    setInitialRoute(state, route) {
        state.initRoute = route;
        localStorage.setItem('profile', JSON.stringify(state));
    },
    addProfileData(state, payload) {
        state.user_id = payload.user_id;
        state.access_key = payload.access_key;
        payload.owners.forEach((owner) => {
            state.owners.push(owner);
        });
        localStorage.setItem('profile', JSON.stringify(state));
    },
    addDeviceId(state, uuid) {
        state.device_id = uuid;
        localStorage.setItem('profile', JSON.stringify(state));
    },
    addLastPosition(state, payload) {
        state.lastPosition = payload;
        localStorage.setItem('profile', JSON.stringify(state));
    },
    addPosition(state, payload) {
        state.positions.push(payload);
        localStorage.setItem('profile', JSON.stringify(state));
    },
    clearPositions(state) {
        state.positions = [];
        localStorage.setItem('profile', JSON.stringify(state));
    },
    addDestination(state, payload) {
        state.destinations.push(payload);
        localStorage.setItem('profile', JSON.stringify(state));
    }
};

const actions = {
    changeLanguage: ({commit}) => commit('changeLanguage'),
    setInitialRoute: ({commit}, value) => commit('setInitialRoute', value),
    addProfileData: ({commit}, payload) => commit('addProfileData', payload),
    addDeviceId: ({commit}, value) => commit('addDeviceId', value),
    addLastPosition: ({commit}, payload) => commit('addLastPosition', payload),
    addPosition: ({commit}, payload) => commit('addPosition', payload),
    clearPositions: ({commit}) => commit('clearPositions'),
    addDestination: ({commit}, payload) => commit('addDestination', payload),
};

export default {
    state,
    mutations,
    actions,
};