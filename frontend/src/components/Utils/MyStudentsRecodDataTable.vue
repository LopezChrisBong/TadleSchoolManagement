<template>
  <v-container fluid class="pa-6 records-bg">
    <v-card class="pa-4 mb-4 border" elevation="0" rounded="lg">
      <v-row align="center" dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            color="primary"
          />
        </v-col>

        <v-col cols="12" md="8" style="overflow: auto">
          <v-tabs
            v-model="tab"
            color="pink-lighten-1"
            class="subject-tabs"
            show-arrows
          >
            <v-tab
              v-for="item in tabList"
              :key="item.id"
              :value="item.id"
              rounded="lg"
              class="mx-1"
              @click="changeTab(item)"
            >
              {{ item.subject_title }}
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="border" elevation="0" rounded="lg">
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        @update:options="options"
        :loading="loading"
        loading-text="Loading records..."
        density="comfortable"
        class="records-table"
        @pagination="pagination"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex justify-center ga-1">
            <v-tooltip text="Report" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-alert-octagon-outline"
                  size="small"
                  variant="text"
                  color="blue"
                  @click="reportItem(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Attendance" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-calendar-check-outline"
                  size="small"
                  variant="text"
                  color="pink"
                  @click="editItem(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Class Records" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-notebook-outline"
                  size="small"
                  variant="text"
                  color="green"
                  @click="viewItem(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>

        <template #no-data>
          <div class="py-8 text-center text-medium-emphasis">
            <v-icon icon="mdi-notebook-off-outline" size="32" class="mb-2" />
            <div>No class records found.</div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <StudentAttendanceDialog :data="attendanceData" :action="action" />

    <ViewStudentClassRecordFialog :data="viewData" :action="action" />
    <StudentDisciplinaryDialog :data="reportData" :action="action" />

    <v-dialog v-model="dialogConfirmDelete" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center ga-2 text-h6">
          <v-icon icon="mdi-alert-circle-outline" color="error" />
          Confirmation
        </v-card-title>

        <v-card-text> Are you sure you want to delete this item? </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogConfirmDelete = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
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
  </v-container>
</template>
<script>
import eventBus from '@/eventBus';
import StudentDisciplinaryDialog from '../../components/Dialogs/Forms/StudentDisciplinaryDialog.vue';
import StudentAttendanceDialog from '../../components/Dialogs/Forms/StudentAttendanceDialog.vue';
import ViewStudentClassRecordFialog from '../Dialogs/Views/ViewStudentClassRecordDialog.vue';
export default {
  components: {
    StudentDisciplinaryDialog,
    StudentAttendanceDialog,
    ViewStudentClassRecordFialog,
  },
  data: () => ({
    search: '',
    reportData: null,
    headers: [
      { title: 'Class Name', value: 'room_section', align: 'start' },
      {
        title: 'Actions',
        value: 'actions',
        align: 'center',
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
      type: 'success',
      header: 'Successfully Deleted!',
      message: '',
      top: 10,
    },
  }),

  mounted() {
    this.initialize();
    eventBus.on('closeStudentAttendanceDialog', () => {
      this.initialize();
    });
    eventBus.on('closeStudentClassRecordDialog', () => {
      this.initialize();
    });
    eventBus.on('closeStudentReportDialog', () => {
      this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off('closeStudentAttendanceDialog');
    eventBus.off('closeStudentClassRecordDialog');
    eventBus.off('closeStudentReportDialog');
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
      const res = await this.axiosCall('/subjects/getMySubjects', 'GET');

      if (res.data && res.data.length > 0) {
        let data = res.data;

        if (Array.isArray(data[0])) {
          data = data[0];
        }

        data = data.map((item) => ({
          ...item,
          subject_title: this.toTitleCase(item.subject_title),
        }));

        this.tabList = data;

        if (!this.tab) {
          this.tab = data[0].id;
          this.activeTab = data[0];
        } else {
          const found = data.find((d) => d.id === this.tab);
          if (found) {
            this.activeTab = found;
          }
        }
      }
    },
    getMyClassRecord() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/subjects/getMyClassRecord/' + filter + '/' + this.tab,
        'GET',
      ).then((res) => {
        if (res.data.status != 500 && Array.isArray(res.data)) {
          res.data.forEach((element, i) => {
            res.data[i].room_section = this.toUpperCaseData(
              element.room_section || '',
            );
          });
          this.data = res.data;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message =
            'Please set your prefered subject in profile tab!';
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
      this.action = 'Verify';
    },

    viewItem(item) {
      console.log(item);
      this.viewData = item;
      this.action = 'View';
    },
    reportItem(item) {
      this.reportData = item;
      this.action = 'View';
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

<style scoped>
.records-bg {
  min-height: 100vh;
}

.v-card.border {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.subject-tabs :deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
}

.subject-tabs :deep(.v-tab--selected) {
  background: #f8bbd0;
  color: #ad1457 !important;
}

.records-table :deep(thead th) {
  font-weight: 600 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  opacity: 0.6;
}
</style>
