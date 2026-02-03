<template>
  <div>
    <v-row class="mx-2 mt-2">
      <v-col cols="12" md="12">
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
      <v-spacer></v-spacer>
      <v-col cols="12" md="12" class="flex-items" style="overflow: auto">
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
          >{{ tab.subject_title }}</v-tab
        >
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
        @pagination="pagination"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-btn
              class="mx-2"
              x-small
              color="blue"
              outlined
              @click="reportItem(item)"
            >
              <v-icon size="18">mdi-eye</v-icon>
              Report
            </v-btn>
            <v-btn
              class="mx-2"
              x-small
              color="#dc0b70"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="18">mdi-pencil</v-icon>
              Atendance
            </v-btn>
            <v-btn
              class="mx-2"
              x-small
              color="green"
              outlined
              @click="viewItem(item)"
            >
              <v-icon size="18">mdi-eye</v-icon>
              Class Records
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <StudentAttendanceDialog :data="attendanceData" :action="action" />

    <ViewStudentClassRecordFialog :data="viewData" :action="action" />
    <StudentDisciplinaryDialog :data="reportData" :action="action" />

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
import StudentDisciplinaryDialog from "../../components/Dialogs/Forms/StudentDisciplinaryDialog.vue";
import StudentAttendanceDialog from "../../components/Dialogs/Forms/StudentAttendanceDialog.vue";
import ViewStudentClassRecordFialog from "../Dialogs/Views/ViewStudentClassRecordDialog.vue";
export default {
  components: {
    StudentDisciplinaryDialog,
    StudentAttendanceDialog,
    ViewStudentClassRecordFialog,
  },
  data: () => ({
    search: "",
    reportData: null,
    headers: [
      { title: "Class Name", value: "room_section", align: "start" },
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

    activeTab: {
      // id: 1, name: "For Verification", active: true
    },
    tab: null,
    tabList: [
      //   { id: 1, name: "For Verification", active: true },
      //   { id: 2, name: "Enrolled", active: false },
    ],
    totalCount: 0,
    deleteData: null,
    attendanceData: null,
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
    eventBus.on("closeStudentAttendanceDialog", () => {
      this.initialize();
    });
    eventBus.on("closeStudentClassRecordDialog", () => {
      this.initialize();
    });
    eventBus.on("closeStudentReportDialog", () => {
      this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off("closeStudentAttendanceDialog");
    eventBus.off("closeStudentClassRecordDialog");
    eventBus.off("closeStudentReportDialog");
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
          // this.getAlreadyGenerate();
        }
      },
      deep: true,
    },
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    async initialize() {
      await this.getMySubjectList(); // Wait for tab to be set
      await this.getMyClassRecord(); // Now it's safe to run
    },
    async getMySubjectList() {
      const res = await this.axiosCall("/subjects/getMySubjects", "GET");

      if (res.data && res.data.length > 0) {
        let data = res.data;

        // Flatten if needed
        if (Array.isArray(data[0])) {
          data = data[0];
        }

        // Format titles + mark first as active
        data = data.map((item, index) => ({
          ...item,
          subject_title: this.toTitleCase(item.subject_title),
          active: index === 0, //  mark first as active
        }));
        // console.log(data);
        //  Set first tab values
        this.tab = data[0].id;
        this.activeTab = data[0];
        this.tabList = data;
      }
    },
    getMyClassRecord() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/subjects/getMyClassRecord/" + filter + "/" + this.tab,
        "GET",
      ).then((res) => {
        if (res.data.status != 500 && Array.isArray(res.data)) {
          res.data.forEach((element, i) => {
            res.data[i].room_section = this.toUpperCaseData(
              element.room_section || "",
            );
          });
          this.data = res.data;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Please set your prefered subject in profile tab!";
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.getMyClassRecord();
      // Optional: mark this tab active
      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });

      //Only reload class record for this tab
    },
    // deleteItem(item) {
    //   this.dialogConfirmDelete = true;
    //   this.deleteData = item;
    // },
    editItem(item) {
      this.attendanceData = item;
      this.action = "Verify";
    },

    viewItem(item) {
      console.log(item);
      this.viewData = item;
      this.action = "View";
    },
    reportItem(item) {
      this.reportData = item;
      this.action = "View";
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
