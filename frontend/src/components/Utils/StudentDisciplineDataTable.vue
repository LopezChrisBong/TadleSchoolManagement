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
        <!-- <v-btn
          class="me-2"
          prepend-icon="mdi-plus"
          rounded="lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          text="Add"
          border
          @click="add()"
        ></v-btn> -->
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
        <template v-slot:[`item.report_type`]="{ item }">
          {{
            item.report_type == 1 ? "Academic Concern" : "Disciplinary Concern"
          }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            color="primary"
            variant="outlined"
            @click="viewItem(item)"
            block
            class="my-1"
          >
            <v-icon start size="18"> mdi-eye </v-icon>
            Report
          </v-btn>
        </template>

        <template #no-data>
          <v-alert type="info" border="start" color="white">
            No data found.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="reportDialog" max-width="600" eager scrollable>
      <v-card>
        <v-card-title class="d-flex dialog-header align-center">
          <span v-if="studentReportData">
            Reported Student {{ studentReportData.name }}</span
          >
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="reportDialog = false"
          >
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="">
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="studentReportData.report_type"
                :rules="[formRules.required]"
                dense
                outlined
                class="rounded-lg"
                readonly
                item-title="description"
                item-value="id"
                label="Report Type"
                color="pink"
                :items="[
                  { id: 1, description: 'Academic Concern' },
                  { id: 2, description: 'Disciplinary Concern' },
                ]"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="studentReportData.report_description"
                label="Report Description"
                row-height="30"
                rows="3"
                variant="outlined"
                readonly
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="teal darken-3" outlined @click="reportDialog = false">
            Close
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            v-if="tab == 1"
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="submitReport()"
          >
            Submit TO Prefect
          </v-btn>
        </v-card-actions>
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
export default {
  components: {},
  data: () => ({
    search: "",
    dialog: false,
    userRoleID: null,
    headers: [
      { title: "Name", value: "name", align: "start" },
      { title: "Reported BY:", value: "teacher_name", align: "center" },
      { title: "Subject", value: "subject_title", align: "center" },
      { title: "Grade Level", value: "grade_level", align: "center" },
      { title: "Type", value: "report_type", align: "center" },
      {
        title: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    studentReportData: [],
    data: [],
    userId: null,
    activeTab: { id: 1, name: "Reports", active: true },
    tab: 1,
    tabList: [],
    loading: false,
    reportDialog: false,
    options: {},
    action: null,
    filter: null,
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
    // eventBus.on("closeAccountsVerificationDialog", () => {
    //   if (this.tab == 1) {
    //     this.initialize();
    //   } else if (this.tab == 2) {
    //     this.getVerifiedUsers();
    //   }
    // });
    // eventBus.on("closeAddAccountDialog", () => {
    //   if (this.tab == 1) {
    //     this.initialize();
    //   } else if (this.tab == 2) {
    //     this.getVerifiedUsers();
    //   }
    // });
  },
  beforeUnmount() {
    // eventBus.off("closeAccountsVerificationDialog");
    // eventBus.off("closeAddAccountDialog");
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
    isMobile() {
      return this.$vuetify.display.mobile;
    },
  },

  watch: {
    options: {
      handler() {
        this.initialize();
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

  methods: {
    initialize() {
      this.userId = this.$store.state.user.id;
      this.userRoleID = this.$store.state.user.user.user_roleID;
      this.filter = this.$store.getters.getFilterSelected;
      if (this.userRoleID == 2) {
        this.tabList = [
          { id: 1, name: "Reports", active: true },
          { id: 2, name: "Submitted", active: false },
        ];
      } else {
        this.tabList = [
          { id: 1, name: "Adviser", active: true },
          { id: 2, name: "Parent", active: false },
        ];
      }

      this.loading = false;
      // console.log("userRoleID", userRoleID);
      if (this.userRoleID == 6) {
        console.log("junior");
        this.axiosCall(
          "/parent-records/getPrefectReport/" +
            this.filter +
            "/" +
            this.tab +
            "/" +
            this.userRoleID,
          "GET"
        ).then((res) => {
          if (res) {
            // console.log(res.data);
            let data = Array.isArray(res.data) ? res.data : [];
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else if (this.userRoleID == 7) {
        console.log("senior");
        this.axiosCall(
          "/parent-records/getPrefectReport/" +
            this.filter +
            "/" +
            this.tab +
            "/" +
            this.userRoleID,
          "GET"
        ).then((res) => {
          if (res) {
            // console.log(res.data);
            let data = Array.isArray(res.data) ? res.data : [];
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall(
          "/parent-records/getDisciplinaryReport/" +
            this.filter +
            "/" +
            this.tab +
            "/" +
            this.userId,
          "GET"
        ).then((res) => {
          if (res) {
            // console.log(res.data);
            let data = Array.isArray(res.data) ? res.data : [];
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      }
    },
    add() {
      console.log("Love");
    },
    viewItem(item) {
      this.studentReportData = item;
      this.reportDialog = true;
    },
    submitReport() {
      // alert("submitted");
      let data = {
        status: this.userRoleID == 3 ? 1 : 2,
      };
      this.axiosCall(
        "/parent-records/updateStudentReport/" +
          this.studentReportData.reportID,
        "PATCH",
        data
      ).then((res) => {
        console.log(res);

        if (res.data.status == 201) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "Successfully Updated";
          this.reportDialog = false;
          this.initialize();
          // this.$router.go(0);
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = res.data.msg;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab.id;
      this.tab = tab.id;
      this.initialize();

      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });
    },

    confirmDelete() {
      this.axiosCall("/user-details/" + this.SF10Data.id, "DELETE").then(
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
