<template>
  <v-container fluid>
    <!-- Header with Tabs & Search -->
    <v-row class="align-center mb-4 mt-2 flex-items">
      <v-col cols="12" md="6" class="flex-items">
        <v-tabs v-model="activeTab" show-arrows>
          <v-tab
            v-for="tab in tabList"
            :key="tab.id"
            :value="tab.id"
            @click="changeTab(tab)"
            :class="[
              'pa-3 mx-1 transition-all font-weight-medium',
              tab.active ? 'bg-pink-lighten-1 text-white' : 'bg-grey-lighten-4',
            ]"
            rounded="lg"
            >{{ tab.name }}</v-tab
          ></v-tabs
        >
      </v-col>

      <v-col cols="12" md="4" offset-md="2" class="d-flex">
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
          prepend-icon="mdi-printer"
          rounded="lg"
          variant="flat"
          v-if="
            $store.state.user.user.assignedModuleID !== 21 &&
            $store.state.user.user.assignedModuleID !== 2
          "
          :color="$vuetify.theme.themes.light.submitBtns"
          text="Print"
          @click="printRecords()"
        ></v-btn>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card class="elevation-2 rounded-lg">
      <v-data-table
        :items="data"
        :class="isMobile"
        :headers="headers"
        :search="search"
        :items-per-page="10"
        :loading="loading"
        loading-text="Loading reports..."
        class="rounded-lg report-table"
      >
        <template v-slot:[`item.name`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="32" color="primary" variant="tonal" class="mr-3">
              <span class="text-caption font-weight-bold">
                {{ initials(item.name) }}
              </span>
            </v-avatar>
            <span class="font-weight-medium">{{ item.name }}</span>
          </div>
        </template>

        <template v-slot:[`item.report_type`]="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="item.report_type == 1 ? 'blue' : 'deep-orange'"
          >
            {{ item.report_type == 1 ? 'Academic' : 'Disciplinary' }}
          </v-chip>
        </template>

        <template v-slot:[`item.tagged`]="{ item }">
          <div v-if="item.tagged && item.tagged.length">
            <v-chip
              v-for="tag in item.tagged.slice(0, 2)"
              :key="tag.id"
              size="x-small"
              variant="tonal"
              class="mr-1 mb-1"
            >
              {{ tag.name }}
            </v-chip>
            <v-chip
              v-if="item.tagged.length > 2"
              size="x-small"
              variant="text"
              color="grey"
            >
              +{{ item.tagged.length - 2 }} more
            </v-chip>
          </div>
          <span v-else class="text-caption text-medium-emphasis">—</span>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <span class="text-body-2">{{ formatDate(item.created_at) }}</span>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            @click="viewItem(item)"
            rounded="lg"
          >
            <v-icon start size="18">mdi-eye-outline</v-icon>
            View
          </v-btn>
        </template>

        <template #no-data>
          <v-alert type="info" variant="tonal" border="start" class="ma-4">
            No data found.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Report Detail Dialog -->
    <v-dialog v-model="reportDialog" max-width="640" eager scrollable>
      <v-card rounded="lg">
        <v-card-title
          class="d-flex align-center px-5 py-4"
          style="background: rgb(var(--v-theme-primary)); color: #fff"
        >
          <v-icon start color="white">mdi-account-alert</v-icon>
          <span
            v-if="studentReportData"
            class="text-subtitle-1 font-weight-bold"
          >
            {{ studentReportData.name }}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            size="small"
            @click="reportDialog = false"
          >
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-5" style="max-height: 65vh">
          <v-row dense>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Reported By</div>
              <div class="text-body-2 font-weight-medium">
                {{ studentReportData.teacher_name }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Date</div>
              <div class="text-body-2 font-weight-medium">
                {{ formatDate(studentReportData.created_at) }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Subject</div>
              <div class="text-body-2 font-weight-medium">
                {{ studentReportData.subject_title }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">Grade Level</div>
              <div class="text-body-2 font-weight-medium">
                {{ studentReportData.grade_level }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">
                Date of Incident
              </div>
              <div class="text-body-2 font-weight-medium">
                {{
                  studentReportData.report_date
                    ? formatDate(studentReportData.report_date)
                    : '—'
                }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">
                Time of Incident
              </div>
              <div class="text-body-2 font-weight-medium">
                {{
                  studentReportData.report_time
                    ? formatTime(studentReportData.report_time)
                    : '—'
                }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-autocomplete
            v-model="studentReportData.report_type"
            variant="outlined"
            density="comfortable"
            class="rounded-lg"
            readonly
            item-title="description"
            item-value="id"
            label="Report Type"
            color="primary"
            :items="[
              { id: 1, description: 'Academic Concern' },
              { id: 2, description: 'Disciplinary Concern' },
            ]"
          >
          </v-autocomplete>

          <v-textarea
            v-model="studentReportData.report_description"
            label="Report Description"
            rows="3"
            color="primary"
            variant="outlined"
            readonly
            auto-grow
            class="mt-2"
          ></v-textarea>

          <div class="text-caption text-medium-emphasis mb-1 mt-2">
            Tagged Students
          </div>
          <v-sheet border rounded="lg" class="pa-3" color="grey-lighten-5">
            <template
              v-if="studentReportData.tagged && studentReportData.tagged.length"
            >
              <v-chip
                v-for="tag in studentReportData.tagged"
                :key="tag.id"
                size="small"
                class="mr-2 mb-2"
                prepend-icon="mdi-account"
                variant="tonal"
              >
                {{ tag.name }}
              </v-chip>
            </template>
            <span v-else class="text-body-2 text-medium-emphasis">
              No tagged students.
            </span>
          </v-sheet>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-3">
          <v-btn
            color="teal-darken-3"
            variant="outlined"
            rounded="lg"
            @click="reportDialog = false"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="tab == 1"
            color="green"
            class="text-white mr-2"
            variant="flat"
            rounded="lg"
            @click="submitReport(2)"
          >
            <v-icon start size="18">mdi-check-circle-outline</v-icon>
            Resolve
          </v-btn>
          <v-btn
            v-if="tab == 1"
            :color="$vuetify.theme.themes.light.submitBtns"
            class="text-white"
            variant="flat"
            rounded="lg"
            @click="submitReport(1)"
          >
            <v-icon start size="18">mdi-send-outline</v-icon>
            Submit
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
    search: '',
    dialog: false,
    userRoleID: null,
    headers: [
      { title: 'Name', value: 'name', align: 'start' },
      { title: 'Reported BY:', value: 'teacher_name', align: 'center' },
      { title: 'Subject', value: 'subject_title', align: 'center' },
      { title: 'Grade Level', value: 'grade_level', align: 'center' },
      { title: 'Type', value: 'report_type', align: 'center' },
      { title: 'Date', value: 'created_at', align: 'center' },
      { title: 'Tagged Student', value: 'tagged', align: 'center' },
      {
        title: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false,
        width: 100,
      },
    ],
    studentReportData: [],
    data: [],
    userId: null,
    activeTab: { id: 1, name: 'Reports', active: true },
    tab: 1,
    tabList: [],
    loading: false,
    reportDialog: false,
    options: {},
    action: null,
    filter: null,
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
  },
  beforeUnmount() {},
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
      this.loading = false;

      let raw = this.$store.state.user.user.subModules;

      let subModules;

      try {
        subModules = JSON.parse(raw);
      } catch (e) {
        subModules = [];
      }
      if (!Array.isArray(subModules)) {
        subModules = [subModules];
      }
      let assingedModules = localStorage.getItem('AssignedModID');
      if (assingedModules == 2 || assingedModules == 21) {
        this.tabList = [
          { id: 1, name: 'Reports', active: true },
          { id: 2, name: 'Submitted', active: false },
          { id: 3, name: 'Resolved', active: false },
        ];
      } else {
        this.tabList = [
          { id: 1, name: 'Adviser', active: true },
          { id: 2, name: 'Parent', active: false },
          { id: 3, name: 'Resolved', active: false },
        ];
      }

      if (assingedModules == 2 || assingedModules == 21) {
        this.axiosCall(
          '/parent-records/getDisciplinaryReport/' +
            this.filter +
            '/' +
            this.tab +
            '/' +
            this.userId,
          'GET',
        ).then((res) => {
          if (res) {
            let data = Array.isArray(res.data) ? res.data : [];
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;

            this.loading = false;
          }
        });
      } else if (
        subModules.includes(23) ||
        assingedModules == 23 ||
        subModules.includes(27) ||
        assingedModules == 27
      ) {
        this.axiosCall(
          '/parent-records/getPrefectReport/' + this.filter + '/' + this.tab,
          'GET',
        ).then((res) => {
          if (res) {
            let data = Array.isArray(res.data) ? res.data : [];
            let newArr = [];
            let junior = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
            let senior = ['Grade 11', 'Grade 12'];
            data.forEach((element) => {
              element.name = this.toTitleCase(element.name);

              if (subModules.includes(23) || assingedModules == 23) {
                if (senior.includes(element.grade_level)) {
                  newArr.push(element);
                }
              } else if (subModules.includes(27) || assingedModules == 27) {
                if (junior.includes(element.grade_level)) {
                  newArr.push(element);
                }
              }
            });
            this.data = newArr;
            this.loading = false;
          }
        });
      }
    },
    add() {},
    viewItem(item) {
      this.studentReportData = item;
      this.reportDialog = true;
    },
    initials(name) {
      if (!name) return '';
      return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('');
    },
    submitReport(num) {
      let raw = this.$store.state.user.user.subModules;

      let subModules;

      try {
        subModules = JSON.parse(raw);
      } catch (e) {
        subModules = [];
      }
      if (!Array.isArray(subModules)) {
        subModules = [subModules];
      }
      let assingedModules = this.$store.state.user.user.assignedModuleID;
      let data = [];
      if (num == 1) {
        data = {
          status: assingedModules == 2 || assingedModules == 21 ? 1 : 2,
        };
      } else {
        data = {
          status: assingedModules == 2 || assingedModules == 21 ? 3 : 4,
        };
      }

      this.axiosCall(
        '/parent-records/updateStudentReport/' +
          this.studentReportData.reportID,
        'PATCH',
        data,
      ).then((res) => {
        if (res.data.status == 201) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.header = 'Successfully Updated';
          this.reportDialog = false;
          this.initialize();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
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

    // confirmDelete() {
    //   this.axiosCall('/user-details/' + this.SF10Data.id, 'DELETE').then(
    //     (res) => {
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = 'success';
    //       this.fadeAwayMessage.header = 'System Message';
    //       this.fadeAwayMessage.message = 'Account deleted successfully!';
    //       this.initialize();
    //     },
    //   );
    // },
    printRecords() {},
  },
};
</script>
<style scoped>
.report-table :deep(thead) {
  background-color: rgb(var(--v-theme-primary), 0.06);
}
.report-table :deep(th) {
  font-weight: 700 !important;
  font-size: 0.78rem !important;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.report-table :deep(tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
