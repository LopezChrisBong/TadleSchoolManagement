<template>
  <v-container fluid>
    <!-- Header with Tabs & Search -->
    <v-row class="align-center mb-4 mt-2 flex-items">
      <v-col cols="12" md="4" class="flex-items" style="overflow: auto">
        <v-tab
          v-for="tab in tabList"
          :key="tab.id"
          :value="tab.id"
          @click="changeTab(tab)"
          :class="[
            ' pa-3 mx-3 transition-all',
            tab.active ? 'bg-pink-lighten-1 text-white' : 'bg-grey-lighten-4',
          ]"
          rounded="lg"
          >{{ tab.name }}</v-tab
        >
      </v-col>

      <v-col cols="12" md="6" offset-md="2" class="d-flex">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mr-2"
          color="primary"
        />
        <v-btn
          class="me-2"
          prepend-icon="mdi-plus"
          rounded="lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          text="Add"
          border
          @click="add()"
        ></v-btn>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card class="elevation-1">
      <v-data-table
        :items="data"
        :class="isMobile"
        :headers="headers"
        :search="search"
        :items-per-page="10"
        :loading="loading"
        loading-text="Loading users..."
        class="rounded"
        dense
      >
        <template v-slot:[`item.fname`]="{ item }">
          {{ item.fname }} {{ item.lname }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            color="primary"
            variant="outlined"
            @click="tab == 1 ? editItem(item) : viewItem(item)"
            block
            class="my-1"
          >
            <v-icon start size="18">{{
              tab === 1 ? "mdi-check" : "mdi-eye"
            }}</v-icon>
            {{ tab === 1 ? "Verify" : "View" }}
          </v-btn>
          <v-btn
            v-if="tab === 1"
            size="small"
            color="error"
            class="my-1"
            variant="outlined"
            block
            @click="deleteItem(item)"
          >
            <v-icon start size="18">mdi-delete</v-icon>
            Delete
          </v-btn>
        </template>

        <template #no-data>
          <v-alert type="info" border="start" color="white">
            No users found.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Verification Dialog -->
    <AccountVerificationDialog :data="updateData" :action="action" />
    <AddAccountDialog :data="addData" :action="action" />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this account?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogConfirmDelete = false"
            >Cancel</v-btn
          >
          <v-btn color="error" class="white--text" @click="confirmDelete">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- view dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between">
            <span class="headline">View</span>
            <v-btn
              variant="text"
              icon="mdi-close"
              density="compact"
              color="red"
              @click="dialog = false"
            ></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-btn
                text
                style="width: 100%; height: auto"
                @click="editItem(dataEdit)"
              >
                <div class="d-flex justify-center align-center">
                  <div>
                    <v-icon size="90">mdi-file-cog-outline</v-icon><br />Module
                  </div>
                </div>
              </v-btn>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                text
                style="width: 100%; height: auto"
                @click="personalInfo(dataEdit)"
              >
                <div class="d-flex justify-center align-center">
                  <div>
                    <v-icon size="90">mdi-file-image-plus-outline</v-icon
                    ><br />Personal Info
                  </div>
                </div>
              </v-btn>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                text
                style="width: 100%; height: auto"
                @click="credentials(dataEdit)"
              >
                <div class="d-flex justify-center align-center">
                  <div>
                    <v-icon size="90">mdi-file-sign</v-icon><br />Credentials
                  </div>
                </div>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer />
          <v-btn color="red" outlined class="mt-4" @click="dialog = false">
            Cancel
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
    <!-- Toast Message -->
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    />
  </v-container>
</template>

<script>
import eventBus from "@/eventBus";
import AccountVerificationDialog from "../../components/Dialogs/Forms/AccountVerificationDialog.vue";
import AddAccountDialog from "../../components/Dialogs/Forms/AddAccountDialog.vue";
export default {
  components: {
    AccountVerificationDialog,
    AddAccountDialog,
  },
  data: () => ({
    search: "",
    dialog: false,
    headers: [
      { title: "Name", value: "name", align: "start" },
      {
        title: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    data: [],
    dataEdit: [],
    verified: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "For Verification", active: true },
    tab: 1,
    tabList: [
      { id: 1, name: "For Verification", active: true },
      { id: 2, name: "Verified", active: false },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    addData: null,
    formdata: [],
    work_dates_menu: false,
    dialogConfirmDelete: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.initialize();
    this.dialog = false;
    eventBus.on("closeAccountsVerificationDialog", () => {
      if (this.tab == 1) {
        this.initialize();
      } else if (this.tab == 2) {
        this.getVerifiedUsers();
      }
    });
    eventBus.on("closeAddAccountDialog", () => {
      if (this.tab == 1) {
        this.initialize();
      } else if (this.tab == 2) {
        this.getVerifiedUsers();
      }
    });
  },
  beforeUnmount() {
    eventBus.off("closeAccountsVerificationDialog");
    eventBus.off("closeAddAccountDialog");
  },
  watch: {
    options: {
      handler() {
        if (this.tab == 1) {
          this.initialize();
        } else if (this.tab == 2) {
          this.getVerifiedUsers();
        }
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.initialize();
        }
      },
      deep: true,
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      // let filter = this.$store.getters.getFilterSelected;
      // console.log("Filted", filter);
      this.loading = true;
      this.tab = 1;

      this.axiosCall("/user-details/getAllUsersToVerify", "GET").then((res) => {
        if (res) {
          // console.log(res.data);
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.activeTab = { id: 1, name: "For Verification" };
          this.data = data;
          this.dialog = false;
          this.loading = false;
        }
      });
    },

    getVerifiedUsers() {
      this.loading = true;
      this.axiosCall("/user-details/getAllVerifiedUser", "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.dialog = false;
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab.id; // Now setting only the ID

      if (tab.id === 1) {
        this.initialize();
      } else if (tab.id === 2) {
        this.getVerifiedUsers();
      }

      this.tab = tab.id;

      // Optional: if you want visual styling control using `tab.active`
      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });
    },

    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    add() {
      this.addData = [{ id: null }];
      this.action = "Add";
    },
    personalInfo(dataEdit) {
      this.addData = dataEdit;
      this.action = "Update";
    },
    credentials(dataEdit) {
      this.addData = dataEdit;
      this.action = "Edit";
    },

    editItem(item) {
      this.updateData = item;
      // this.updateData = [{ id: null }];
      this.action = this.tab == 1 ? "Verify" : "Update";
    },
    viewItem(item) {
      this.dialog = true;
      this.dataEdit = item;
    },

    confirmDelete() {
      this.axiosCall("/user-details/" + this.deleteData.id, "DELETE").then(
        (res) => {
          console.log(res.data);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Account deleted successfully!";
          this.initialize();
        }
      );
    },
  },
};
</script>
<style scoped>
/* .v-tab {
  color: rgb(0, 133, 82) !important;
}
.v-tab--active {
  color: rgb(255, 255, 255) !important;
  background-color: blue !important;
} */
</style>
