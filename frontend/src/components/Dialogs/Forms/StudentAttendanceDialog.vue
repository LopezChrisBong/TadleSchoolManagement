<template>
  <div>
    <v-dialog v-model="dialog" fullscreen eager scrollable max-width="600px">
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="d-flex dialog-header pt-5 pb-5 pl-6">
            <span v-if="data" style="text-transform: uppercase">
              {{ data.subject_title }} {{ data.grade_level }}
              {{ data.room_section }} Student Attendance</span
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
                <v-col cols="12" md="6">
                  <v-menu
                    v-model="ratingPeriodBeginMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="120px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        label="Select Date of attendance"
                        :model-value="formatDate(attendanceDate)"
                        prepend-inner-icon="mdi-calendar"
                        variant="outlined"
                      />
                    </template>
                    <!-- formatDate(attendanceDate, 'MM/DD/YYYY')?.toString() -->
                    <v-date-picker
                      v-model="attendanceDate"
                      color="primary"
                      no-title
                      @update:modelValue="changeDate"
                      :allowed-dates="allowedDates"
                    >
                    </v-date-picker>
                    <v-btn
                      size="20px"
                      style="margin-top: -40px; margin-left: 290px"
                      variant="text"
                      color="black"
                      @click="ratingPeriodBeginMenu = false"
                      >OK</v-btn
                    >
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-red-lighten-2 text-caption">
                      {{ messageSaved }}</span
                    >
                    <v-btn
                      class="ma-2"
                      x-small
                      color="#dc0b70"
                      outlined
                      @click="viewAttendance()"
                    >
                      <v-icon size="18" class="mx-2">mdi-printer-eye</v-icon>
                      Atendance
                    </v-btn>
                  </div>

                  <v-data-table
                    :headers="headers"
                    :items="studentAttendace"
                    :search="search"
                    @update:options="options"
                    :loading="loading"
                  >
                    <template v-slot:[`item.attendance`]="{ item }">
                      <!-- <v-checkbox-btn
                        :disabled="attendanceDate == null ? true : false"
                        v-model="item.attendance"
                        :ripple="item.attendance == 0 ? false : true"
                        @change="save(item.id)"
                      ></v-checkbox-btn> -->
                      <div class="d-flex">
                        <v-checkbox-btn
                          :disabled="attendanceDate == null ? true : false"
                          v-model="item.attendance"
                          :true-value="3"
                          :false-value="0"
                          :ripple="item.attendance === 3"
                          >Excused</v-checkbox-btn
                        >
                        <v-checkbox-btn
                          :disabled="attendanceDate == null ? true : false"
                          v-model="item.attendance"
                          :true-value="2"
                          :false-value="0"
                          :ripple="item.attendance === 2"
                          >Late</v-checkbox-btn
                        >
                        <v-checkbox-btn
                          :disabled="attendanceDate == null ? true : false"
                          v-model="item.attendance"
                          :true-value="1"
                          :false-value="0"
                          :ripple="item.attendance === 1"
                          >Present</v-checkbox-btn
                        >
                        <v-checkbox-btn
                          :disabled="attendanceDate == null ? true : false"
                          v-model="item.attendance"
                          :true-value="0"
                          :false-value="0"
                          :ripple="item.attendance === 0"
                          >Absent</v-checkbox-btn
                        >
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
              x-small
              variant="outlined"
              color="red"
              @click="closeD()"
            >
              <v-icon>mdi-close-circle</v-icon>
              Close
            </v-btn>
            <v-btn
              v-if="update"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              variant="flat"
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

    <v-dialog v-model="dialogConfirmSave" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Confirmation </v-card-title>

        <v-card-text style="font-size: 17px">
          Are you sure you want to save attendance? if yes click Confirm!
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-3"
            variant="outlined"
            @click="dialogConfirmSave = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            variant="flat"
            class="white--text"
            @click="saveAttendanceData()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="attendanceDialog" fullscreen eager scrollable>
      <v-card>
        <v-card-title class="d-flex dialog-header align-center">
          <span v-if="data">
            {{ data.subject_title }} {{ data.grade_level }}
            {{ data.room_section }} Student Attendance</span
          >
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="
              attendanceDialog = false;
              currentMonth = new Date();
            "
          >
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="">
          <v-row>
            <v-col cols="12">
              <div>
                <div class="d-flex justify-space-between mb-4">
                  <v-btn color="primary" @click="prevMonth"
                    >Previous Month</v-btn
                  >
                  <span class="text-h6">{{ currentMonthLabel }}</span>
                  <v-btn color="primary" @click="nextMonth">Next Month</v-btn>
                </div>
                <v-data-table
                  :headers="filteredHeaders"
                  :items="filteredItems"
                  item-key="student_name"
                  class="sticky-first-col"
                >
                  <!-- Slot for student name -->
                  <template v-slot:[`item.student_name`]="{ item }">
                    <strong>{{ item.student_name }}</strong>
                  </template>

                  <!-- Slots for dynamic day columns -->
                  <template
                    v-for="header in headerSemester.filter(
                      (h) => h.key !== 'student_name',
                    )"
                    v-slot:[`item.${header.key}`]="{ item }"
                    :key="header.key"
                  >
                    <span :class="item[header.key]?.cls">
                      {{ item[header.key]?.text }}
                    </span>
                  </template>
                </v-data-table>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
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
      studentAttendace: [],
      edit: true,
      dialog: false,
      messageSaved: '',
      ratingPeriodBeginMenu: false,
      dialogConfirmSave: false,
      attendanceDate: null,
      attendanceDialog: false,
      Option: {},
      filter: null,
      search: '',
      currentMonth: new Date(),
      loading: false,
      update: false,
      userRoleID: null,
      headerSemester: [],
      tableItems: [],
      headers: [
        { title: 'Student Name', value: 'name', align: 'start' },
        {
          title: 'Attendance',
          value: 'attendance',
          align: 'center',
          sortable: false,
          width: 600,
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
    currentMonthLabel() {
      return this.currentMonth.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
    },
    filteredHeaders() {
      return this.headerSemester.filter((header) => {
        if (header.key === 'student_name') return true;
        const date = new Date(header.key);
        return (
          date.getMonth() === this.currentMonth.getMonth() &&
          date.getFullYear() === this.currentMonth.getFullYear()
        );
      });
    },
    filteredItems() {
      const allowedKeys = this.filteredHeaders.map((h) => h.key);
      return this.tableItems.map((item) => {
        const newItem = {};
        allowedKeys.forEach((key) => {
          newItem[key] = item[key] ?? ''; // Keep value if exists
        });
        return newItem;
      });
    },
  },

  methods: {
    initialize() {
      this.filter = this.$store.getters.getFilterSelected;
      this.userRoleID = this.$store.state.user.id;
      this.getTaggedStudent();
    },
    prevMonth() {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() - 1,
        1,
      );
    },
    nextMonth() {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() + 1,
        1,
      );
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
        console.log('Data Students', res.data);
        if (res.data) {
          this.studentAttendace = res.data;
        }
      });
    },
    saveAttendance() {
      if (this.attendanceDate == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = 'error';
        this.fadeAwayMessage.header = 'System Message';
        this.fadeAwayMessage.message = 'Please select date before saving!';
      } else {
        // alert(this.studentAttendace[0].attendance);
        this.dialogConfirmSave = true;
      }

      //   alert(this.formatDate(this.attendanceDate, "MM/DD/YYYY")?.toString
    },

    saveAttendanceData() {
      let userId = this.$store.state.user.id;
      let data = {
        data: JSON.stringify(this.studentAttendace),
        attendanceDate: this.formatDate3(this.attendanceDate),
        subjectID: this.data.subjectId,
        teacherID: userId,
      };
      console.log(data);
      this.axiosCall('/rooms-section/studentAttendance', 'POST', data).then(
        (res) => {
          console.log(res);
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
            // this.attendanceDate = null;
            this.changeDate();
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
    updateAttendance() {
      console.log('updated');
      let data = {
        data: JSON.stringify(this.studentAttendace),
        // attendanceDate: this.formatDate3(this.attendanceDate),
        subjectID: this.data.subjectId,
      };
      console.log(data);
      this.axiosCall(
        '/rooms-section/updateAttendance/' +
          this.formatDate3(this.attendanceDate),
        'PATCH',
        data,
      ).then((res) => {
        console.log(res.data);
        if (res.data.status == 200) {
          this.changeDate();
          this.dialogConfirmSave = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = 'Successfully updated attendance!';

          // location.reload();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    save(id) {
      if (this.attendanceDate == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = 'error';
        this.fadeAwayMessage.header = 'System Message';
        this.fadeAwayMessage.message = 'Please select date before saving!';
      } else {
        console.log(id);
      }
    },
    isWithinThreeDaysBeforeToday(dateStr) {
      const today = new Date();
      const threeDaysBefore = new Date();
      threeDaysBefore.setDate(today.getDate() - 2);

      const givenDate = new Date(dateStr);

      // Check if givenDate is >= threeDaysBefore and < today
      return givenDate >= threeDaysBefore && givenDate < today;
    },
    changeDate() {
      console.log(this.data.subjectId, this.data.roomId);
      this.axiosCall(
        '/rooms-section/getAllAttendanceByDate/' +
          this.formatDate3(this.attendanceDate) +
          '/' +
          this.data.roomId +
          '/' +
          this.data.subjectId,
        'GET',
      ).then((res) => {
        console.log('Data Students', res.data);

        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.studentAttendace = res.data;
          this.edit = false;
          this.messageSaved =
            'Attendance for ' +
            this.formatDate(this.attendanceDate) +
            ' has already been recorded. Only attendance within 2 days before the current date can be updated.';
          if (this.isWithinThreeDaysBeforeToday(this.attendanceDate)) {
            this.update = true;
          } else {
            this.update = false;
          }
        } else {
          this.initialize();
          this.edit = true;
          this.update = false;
        }
      });
    },

    getAllAttendanceSemester() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/rooms-section/getAllAttendanceWholeSemester/' +
          this.data.roomId +
          '/' +
          this.data.subjectId +
          '/' +
          filter,
        'GET',
      ).then((res) => {
        console.log('getAllAttendanceWholeSemester', res.data);
        let data = res.data;
        this.changeData(data);
      });
    },

    changeData(data) {
      let updated = data.map((row) => {
        let newRow = { ...row };
        for (let key in newRow) {
          if (key !== 'student_name' && key !== 'subject') {
            newRow[key] =
              newRow[key] === '0'
                ? { text: '❌', cls: 'text-h5 red--text' }
                : newRow[key] === '1'
                ? { text: '✅', cls: 'text-h5 green--text' }
                : newRow[key] === '2'
                ? { text: '◩', cls: 'text-h4 orange--text' }
                : { text: '◪', cls: 'text-h4 blue--text' };
          }
        }
        return newRow;
      });
      let rawData = updated;

      const dates = Array.from(
        new Set(
          rawData.flatMap((r) =>
            Object.keys(r).filter((k) => k !== 'student_name'),
          ),
        ),
      );
      const grouped = {};
      rawData.forEach((row) => {
        const name = row.student_name;
        if (!grouped[name]) {
          grouped[name] = { student_name: name };
          dates.forEach((date) => (grouped[name][date] = '')); // empty default
        }
        Object.entries(row).forEach(([key, value]) => {
          if (key !== 'student_name') {
            grouped[name][key] = value;
          }
        });
      });
      const tableItems = Object.values(grouped);
      const headers = [
        {
          title: 'Name',
          key: 'student_name',
          align: 'start',
          sortable: false,
          width: 100,
        },
        ...dates.map((date) => ({
          title: this.formatDate(date),
          key: date,
        })),
      ];
      this.headerSemester = headers;
      this.tableItems = tableItems;
      console.log(headers);
      console.log(tableItems);
    },
    viewAttendance() {
      console.log(this.data.subjectId, this.data.roomId);
      this.getAllAttendanceSemester();
      this.attendanceDialog = true;
    },

    allowedDates(date) {
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const current = new Date(date);
      return current >= sixMonthsAgo && current <= today;
    },
    closeD() {
      eventBus.emit('closeStudentAttendanceDialog', true);
      this.currentMonth = new Date();
      this.attendanceDate = null;
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
