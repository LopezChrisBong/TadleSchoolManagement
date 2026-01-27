<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="640"
      transition="dialog-bottom-transition"
    >
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card rounded="xl" elevation="8">
          <!-- HEADER -->
          <v-card-title class="px-4 py-3">
            <div class="d-flex align-center justify-space-between w-100">
              <div>
                <div class="text-h6 font-weight-bold">
                  {{ action }} Classroom Schedule Multiple
                </div>
                <div class="text-caption text-grey">
                  {{ grade }} • {{ className }}
                </div>
              </div>

              <v-btn
                icon
                variant="text"
                density="comfortable"
                @click="closeD()"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>

          <v-divider />

          <!-- CONTENT -->
          <v-card-text class="px-4 pt-4">
            <v-row dense>
              <!-- TIME FROM -->
              <v-col cols="12" md="6">
                <v-dialog v-model="modal1" persistent width="380">
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="time_slot_from"
                      label="Time From"
                      prepend-inner-icon="mdi-clock-outline"
                      readonly
                      v-bind="props"
                      variant="outlined"
                      density="comfortable"
                      :rules="[formRules.required]"
                    />
                  </template>

                  <v-card rounded="lg">
                    <v-time-picker v-model="time_slot_from" />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        variant="outlined"
                        color="red"
                        @click="modal1 = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        variant="flat"
                        color="pink"
                        @click="modal1 = false"
                      >
                        OK
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>

              <!-- TIME TO -->
              <v-col cols="12" md="6">
                <v-dialog v-model="modal2" persistent width="380">
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="time_slot_to"
                      label="Time To"
                      prepend-inner-icon="mdi-clock-outline"
                      readonly
                      v-bind="props"
                      variant="outlined"
                      density="comfortable"
                      :rules="[formRules.required]"
                    />
                  </template>

                  <v-card rounded="lg">
                    <v-time-picker v-model="time_slot_to" />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        variant="outlined"
                        color="red"
                        @click="modal2 = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        variant="flat"
                        color="pink"
                        @click="modal2 = false"
                      >
                        OK
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>

              <!-- DAY -->
              <v-col cols="12">
                <v-autocomplete
                  v-model="day"
                  :rules="[formRules.required]"
                  :items="dayList"
                  item-title="name"
                  color="pink"
                  multiple
                  item-value="name"
                  label="Day"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-calendar-week"
                />
              </v-col>

              <!-- TEACHER -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="teacher"
                  :rules="[formRules.required]"
                  :items="TeachersList"
                  item-title="name"
                  item-value="id"
                  label="Teacher"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-account-tie"
                  @update:modelValue="teacherAssign"
                />
              </v-col>

              <!-- SUBJECT -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="subject"
                  :rules="[formRules.required]"
                  :items="subjectList"
                  item-title="subject_title"
                  item-value="id"
                  label="Subject"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-book-education"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <!-- ACTIONS -->
          <v-card-actions class="px-4 pb-4">
            <v-spacer />

            <v-btn variant="outlined" color="red" @click="closeD()">
              Cancel
            </v-btn>

            <v-btn
              color="pink"
              variant="flat"
              prepend-icon="mdi-check-circle"
              @click="accept()"
            >
              {{ action === "Add" ? "Add Schedule" : "Update Schedule" }}
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
    ></fade-away-message-component>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
