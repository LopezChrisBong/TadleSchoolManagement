<template>
  <v-app>
    <Navbar
      :reloadImg="reloadImg"
      :screenSmall="mini"
      v-on:closeNav="mini = false"
    />
  </v-app>
</template>

<script>
import Navbar from '../components/Navbar/NavbarPage.vue';
export default {
  name: 'App',
  components: {
    Navbar,
  },
  data() {
    return {
      drawer: true, // State for the sidebar
    };
  },
  method: {},
};
</script>

<style>
/* Add additional styling if needed */
</style>
