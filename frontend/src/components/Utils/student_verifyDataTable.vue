<template>
  <div>
    <v-row class="mx-2 mt-2">
      <v-col cols="12" md="5" class="flex-items" style="overflow: auto">
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
      <v-spacer></v-spacer>
      <v-col cols="12" md="3">
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
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="tab == 1 ? headers : headers1"
        :items="data"
        :items-per-page="10"
        :search="search"
        @update:options="options"
        :loading="loading"
        @pagination="pagination"
      >
        <template v-slot:[`item.fname`]="{ item }">
          {{ item.fname }} {{ item.lname }}
        </template>
        <template v-slot:[`item.updated_at`]="{ item }">
          {{ formatDate(item.updated_at) }}
        </template>

        <template v-slot:[`item.statusEnrolled`]="{ item }">
          <v-chip :color="item.statusEnrolled === 1 ? 'green' : 'orange'">
            {{ item.statusEnrolled === 1 ? "Enrolled" : "Droped" }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-btn x-small color="pink" outlined @click="editItem(item)">
              <v-icon size="14">{{
                tab == 1 ? "mdi-pencil-outline" : "mdi-eye"
              }}</v-icon>
              {{ tab == 1 ? "Verify" : "Update" }}
            </v-btn>

            <v-btn
              class="mx-2"
              x-small
              color="green"
              outlined
              @click="viewItem(item)"
            >
              <v-icon size="14">mdi-eye</v-icon>
              View
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <AccountVerificationDialog :data="updateData" :action="action" />

    <ViewAccountVerificationDialog :data="viewData" :action="action" />

    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Confirmation </v-card-title>

        <v-card-text style="font-size: 17px">
          Are you sure you want to delete this item ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-3"
            outlined
            @click="dialogConfirmDelete = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="
              confirmDelete();
              dialogConfirmDelete = false;
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </div>
</template>
<script>
import eventBus from "@/eventBus";
import AccountVerificationDialog from "../../components/Dialogs/Forms/student_verifyDialog.vue";
import ViewAccountVerificationDialog from "../../components/Dialogs/Views/ViewStudentVerificationDialog.vue";
export default {
  components: {
    AccountVerificationDialog,
    ViewAccountVerificationDialog,
  },
  data: () => ({
    search: "",
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
    headers1: [
      { title: "Name", value: "name", align: "start" },
      { title: "Enrolled", value: "updated_at", align: "center" },
      { title: "Status", value: "statusEnrolled", align: "center" },
      {
        title: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    data: [],
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
      { id: 2, name: "Enrolled", active: false },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    viewData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
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
    eventBus.on("closeStudentVerificationDialog", () => {
      if (this.tab == 1) {
        this.initialize();
      } else if (this.tab == 2) {
        this.getVerifiedUsers();
      }
    });
    eventBus.on("closeAccountsVerificationDialog", () => {
      if (this.tab == 1) {
        this.initialize();
      } else if (this.tab == 2) {
        this.getVerifiedUsers();
      }
    });
  },
  beforeUnmount() {
    eventBus.off("closeStudentVerificationDialog");
    eventBus.off("closeAccountsVerificationDialog");
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
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.loading = true;
      this.tab = 1;
      this.activeTab = { id: 1, name: "For Verification" };
      this.axiosCall("/enroll-student/EnrollStudent", "GET").then((res) => {
        if (res) {
          console.log("Enrolled", res.data);
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });

          this.data = data;
          this.loading = false;
        }
      });
    },

    getVerifiedUsers() {
      this.loading = true;

      this.axiosCall("/enroll-student/EnrolledStudent", "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;

      if (tab.id == 1) {
        this.initialize();
        this.tab = tab.id;
      } else if (tab.id == 2) {
        this.getVerifiedUsers();
        this.tab = tab.id;
      }
      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });
    },
    // deleteItem(item) {
    //   this.dialogConfirmDelete = true;
    //   this.deleteData = item;
    // },
    editItem(item) {
      if (this.tab == 1) {
        this.updateData = item;
        this.action = "Verify";
      } else {
        this.updateData = item;
        this.action = "Update";
      }
    },

    viewItem(item) {
      console.log(item);
      if (this.tab == 1) {
        this.viewData = item;
        this.action = "View";
      } else {
        this.viewData = item;
        this.action = "Update";
      }
    },
    // confirmDelete() {
    //   this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
    //     () => {
    //       this.fadeAwayMessage.show = true;
    //       this.itemData = null;
    //       this.initialize();
    //     }
    //   );
    // },
  },
};
</script>
