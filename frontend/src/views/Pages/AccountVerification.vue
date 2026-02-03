<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <AccountVerificationDataTable />
        </v-col>
      </v-row>
    </v-card>

    <AccountVerificationDialog :data="typeData" :action="action" />
  </div>
</template>

<script>
import AccountVerificationDataTable from "../../components/Utils/AccountVerificationDataTable.vue";
export default {
  components: {
    AccountVerificationDataTable,
  },
  created() {
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
    }
  },
  data: () => ({
    typeData: [],
    action: null,
  }),
  methods: {
    addOffice() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
