<template>
  <div class="home">
    <Map class="map-container" />
  </div>
</template>

<script>
import Map from "@/components/Map.vue";

export default {
  name: "Home",
  components: {
    Map,
  },
};
</script>

<style>
.home {
  height: 100vh;
}

.map-container {
  width: 100vw;
  height: 100vh;
}
</style>
