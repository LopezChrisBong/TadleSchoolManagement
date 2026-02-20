<template>
  <div>
    <v-dialog v-model="dialog" fullscreen eager scrollable max-width="600px">
      <v-form ref="StudentReport" @submit.prevent>
        <v-card>
          <v-card-title dark class="d-flex dialog-header pt-5 pb-5 pl-6">
            <span v-if="data" style="text-transform: uppercase">
              {{ data.subject_title }} {{ data.grade_level }}
              {{ data.room_section }}</span
            >
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              @click="closeD()"
            >
            </v-btn>
          </v-card-title>

          <v-card-text
            style="max-height: 700px"
            class="my-4 dt-container"
            elevation="1"
            outlined
          >
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
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
                <v-col cols="12">
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-red-lighten-2 text-caption">
                      {{ messageSaved }}</span
                    >
                    <!-- <v-btn
                      class="ma-2"
                      x-small
                      color="#dc0b70"
                      outlined
                      @click="viewReportTable()"
                    >
                      <v-icon size="18" class="mx-2">mdi-printer-eye</v-icon>
                      View Reports
                    </v-btn> -->
                  </div>

                  <v-data-table
                    :headers="headers"
                    :items="studentDataList"
                    :search="search"
                    @update:options="options"
                    :loading="loading"
                  >
                    <template v-slot:[`item.actions`]="{ item }">
                      <div class="d-flex">
                        <v-btn
                          class="mx-2"
                          x-small
                          color="blue"
                          outlined
                          @click="addReport(item)"
                        >
                          <v-icon size="18" class="mx-1"
                            >mdi-alert-octagon</v-icon
                          >
                          Report
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              class="mx-2"
              variant="outlined"
              x-small
              color="red"
              @click="closeD()"
            >
              <v-icon>mdi-close-circle</v-icon>
              Close
            </v-btn>
            <v-btn
              v-if="update"
              :color="$vuetify.theme.themes.light.submitBtns"
              variant="flat"
              class="white--text"
              @click="updateAttendance()"
            >
              <v-icon>mdi-check-circle</v-icon>Update
            </v-btn>
            <v-btn
              v-if="edit"
              :color="$vuetify.theme.themes.light.submitBtns"
              variant="flat"
              class="white--text"
              @click="saveAttendance()"
            >
              <v-icon>mdi-check-circle</v-icon>Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- <v-dialog v-model="dialogConfirmSave" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Confirmation </v-card-title>

        <v-card-text style="font-size: 17px">
          Are you sure you want to save attendance? if yes click Confirm!
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-3"
            outlined
            @click="dialogConfirmSave = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="submitReport()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <v-dialog v-model="reportDialog" max-width="600" eager scrollable>
      <v-card>
        <v-card-title class="d-flex dialog-header align-center">
          <span v-if="studentData">
            Report Student {{ studentData.name }} for Disciplinary</span
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
                v-model="report_type"
                :rules="[formRules.required]"
                variant="outlined"
                density="comfortable"
                class="rounded-lg"
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
                v-model="report_description"
                label="Report Description"
                row-height="30"
                rows="3"
                variant="outlined"
                auto-grow
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="tagStudents"
                :rules="[formRules.required]"
                variant="outlined"
                density="comfortable"
                class="rounded-lg"
                multiple
                item-title="name"
                item-value="id"
                label="Report Type"
                color="pink"
                :items="filteredStudentList"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-3"
            variant="outlined"
            @click="reportDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            variant="flat"
            class="white--text"
            @click="submitReport()"
          >
            Submit
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
export default {
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      studentDataList: [],
      tagStudents: [],
      edit: true,
      dialog: false,
      messageSaved: '',
      report_type: 1,
      report_description: null,
      studentData: null,
      dialogConfirmSave: false,
      reportDialog: false,
      Option: {},
      filter: null,
      search: '',
      currentMonth: new Date(),
      loading: false,
      update: false,
      userRoleID: null,
      tableItems: [],
      headers: [
        { title: 'Student Name', value: 'name', align: 'start' },
        {
          title: 'Action',
          value: 'actions',
          align: 'end',
          sortable: false,
          width: 50,
        },
      ],
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Added!',
        message: '',
        top: 10,
      },
    };
  },
  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },

    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        if (data.id) {
          console.log('Recieve Data', data);
        }
      },
      deep: true,
    },
  },
  computed: {
    filteredStudentList() {
      if (!this.studentData?.id) return this.studentDataList;

      return this.studentDataList.filter(
        (student) => student.id !== this.studentData.id,
      );
    },
  },

  methods: {
    initialize() {
      this.filter = this.$store.getters.getFilterSelected;
      this.userRoleID = this.$store.state.user.id;
      this.getTaggedStudent();
    },
    getTaggedStudent() {
      this.axiosCall(
        '/rooms-section/getMyStudentAttendance/' +
          this.userRoleID +
          '/' +
          this.filter +
          '/' +
          this.data.roomId,
        'GET',
      ).then((res) => {
        // console.log("Data Students", res.data);
        if (res.data) {
          this.studentDataList = res.data;
        }
      });
    },
    addReport(item) {
      //   console.log(item);
      this.studentData = item;
      this.reportDialog = true;
    },

    submitReport() {
      let userId = this.$store.state.user.id;
      let data = {
        studentID: this.studentData.id,
        school_yearID: this.filter,
        subjectID: this.data.subjectId,
        teacherID: userId,
        report_type: this.report_type,
        report_description: this.report_description,
        grade_level: this.data.grade_level,
        roomID: this.data.roomId,
        tag_students: JSON.stringify(this.tagStudents),
      };
      //   console.log(data);
      this.axiosCall('/parent-records/studentReport', 'POST', data).then(
        (res) => {
          //   console.log(res);
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message =
              'Student ' +
              this.studentData.name +
              ' successfully reported to adviser!';
            // this.attendanceDate = null;
            this.reportDialog = false;
            this.closeD();
            this.dialogConfirmSave = false;
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'error';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
          }
        },
      );
    },

    viewReportTable() {
      console.log(
        this.data.subjectId,
        this.data.roomId,
        this.data.grade_level,
        this.report_type,
        this.report_description,
        this.filter,
        this.studentData.id,
      );
    },

    closeD() {
      eventBus.emit('closeStudentReportDialog', true);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.sticky-first-col :deep(.v-table__wrapper) {
  overflow-x: auto;
}

.sticky-first-col :deep(table) {
  border-collapse: separate;
  border-spacing: 0;
}

.sticky-first-col :deep(th:first-child),
.sticky-first-col :deep(td:first-child) {
  position: sticky;
  left: 0;
  background: #fff;
  background: rgb(var(--v-theme-surface));
  z-index: 2;

  min-width: 180px;
}
.sticky-first-col :deep(thead th:first-child) {
  z-index: 3;
}

.sticky-first-col :deep(td:first-child) {
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.06);
}
</style>