export default {
  props: {
    data: null,
    action: null,
    grade: null,
    section: null,
    filter: null,
    adviser: null,
  },
  data() {
    return {
      userId: null,
      dialog: false,
      readonly: true,
      className: [],
      selected: [],
      class_room: null,
      teacher: null,
      TeachersList: [],
      subject: null,
      subjectList: [],
      day: [],
      id: null,
      dayList: [
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
      ],
      time_slot_from: null,
      time_slot_to: null,
      modal1: false,
      modal2: false,
      classroomList: [],
      assignedModulesList: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        if (data.id) {
          console.log("Love", data);
          this.id = data.availId;
          this.time_slot_from = data.times_slot_from;
          this.time_slot_to = data.times_slot_to;
          this.teacher = data.teacherID.toString();
          this.day = data.day;
          this.subject = data.subjectId;
          this.getAllActiveSubjects(data.teacherID);

          // this.verifyModel.usertypeID = data.user_usertypeID.toString();
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.getUserType();
      this.getClassroom();
      if (
        this.grade == "Grade 1" ||
        this.grade == "Grade 2" ||
        this.grade == "Grade 3" ||
        this.grade == "Grade 4" ||
        this.grade == "Kinder 1" ||
        this.grade == "Kinder 2"
      ) {
        this.TeachingRoleAdvisory();
      } else {
        this.getRoleTeachers();
      }
    },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          console.log("UserList", res.data);
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      eventBus.emit("closeAddScheduleDialog", true);
      this.teacher = null;
      this.subject = null;
      // this.section = "";
      this.time_slot_from = null;
      this.time_slot_to = null;
      this.day = [];
      // this.grade = "";
      this.dialog = false;
    },

    teacherAssign(teacher) {
      this.getAllActiveSubjects(teacher);
    },
    accept() {
      if (this.$refs.UserVerifyFormref.validate()) {
        let filter = this.$store.getters.getFilterSelected;
        let hours = this.calculateHoursDifference(
          this.time_slot_from,
          this.time_slot_to,
        );
        if (hours < 1) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Please select time range above or equal to 1 hour!";
        } else {
          if (this.action == "Add") {
            let data = {
              teacherID: this.teacher,
              subjectId: this.subject,
              roomId: this.section,
              times_slot_from: this.time_slot_from,
              times_slot_to: this.time_slot_to,
              day: this.day,
              grade_level: this.grade,
              hours: hours,
              school_yearId: filter,
            };
            console.log(data);
            this.axiosCall("/enroll-student/addSchedule", "POST", data).then(
              (res) => {
                console.log(res);
                if (res.data.status == 201) {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "success";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                  this.closeD();
                } else {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "error";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                  this.closeD();
                }
              },
            );
          } else if (this.action == "Update") {
            let data = {
              teacherID: this.teacher,
              subjectId: this.subject,
              roomId: this.section,
              times_slot_from: this.time_slot_from,
              times_slot_to: this.time_slot_to,
              day: this.day,
              grade_level: this.grade,
              school_yearId: filter,
              hours: hours,
            };
            this.axiosCall(
              "/enroll-student/updateClassProgram/" + this.id,
              "PATCH",
              data,
            ).then((res) => {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.closeD();
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            });
          }
        }
      }
    },

    calculateHoursDifference(startTime, endTime) {
      // Helper function to convert time to minutes
      const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };

      // Convert both times to minutes
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);

      // Calculate the difference in minutes
      const differenceMinutes = endMinutes - startMinutes;

      // Convert minutes to hours (decimal format)
      const differenceHours = differenceMinutes / 60;

      return differenceHours;
    },

    getAllActiveSubjects(id) {
      let grade;
      if (this.grade == "Grade 11" || this.grade == "Grade 12") {
        grade = "Senior High";
      } else {
        grade = "Junior High";
      }
      this.axiosCall(
        "/subjects/getSpicificSubject/" + id + "/" + this.filter + "/" + grade,
        "GET",
      ).then((res) => {
        if (res) {
          console.log("Subject List", res.data);
          this.subjectList = res.data;
        }
      });
    },

    getClassroom() {
      //   let grade = this.grade.toString();
      this.axiosCall(
        "/rooms-section/" + this.grade + "/" + this.section,
        "GET",
      ).then((res) => {
        console.log("ClassName", res.data[0].teacherId);
        // this.adviser = res.data[0].teacherId;
        this.className = res.data[0].room_section;
      });
    },

    getRoleTeachers() {
      this.axiosCall(
        "/user-details/getAllVerifiedUser/TeachingRole/" + this.grade,
        "GET",
      ).then((res) => {
        console.log("Teacher Role1", res.data);
        this.TeachersList = res.data;
      });
    },

    TeachingRoleAdvisory() {
      this.axiosCall(
        "/user-details/getAdviser/RoomAdvisory/" +
          this.adviser +
          "/" +
          this.grade,
        "GET",
      ).then((res) => {
        console.log("Teacher Role2", res.data);
        this.TeachersList = res.data;
      });
    },
  },
};
</script>
