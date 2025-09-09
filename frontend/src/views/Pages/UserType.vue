<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-toolbar flat class="rounded-xl mb-7">
            <v-toolbar-title
              ><strong>User Type Details</strong></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn
              class="white--text rounded-lg"
              color="#e35e93"
              @click="addRequest()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Type of Users
            </v-btn>
          </v-toolbar>
          <UserTypeDataTable />
        </v-col>
      </v-row>
    </v-card>

    <UserTypeDialog :data="typeData" :action="action" />
  </div>
</template>

<script>
import UserTypeDataTable from "../../components/Utils/UserTypeDataTable.vue";
import UserTypeDialog from "../../components/Dialogs/Forms/UserTypeDialog.vue";
export default {
  name: "RequestType",
  components: {
    UserTypeDataTable,
    UserTypeDialog,
  },
  data: () => ({
    typeData: [],
    action: null,
  }),
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
  methods: {
    addRequest() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
