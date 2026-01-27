<template>
  <v-container fluid class="pa-6">
    <!-- Header with Tabs & Search -->
    <v-card rounded="xl" elevation="1" class="mb-6">
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="12" md="6" class="d-flex flex-wrap ga-2">
            <v-btn
              size="small"
              v-for="tab in tabList"
              :key="tab.id"
              @click="changeTab(tab)"
              :color="tab.active ? 'pink' : 'grey'"
              :variant="tab.active ? 'flat' : 'tonal'"
              rounded="lg"
              >{{ tab.name }}</v-btn
            >
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="6" class="d-flex justify-end ga-3">
            <v-text-field
              v-model="search"
              placeholder="Search users..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              max-width="260"
            /> </v-col
        ></v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card rounded="xl" elevation="1">
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
            @click="viewItem(item)"
            block
            class="my-1"
          >
            <v-icon start size="18"> mdi-eye </v-icon>
            SF2
          </v-btn>
          <v-btn
            size="small"
            color="pink"
            class="my-1"
            variant="outlined"
            v-if="tab == 2"
            block
            @click="printSF10(item)"
          >
            <v-icon start size="18">mdi-eye</v-icon>
            SF10
          </v-btn>
        </template>

        <template #no-data>
          <v-empty-state
            icon="mdi-account-off"
            title="No users found"
            text="Try adjusting your search or filters"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- Verification Dialog -->
    <!-- <AccountVerificationDialog :data="updateData" :action="action" />
    <AddAccountDialog :data="addData" :action="action" /> -->

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
    <v-dialog
      v-model="dialog"
      max-width="520"
      transition="dialog-bottom-transition"
    >
      <v-card rounded="xl" elevation="8">
        <!-- HEADER -->
        <v-card-title class="px-4 py-3">
          <div class="d-flex align-center justify-space-between w-100">
            <div>
              <div class="text-h6 font-weight-bold">Print SF2</div>
              <div class="text-caption text-grey">
                {{ dataEdit?.name }}
              </div>
            </div>

            <v-btn
              icon
              variant="text"
              density="comfortable"
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-divider />

        <!-- FORM -->
        <v-card-text class="px-4 pt-4">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="roomID"
                :rules="[formRules.required]"
                :items="roomList"
                item-value="id"
                item-title="room_section"
                label="Class Room"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-google-classroom"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="subjectID"
                :rules="[formRules.required]"
                :items="subjectList"
                item-value="id"
                item-title="subject_title"
                label="Subject"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-book-education"
                clearable
              />
            </v-col>

            <v-col cols="12">
              <v-autocomplete
                v-model="attendanceDate"
                :rules="[formRules.required]"
                :items="attendanceList"
                item-value="id"
                item-title="description"
                label="Attendance Date"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>

        <!-- ACTIONS -->
        <v-card-actions class="px-4 pb-4">
          <v-spacer />

          <v-btn variant="outlined" color="red" @click="dialog = false">
            Cancel
          </v-btn>

          <v-btn
            color="pink"
            variant="flat"
            prepend-icon="mdi-printer"
            :disabled="!roomID || !subjectID || !attendanceDate"
            @click="printSF2()"
          >
            Print SF2
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- view dialog -->
    <v-dialog
      v-model="SF10dialog"
      max-width="480"
      transition="dialog-bottom-transition"
    >
      <v-card rounded="xl" elevation="8">
        <!-- HEADER -->
        <v-card-title class="px-4 py-3">
          <div class="d-flex align-center justify-space-between w-100">
            <div>
              <div class="text-h6 font-weight-bold">Print SF10</div>
              <div class="text-caption text-grey">
                {{ SF10Data?.name }}
              </div>
            </div>

            <v-btn
              icon
              variant="text"
              density="comfortable"
              @click="SF10dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-divider />

        <!-- CONTENT -->
        <v-card-text class="px-4 pt-4">
          <v-autocomplete
            v-model="roomID"
            :rules="[formRules.required]"
            :items="roomList"
            item-value="id"
            item-title="room_section"
            label="Select Class Room"
            variant="outlined"
            density="comfortable"
            clearable
            prepend-inner-icon="mdi-google-classroom"
          />
        </v-card-text>

        <!-- ACTIONS -->
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="SF10dialog = false"> Cancel </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-printer"
            @click="printSF10()"
          >
            Print SF10
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
// import eventBus from "@/eventBus";
// import AccountVerificationDialog from "../../components/Dialogs/Forms/AccountVerificationDialog.vue";
// import AddAccountDialog from "../../components/Dialogs/Forms/AddAccountDialog.vue";
export default {
  components: {
    // AccountVerificationDialog,
    // AddAccountDialog,
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
        width: 100,
      },
    ],
    data: [],
    dataEdit: [],
    verified: [],
    subjectID: null,
    subjectList: [],
    roomID: null,
    roomList: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "Faculty", active: true },
    tab: 1,
    tabList: [
      { id: 1, name: "Faculty", active: true },
      { id: 2, name: "Adviser", active: false },
    ],
    totalCount: 0,
    ratingPeriodBeginMenu: false,
    attendanceDate: null,
    attendanceList: [
      { id: 1, description: "January" },
      { id: 2, description: "February" },
      { id: 3, description: "March" },
      { id: 4, description: "April" },
      { id: 5, description: "May" },
      { id: 6, description: "June" },
      { id: 7, description: "July" },
      { id: 8, description: "August" },
      { id: 9, description: "September" },
      { id: 10, description: "October" },
      { id: 11, description: "November" },
      { id: 12, description: "December" },
    ],
    SF10Data: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    SF10dialog: false,
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
  watch: {
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
      let filter = this.$store.getters.getFilterSelected;
      // console.log("Filted", filter);
      this.loading = false;
      this.axiosCall(
        "/user-details/getAllFaculty/" + this.tab + "/" + filter,
        "GET",
      ).then((res) => {
        if (res) {
          // console.log(res.data);
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },

    async getMySubjectList(id) {
      const res = await this.axiosCall(
        "/subjects/getAllSubjectSF2/" + id,
        "GET",
      );

      if (res.data && res.data.length > 0) {
        this.subjectList = res.data;

        // // Flatten if needed
        // if (Array.isArray(data[0])) {
        //   data = data[0];
        // }

        // // Format titles + mark first as active
        // data = data.map((item, index) => ({
        //   ...item,
        //   subject_title: this.toTitleCase(item.subject_title),
        //   active: index === 0, // ✅ mark first as active
        // }));
      }
    },
    getMyClassRecord(id) {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/subjects/getAllFacultySF2/" + filter + "/" + id,
        "GET",
      ).then((res) => {
        if (res.data.status != 500 && Array.isArray(res.data)) {
          res.data.forEach((element, i) => {
            res.data[i].room_section = this.toUpperCaseData(
              element.room_section || "",
            );
          });
          this.roomList = res.data;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "The faculty never set a grade level!";
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

    viewSF10(item) {
      this.SF10dialog = true;
      this.SF10Data = item;
      this.getMySubjectList(item.id);
      this.getMyClassRecord(item.id);

      // this.getMyClassRecord(item.teacherID)
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
      // console.log(item);
      this.getMySubjectList(item.id);
      this.getMyClassRecord(item.id);
    },
    printSF2() {
      let filter = this.$store.getters.getFilterSelected;
      // let format = this.formatDate(this.attendanceDate, "MM")?.toString();
      console.log(filter, this.roomID, this.subjectID);
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getSchoolForm2/" +
          filter +
          "/" +
          this.roomID +
          "/" +
          this.subjectID +
          "/" +
          this.attendanceDate +
          "/" +
          this.dataEdit.id +
          "",
        "_blank",
      );
    },
    printSF10(item) {
      let filter = this.$store.getters.getFilterSelected;
      console.log(filter, Number(item.id));
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getSchoolForm10/" +
          filter +
          "/" +
          Number(item.id) +
          "",
        "_blank",
      );
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
        },
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
