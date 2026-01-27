<template>
  <div>
    <v-row class="mx-2 mt-3">
      <v-col cols="12" md="6" class="flex-items">
        <!-- <v-tabs v-model="activeTab" color="#147452" align-tabs="left">
            <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
              tab.name
            }}</v-tab>
          </v-tabs> -->
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="underLoad()"
        >
          <v-icon left> mdi-clipboard-list-outline </v-icon>
          List of Underload & Overload
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6" class="d-flex justify-space-between">
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
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          @click="printDialog = true"
        >
          <v-icon left> mdi-printer-outline </v-icon>
          Print
        </v-btn>
        <!-- <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn> -->
        <!-- <v-btn
                  :class="tab == 3 ? '' : 'd-none'"
                  class="white--text ml-2 rounded-lg"
                  color="#147452"
                  v-if="this.$store.state.user.user.isAdminApproved == 1"
                  @click="printJobApplicants()"
                >
                  <v-icon left> mdi-printer-outline </v-icon>
                  Print
                </v-btn> -->
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="1">
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

    <v-dialog
      v-model="printDialog"
      persistent
      max-width="520"
      transition="dialog-bottom-transition"
    >
      <v-card rounded="xl" elevation="8">
        <!-- HEADER -->
        <v-card-title class="px-4 py-3">
          <div class="d-flex align-center justify-space-between w-100">
            <div>
              <div class="text-h6 font-weight-bold">Select Faculty</div>
              <div class="text-caption text-grey">
                Choose a faculty member to print the schedule
              </div>
            </div>

            <v-btn
              icon
              variant="text"
              density="comfortable"
              @click="printDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-divider />

        <!-- CONTENT -->
        <v-card-text class="px-4 pt-4">
          <v-autocomplete
            v-model="teacher"
            :rules="[formRules.required]"
            :items="TeachersList"
            item-title="name"
            item-value="id"
            label="Faculty"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-account-tie"
            clearable
          />
        </v-card-text>

        <!-- ACTIONS -->
        <v-card-actions class="px-4 pb-4">
          <v-spacer />

          <v-btn variant="outlined" color="red" @click="printDialog = false">
            Cancel
          </v-btn>

          <v-btn
            color="pink"
            variant="flat"
            prepend-icon="mdi-printer"
            :disabled="!teacher"
            @click="printMySched()"
          >
            Confirm & Print
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
      :timeout="5000"
    ></fade-away-message-component>
  </div>
</template>
<script>
import eventBus from "@/eventBus";
export default {
  components: {},
  data: () => ({
    search: "",
    taggingData: null,
    fullname: null,
    applicantData: null,
    TeachersList: [],
    teacher: null,
    headers: [
      {
        title: "Time",
        value: "time",
        align: "start",
        valign: "start",
        sortable: false,
      },
      {
        title: "Faculty Name",
        value: "name",
        align: "start",
        valign: "start",
        sortable: false,
      },
      {
        title: "Monday",
        value: "Monday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        title: "Tuesday",
        value: "Tuesday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        title: "Wednesday",
        value: "Wednesday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        title: "Thursday",
        value: "Thursday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        title: "Friday",
        value: "Friday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      // {
      //   text: "Saturday",
      //   value: "Saturday",
      //   align: "center",
      //   valign: "center",
      //   sortable: false,
      // },

      // {
      //   text: "Action",
      //   value: "action",
      //   align: "end",
      //   valign: "end",
      //   sortable: false,
      // },
    ],

    data: [],
    gradeName: null,
    printData: [],
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
    activeTab: { id: 1, name: "Tracks" },
    tab: 1,
    tabList: [{ id: 1, name: "Tracks" }],
    coreTimeData: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    toPrint: null,
    reportTypeList: [],
    jobitem: null,
    jobitemsList: [],
    selectedYear: null,
    selectedMonth: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    printDialog: false,
    JobPostPrint: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
    yearList: [],
    monthsList: [
      { id: 0, name: "All" },
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" },
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" },
    ],
  }),

  mounted() {
    this.initialize();
    eventBus.on("closeAddTrackDialog", () => {
      this.initialize();
    });
  },

  beforeUnmount() {
    eventBus.off("closeAddTrackDialog");
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
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },

    // filterPrintData() {
    //   return this.paginate(
    //     this.data.filter((data) =>
    //       data.employee.toLowerCase().match(this.search.toLowerCase())
    //     )
    //   );
    // },
  },
  methods: {
    tag(item) {
      this.taggingData = item;
      this.action = "Tag";
    },

    printJobApplicants() {
      this.JobPostPrint = true;

      // this.handleAllChanges();
    },
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      // this.handleAllChanges();
      this.getRoleTeachers();
      this.loading = true;
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall("/enroll-student/FacultySchedule/" + filter, "GET").then(
        (res) => {
          if (res) {
            this.data = res.data;
            this.loading = false;
          }
        },
      );
    },
    underLoad() {
      // alert("underload faculty");
      let filter = this.$store.getters.getFilterSelected;
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getAllUnderLoadFaculty/" +
          filter +
          "",
        "_blank",
      );
    },
    changeTab(tab) {
      this.activeTab = tab;

      // if (tab.id == 1) {

      this.tab = tab.id;
      this.initialize();
      // } else if (tab.id == 2) {
      //   this.getVerifiedUsers();
      //   this.tab = tab.id;
      // }
    },
    add() {
      this.coreTimeData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      console.log(this.tab, item);
      this.coreTimeData = item;
      this.action = "Update";
    },

    getRoleTeachers() {
      this.axiosCall(
        "/user-details/getAllVerifiedUser/TeachingRoleSched",
        "GET",
      ).then((res) => {
        console.log("Teacher Role", res.data);
        this.TeachersList = res.data;
      });
    },

    printMySched() {
      console.log("User", this.teacher);
      if (this.teacher == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please select teacher to generate!";
      } else {
        this.printDialog = false;
        let filter = this.$store.getters.getFilterSelected;
        window.open(
          process.env.VUE_APP_SERVER +
            "/pdf-generator/getMySchedule/" +
            this.teacher +
            "/" +
            filter +
            "",
          "_blank", // <- This is what makes it open in a new window.
        );
      }
    },

    // deleteItem() {
    //   this.axiosCall("/rooms-section/" + this.deleteData.id, "DELETE").then(
    //     (res) => {
    //       if (res.data.status == 200) {
    //         this.dialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "success";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //         this.printDialog = false;
    //         this.initialize();
    //       } else if (res.data.status == 400) {
    //         this.printDialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "error";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //       }
    //     }
    //   );
    // },
    // confirmDelete(item) {
    //   this.printDialog = true;
    //   this.deleteData = item;
    // },
  },
};
</script>
