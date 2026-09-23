<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable fullscreen>
      <v-form ref="MyChildrenGrade" @submit.prevent>
        <v-card>
          <v-card-title
            class="d-flex dialog-header justify-center align-center"
          >
            <span v-if="data"
              >{{ action }} {{ data.name }} Appointment Record
            </span>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              @click="closeD()"
            >
            </v-btn>
          </v-card-title>
          <v-container>
            <v-card-text style="max-height: 700px" class="my-4">
              <v-tabs v-model="tab" color="blue" class="mb-4">
                <v-tab value="new">
                  <v-icon class="mr-1">mdi-calendar-plus</v-icon>
                  New Appointment
                </v-tab>
                <v-tab value="list">
                  <v-icon class="mr-1">mdi-calendar-check</v-icon>
                  My Appointments
                </v-tab>
              </v-tabs>

              <v-window v-model="tab">
                <!-- NEW APPOINTMENT -->
                <v-window-item value="new">
                  <v-row>
                    <v-col cols="12" md="6" class="mt-2">
                      <v-select
                        v-model="form.teacherID"
                        :items="teacherList"
                        item-title="teacher_name"
                        item-value="id"
                        label="Teacher"
                        :rules="[(v) => !!v || 'Teacher is required']"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" class="mt-2">
                      <v-textarea
                        v-model="form.purpose"
                        color="green"
                        label="Purpose of Appointment"
                        :rules="[(v) => !!v || 'Purpose is required']"
                        rows="3"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.scheduleDate"
                        type="date"
                        label="Preferred Date"
                        :rules="[(v) => !!v || 'Date is required']"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.scheduleTime"
                        type="time"
                        label="Preferred Time"
                        :rules="[(v) => !!v || 'Time is required']"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="d-flex justify-end ma-2">
                      <v-btn
                        color="blue"
                        :loading="submitting"
                        @click="submitAppointment()"
                      >
                        <v-icon class="mr-1">mdi-calendar-plus</v-icon>
                        Request Appointment
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-window-item>

                <!-- LIST OF CREATED APPOINTMENTS -->
                <v-window-item value="list">
                  <v-table density="comfortable">
                    <thead>
                      <tr>
                        <th>Purpose</th>
                        <th>Schedule</th>
                        <th class="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="!appointmentData.length">
                        <td colspan="3" class="text-center text-grey py-4">
                          No appointments yet.
                        </td>
                      </tr>
                      <tr v-else v-for="item in appointmentData" :key="item.id">
                        <td>{{ item.purpose }}</td>
                        <td>{{ formatSchedule(item.schedule) }}</td>
                        <td class="text-right">
                          <v-btn
                            icon="mdi-delete-outline"
                            variant="text"
                            color="red"
                            size="small"
                            @click="cancelAppointment(item)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-container>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
      :timeout="3000"
    ></fade-away-message-component>
  </div>
</template>

<script>
import eventBus from '@/eventBus';
export default {
  components: {},
  props: {
    data: null,
    action: null,
    filter: null,
  },
  data() {
    return {
      semester: 'First Sem',
      updateID: null,
      dialog: false,
      tab: 'new',
      items: [],
      syType: null,
      userId: null,
      submitting: false,
      currentDate: new Date(),
      appointmentData: [],
      teacherList: [],
      form: {
        teacherID: null,
        purpose: '',
        scheduleDate: '',
        scheduleTime: '',
      },
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Added!',
        message: '',
        top: 10,
      },
    };
  },

  computed: {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log('View Data', data);
        if (data.id) {
          this.initialize();
        } else {
          this.initialize();
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.syType = this.$store.getters.getSyType;
      this.userId = this.$store.state.user.id;
      this.getAllMyAppointment();
      this.getAllTeachers();
    },
    getAllMyAppointment() {
      this.axiosCall(
        '/parent-records/getMyAppointment/' +
          this.data.id +
          '/' +
          this.userId +
          '/' +
          this.filter,
        'GET',
      ).then((res) => {
        if (res.data) {
          this.appointmentData = res.data;
        }
      });
    },
    getAllTeachers() {
      this.axiosCall(
        '/parent-records/getMyChildTeachers/' + this.data?.id,
        'GET',
      ).then((res) => {
        if (res.data) {
          this.teacherList = res.data;
        }
      });
    },

    submitAppointment() {
      if (
        !this.form.teacherID ||
        !this.form.purpose ||
        !this.form.scheduleDate ||
        !this.form.scheduleTime
      ) {
        this.fadeAwayMessage = {
          show: true,
          type: 'error',
          header: 'Missing Fields',
          message: 'Please fill in purpose, date, and time.',
          top: 10,
        };
        return;
      }

      this.submitting = true;

      const payload = {
        studentID: this.data.id,
        parentID: this.userId,
        teacherID: this.form.teacherID,
        school_yearID: this.filter,
        purpose: this.form.purpose,
        schedule: `${this.form.scheduleDate} ${this.form.scheduleTime}:00`,
      };

      this.axiosCall('/parent-records/createAppointment', 'POST', payload)
        .then((res) => {
          if (res) {
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'success';
              this.fadeAwayMessage.header = 'System Message';
              this.fadeAwayMessage.message = res.data.msg;
              this.initialize();
              this.form.purpose = '';
              this.form.teacherID = null;
              this.form.scheduleDate = '';
              this.form.scheduleTime = '';
              this.tab = 'list';
            } else if (res.data.status == 400) {
              this.confirmDialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'error';
              this.fadeAwayMessage.header = 'System Message';
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    cancelAppointment(item) {
      this.axiosCall(
        '/parent-records/cancelAppointment/' + item.id,
        'DELETE',
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
          this.initialize();
          this.appointmentData = this.appointmentData.filter(
            (a) => a.id !== item.id,
          );
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    formatSchedule(schedule) {
      if (!schedule) return '—';
      const d = new Date(schedule);
      return d.toLocaleString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    closeD() {
      eventBus.emit('closeMyAppointment', false);
      this.appointmentData = [];
      this.dialog = false;
    },
  },
};
</script>
