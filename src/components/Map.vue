<template>
  <div class="flex-map">
    <div class="map" id="map"></div>
    <div id="tooltip"></div>
  </div>
</template>

<script>
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import { HexagonLayer, HeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import { MapboxLayer } from "@deck.gl/mapbox";
import { mapState } from "vuex";

export default {
  name: "Map",
  computed: {
    ...mapState([
      "covid19_STATEWISE_DATA",
      "covid19_INDIA_DATA",
      "covid19_STATEWISE_COORDS",
    ]),
  },
  methods: {},
  mounted() {
    const radiusMod = 100000;
    const COLOR_RANGE = [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78],
    ];
    const LIGHT_SETTINGS = {
      lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.2,
      lightsStrength: [0.8, 0.0, 0.8, 0.0],
      numberOfLights: 2,
    };

    // Fetch data from the covid19india API
    this.$store.commit("fetchData");

    // Initialize Mapbox
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_API_KEY;

    // Create a Mapbox map
    let map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10",
      zoom: 4.2,
      center: [79.5, 23],
      pitch: 50,
    });

    map.on("load", () => {
      let stateCoords = new Map();
      this.covid19_STATEWISE_COORDS.forEach((coord) => {
        stateCoords.set(coord.state, [coord.lon, coord.lat]);
      });

      this.covid19_STATEWISE_DATA.forEach((state) => {
        /*map.addLayer(
          new MapboxLayer({
            id: state.statecode + "-scatterplot",
            type: ScatterplotLayer,
            data: [
              {
                position: stateCoords.get(state.state),
                radius: state.confirmed % radiusMod,
              },
            ],
            getPosition: (d) => d.position,
            getRadius: (d) => d.radius,
            getFillColor: [255, 0, 255],
            pickable: true,
            onHover: ({ object, x, y }) => {
              const el = document.getElementById("tooltip");

              if (object) {
                el.innerHTML = `<strong>Total cases: </strong>${state.confirmed}<br><strong>Active cases: </strong>${state.active}`;
                el.style.display = "block";
                el.style.opacity = 0.8;
                el.style.left = x + "px";
                el.style.right = y + "px";
              } else {
                el.style.opacity = 0;
              }
            },
          }),
          "waterway-label"
        );*/

        map.addLayer(
          new MapboxLayer({
            id: state.statecode + "-hexagonplot",
            type: HexagonLayer,
            data: [
              {
                position: stateCoords.get(state.state),
                elevationWeight: state.confirmed,
              },
            ],
            radius: 30000,
            pickable: true,
            coverage: 1,
            lowerPercentile: 0,
            elevationLowerPercentile: 0,
            upperPercentile: 100,
            elevationUpperPercentile: 100,
            colorRange: COLOR_RANGE,
            elevationRange: [0, 500000],
            elevationScale: 100,
            extruded: true,
            getElevationWeight: (d) => d.elevationWeight % 2,
            getPosition: (d) => d.position,
            lightSettings: LIGHT_SETTINGS,
            opacity: 1,
          }),
          "waterway-label"
        );
      });
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flex-map {
  display: flex;
  flex-direction: column;
}

#map {
  width: 100vw;
  flex: 4;
}

#tooltip {
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 12px;
}
</style>
