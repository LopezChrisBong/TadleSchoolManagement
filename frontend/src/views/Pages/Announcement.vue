<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <AnnouncementDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import AnnouncementDataTable from '../../components/Utils/AnnouncementDataTable.vue';
export default {
  components: {
    AnnouncementDataTable,
  },
  created() {
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch('setUser', null);
      this.$store.dispatch('setIsAuthenticated', 0);
      this.render = true;
      this.$router.push('/');
    }
  },
  mounted() {},
  data: () => ({
    typeData: [],
    action: null,
    hasHead: false,
  }),
  methods: {
    add() {
      this.typeData = [{ id: null }];
      this.action = 'Add';
    },
    getHeadCount() {
      this.axiosCall('/my-direct-head/getMyDirectHeadCount', 'GET').then(
        (res) => {
          this.hasHead = res.data;
        },
      );
    },
  },
};
</script>

<style></style>
