<template>
  <div>
    <v-row class="mx-2 mt-2">
      <v-col cols="12" class="d-flex justify-space-between">
        <h2 style="text-transform: uppercase">
          {{
            classData
              ? classData.grade_level + '-' + classData.room_section
              : ''
          }}
        </h2>
        <v-spacer></v-spacer>
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
        :group-by="[{ key: 'dayOrder', order: 'asc' }]"
        :items-per-page="50"
        :search="search"
        @update:options="options"
        :loading="loading"
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap">
            <v-btn
              x-small
              color="#dc0b70"
              class="mx-1"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="20">mdi-pencil-outline</v-icon>
            </v-btn>
            <!-- <v-btn
              x-small
              color="#C62828"
              class="white--text mx-1"
              @click="confirmDelete(item)"
            >
              <v-icon size="14">mdi-trash-can-outline</v-icon>
            </v-btn> -->
          </div>
        </template>

        <template
          v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
        >
          <tr>
            <td
              :colspan="columns.length"
              class="cursor-pointer"
              v-ripple
              @click="toggleGroup(item)"
            >
              <div class="d-flex align-center">
                <v-btn
                  :icon="isGroupOpen(item) ? '$expand' : '$next'"
                  color="medium-emphasis"
                  density="comfortable"
                  size="small"
                  variant="outlined"
                ></v-btn>

                <span class="ms-4"
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

    <v-dialog v-model="confirmDialog" persistent max-width="350">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <b>This action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
            Are you sure you want to proceed?
          </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close to Cancel
          </v-btn>
          <v-btn color="green" class="white--text" @click="deleteItem()">
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
    // eventBus.on("closeMyDesignationDialog", () => {
    //   this.initialize();
    // });
  },
  beforeUnmount() {
    eventBus.off('closeAddScheduleDialog');
    // eventBus.off("closeMyDesignationDialog");
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
          console.log(oldData, newData);
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
          console.log('Classroom', this.classData.room_section);
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
