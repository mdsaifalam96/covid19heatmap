import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    covid19_API_URL: "https://api.covid19india.org/data.json",
    covid19_API_DATA: {},
    covid19_STATEWISE_DATA: [],
    covid19_INDIA_DATA: {},
    covid19_STATEWISE_COORDS: require("../raw_data/coords.json"),
  },
  mutations: {
    fetchData(state) {
      axios
        .get(state.covid19_API_URL)
        .then((res) => {
          state.covid19_API_DATA = res.data;
          state.covid19_STATEWISE_DATA = res.data.statewise;
          state.covid19_INDIA_DATA = state.covid19_STATEWISE_DATA.shift();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  actions: {},
  modules: {},
});
