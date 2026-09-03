<template>
  <div>
    <v-row class="mx-2 mt-2" align="center">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div class="d-flex align-center ga-2">
          <v-avatar size="36" color="#fce4ec">
            <v-icon
              icon="mdi-calendar-clock-outline"
              color="#d6357e"
              size="20"
            />
          </v-avatar>
          <h2 class="text-uppercase font-weight-bold">
            {{
              classData
                ? classData.grade_level + '-' + classData.room_section
                : ''
            }}
          </h2>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          class="text-white ml-2 font-weight-bold"
          color="#d6357e"
          rounded="lg"
          variant="flat"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon start> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container border" elevation="0" rounded="lg">
      <v-data-table
        :headers="headers"
        :items="data"
        :group-by="[{ key: 'dayOrder', order: 'asc' }]"
        :items-per-page="50"
        :search="search"
        @update:options="options"
        :loading="loading"
        loading-text="Loading schedule..."
        density="comfortable"
        class="schedule-table"
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap">
            <v-btn
              size="small"
              color="#d6357e"
              class="mx-1"
              variant="outlined"
              rounded="lg"
              @click="editItem(item)"
            >
              <v-icon size="18">mdi-pencil-outline</v-icon>
            </v-btn>
          </div>
        </template>

        <template
          v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
        >
          <tr class="group-header-row">
            <td
              :colspan="columns.length"
              class="cursor-pointer"
              v-ripple
              @click="toggleGroup(item)"
            >
              <div class="d-flex align-center">
                <v-btn
                  :icon="isGroupOpen(item) ? '$expand' : '$next'"
                  color="#d6357e"
                  density="comfortable"
                  size="small"
                  variant="outlined"
                ></v-btn>

                <v-icon
                  icon="mdi-calendar-outline"
                  size="16"
                  class="ms-3 me-1"
                  color="#d6357e"
                />
                <span class="ms-1 font-weight-medium"
                  >Days:
                  {{
                    item.value == 1
                      ? 'Monday'
                      : item.value == 2
                      ? 'Tuesday'
                      : item.value == 3
                      ? 'Wednesday'
                      : item.value == 4
                      ? ' Thursday'
                      : 'Friday'
                  }}</span
                >
              </div>
            </td>
          </tr>
        </template>

        <template #no-data>
          <div class="py-8 text-center text-medium-emphasis">
            <v-icon icon="mdi-calendar-remove-outline" size="32" class="mb-2" />
            <div>No schedule found.</div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <ClassroomProgramDialog
      :data="sectionData"
      :action="action"
      :grade="classData ? classData.grade_level : null"
      :section="classData ? classData.id : null"
      :filter="filter"
    />
    <AddFacultyLoadingDialog
      :data="addFacultyLoadData"
      :action="action"
      :grade="classData ? classData.grade_level : null"
      :section="classData ? classData.id : null"
      :filter="filter"
    />

    <v-dialog v-model="confirmDialog" persistent max-width="380">
      <v-card color="white" rounded="lg">
        <div class="pa-5">
          <div class="d-flex align-center ga-2 mb-2">
            <v-icon icon="mdi-alert-circle-outline" color="error" size="26" />
            <span class="text-h6 font-weight-bold">Warning</span>
          </div>
          <div class="text-body-2 text-medium-emphasis">
            <b>This action is irreversible.</b> Are you sure you want to
            proceed?
          </div>
        </div>

        <v-card-actions class="px-5 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            variant="outlined"
            rounded="lg"
            @click="confirmDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="#d6357e"
            class="text-white"
            variant="flat"
            rounded="lg"
            @click="deleteItem()"
          >
            Confirm Delete
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
import eventBus from '@/eventBus';
import ClassroomProgramDialog from '../../components/Dialogs/Forms/ClassroomProgramDialog.vue';
import AddFacultyLoadingDialog from '../../components/Dialogs/Forms/AddFacultyLoadingDialog.vue';
export default {
  components: {
    ClassroomProgramDialog,
    AddFacultyLoadingDialog,
  },
  data: () => ({
    search: '',
    addFacultyLoadData: null,
    dayOrder: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    headers: [
      {
        align: 'start',
        key: 'day',
        width: 250,
        sortable: false,
      },
      {
        title: 'Time',
        key: 'time',
        width: 200,
        sortable: false,
      },
      {
        title: 'Faculty Name',
        key: 'name',
        width: 200,
        sortable: false,
      },
      {
        title: 'Subject',
        key: 'subject_title',
        width: 200,
        sortable: false,
      },
      {
        title: 'Action',
        key: 'action',
        width: 200,
        sortable: false,
      },
    ],
    data: [],
    verified: [],
    perPageChoices: [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: '20', value: 20 },
      { text: '50', value: 50 },
      { text: '100', value: 100 },
      { text: '250', value: 250 },
      { text: '500', value: 500 },
    ],
    grade: null,
    activeTab: { id: 1, name: 'Grade 7', active: true },
    tab: 1,
    tabList: [
      { id: 1, name: 'Grade 7', active: true },
      { id: 2, name: 'Grade 8', active: false },
      { id: 3, name: 'Grade 9', active: false },
      { id: 4, name: 'Grade 10', active: false },
      { id: 5, name: 'Grade 11', active: false },
      { id: 6, name: 'Grade 12', active: false },
    ],
    sectionData: null,
    filter: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    formdata: [],
    classData: null,
    work_dates_menu: false,
    confirmDialog: false,
    fadeAwayMessage: {
      show: false,
      type: 'success',
      header: 'Successfully Deleted!',
      message: '',
      top: 10,
    },
  }),
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },

  mounted() {
    this.initialize();
    eventBus.on('closeAddScheduleDialog', () => {
      this.getClassroom(this.section);
    });
  },
  beforeUnmount() {
    eventBus.off('closeAddScheduleDialog');
  },

  watch: {
    section(category) {
      this.getClassroom(category);
    },
    options: {
      handler() {
        this.initialize();
        this.getClassroom(this.section);
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.getClassroom(this.section);
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getMyAdvisorySection();
    },

    getMyAdvisorySection() {
      this.axiosCall(
        '/rooms-section/getMyAdvisorySection/' + this.$store.state.user.id,
        'GET',
      ).then((res) => {
        if (res) {
          this.classData = res.data;
          this.getClassroom();
        } else {
          alert('no advisory');
        }
      });
    },

    getClassroom() {
      this.loading = true;
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/enroll-student/getClassProgramm/' +
          this.classData.grade_level +
          '/' +
          this.classData.id +
          '/' +
          filter,
        'GET',
      ).then((res) => {
        if (res) {
          this.data = res.data;
          const dayOrderMap = {
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
          };

          this.data = res.data
            .map((item) => ({
              ...item,
              dayOrder: dayOrderMap[item.day] ?? 99,
            }))
            .sort((a, b) => {
              if (a.dayOrder !== b.dayOrder) {
                return a.dayOrder - b.dayOrder;
              }
              return 0;
            });
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });
    },
    add() {
      let filter = this.$store.getters.getFilterSelected;
      this.addFacultyLoadData = [{ id: null }];
      this.action = 'Add';
      this.filter = filter;
    },
    editItem(item) {
      let filter = this.$store.getters.getFilterSelected;
      this.sectionData = item;
      this.action = 'Update';
      this.filter = filter;
    },

    viewItem(item) {
      this.sectionData = item;
      this.action = 'View';
    },

    deleteItem() {
      this.axiosCall(
        '/enroll-student/deleteAvailabilitySchedule/' + this.deleteData.availId,
        'DELETE',
      ).then((res) => {
        if (res.data.status == 200) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
          this.confirmDialog = false;
          this.initialize();
        } else if (res.data.status == 400) {
          this.confirmDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
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
<style scoped>
.v-card.border {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.schedule-table :deep(thead th) {
  font-weight: 600 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  opacity: 0.6;
}
.group-header-row {
  background: #f5f6fa;
}
.group-header-row td {
  padding: 8px 12px !important;
}
</style>
