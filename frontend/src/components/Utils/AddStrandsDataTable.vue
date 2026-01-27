<template>
  <div>
    <v-row class="mx-2 mt-2">
      <v-col cols="12" md="8" class="flex-items"> </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between">
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
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="1">
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        @update:options="options"
        :loading="loading"
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap" style="padding: 4px">
            <v-btn
              x-small
              color="#dc0b70"
              class="my-2 mx-2"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Update
            </v-btn>
            <v-btn
              x-small
              color="red"
              class="my-2"
              outlined
              @click="confirmDelete(item)"
            >
              <v-icon size="14">mdi-delete-off</v-icon>Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <AddStrandDialog :data="coreTimeData" :action="action" :grade="gradeName" />

    <v-dialog v-model="confirmDialog" persistent max-width="350">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to delete this information?<br /><br />
              Please note that
              <b>this action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
                    Are you sure you want to proceed?
                  </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn color="#147452" class="white--text" @click="deleteItem()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog fullscreen scrollable persistent v-model="JobPostPrint">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Type of Report</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="JobPostPrint = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="PrintFormref">
            <v-row class="mt-4">
              <v-col cols="1">
                <v-autocomplete
                  label="Year"
                  v-model="selectedYear"
                  :rules="[formRules.required]"
                  dense
                  class="rounded-lg"
                  color="#93CB5B"
                  :items="yearList"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-card-title> </v-card-title>
            <!-- <v-data-table :headers="headers3" :items="printData">
                    <template v-slot:[`item.birth`]="{ item }">
                      {{ formatDate(item.birth) }}
                    </template>
                  </v-data-table> -->
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="JobPostPrint = false">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
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
import AddStrandDialog from "../../components/Dialogs/Forms/AddStrandDialog.vue";
export default {
  components: {
    // CoreTimeDesignationDialog: () =>
    //   import("../../components/Dialogs/Forms/CoreTimeDesignationDialog.vue"),
    AddStrandDialog,
  },
  data: () => ({
    search: "",
    taggingData: null,
    fullname: null,
    applicantData: null,
    headers: [
      {
        title: "Strand Name",
        value: "strand_name",
        align: "start",
        valign: "start",
        sortable: false,
      },
      {
        title: "Tracks Name",
        value: "tracks_name",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        title: "Action",
        value: "action",
        align: "end",
        valign: "end",
        sortable: false,
      },
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
    activeTab: { id: 1, name: "Strand" },
    tab: 1,
    tabList: [{ id: 1, name: "Strand" }],
    coreTimeData: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    formdata: [],
    work_dates_menu: false,
    confirmDialog: false,
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
    this.loadYear();
    this.initialize();
    // eventBus.on("closeMyJobApplicationDialog", () => {
    //   this.initialize();
    // });
    eventBus.on("closeAddStrandDialog", () => {
      this.initialize();
    });

    // eventBus.on("closeMyDesignationDialog", () => {
    //   this.initialize();
    // });
  },

  beforeUnmount() {
    // eventBus.off("closeMyJobApplicationDialog");
    eventBus.off("closeAddStrandDialog");

    // eventBus.off("closeMyDesignationDialog");
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

    loadYear() {
      let curYear;
      var d = new Date();
      curYear = d.getFullYear();
      for (let i = curYear; i >= 2020; i--) {
        this.yearList.push(i);
      }
    },

    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.loading = true;
      this.axiosCall("/rooms-section/AllStrand/Data/strand", "GET").then(
        (res) => {
          if (res) {
            console.log("All Strand", res.data);
            this.data = res.data;
            this.loading = false;
          }
        },
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
    viewApplicant(item) {
      this.applicantData = item;
      this.action = 1;
    },
    viewHiredApplicant(item) {
      this.applicantData = item;
      this.action = 2;
    },
    viewItem(item) {
      if (this.tab == 1) {
        this.coreTimeData = item;
        this.action = "View";
      } else {
        this.designationData = item;
        this.action = "View";
      }
    },

    deleteItem() {
      this.axiosCall(
        "/rooms-section/archieveStrand/" + this.deleteData.id,
        "PATCH",
        {},
      ).then((res) => {
        if (res.data.status == 201) {
          // this.initialize();
          // this.confirmDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully updated!!";
          location.reload();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    confirmDelete(item) {
      this.confirmDialog = true;
      this.deleteData = item;
    },
  },
};
</script>
