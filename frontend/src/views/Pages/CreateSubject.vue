<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl mb-4">
                <v-toolbar-title
                  ><strong class="text-gray-100">{{
                    $route.meta.title
                  }}</strong></v-toolbar-title
                >
                <v-spacer></v-spacer>
              </v-toolbar> -->
          <CreateSubjectDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import CreateSubjectDataTable from "../../components/Utils/CreateSubjectDataTable.vue";
export default {
  components: {
    CreateSubjectDataTable,
  },
  created() {
    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },
  mounted() {
    // this.getHeadCount();
  },
  data: () => ({
    typeData: [],
    action: null,
    hasHead: false,
  }),
  methods: {
    add() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
    getHeadCount() {
      this.axiosCall("/my-direct-head/getMyDirectHeadCount", "GET").then(
        (res) => {
          this.hasHead = res.data;
        }
      );
    },
  },
};
</script>

<style></style>
