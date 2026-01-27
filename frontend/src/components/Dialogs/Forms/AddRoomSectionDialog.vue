<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="600px">
      <v-form ref="AddClassroom" @submit.prevent>
        <v-card rounded="xl">
          <!-- Header -->
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 font-weight-bold">{{ action }} Classroom</div>
              <!-- <div class="text-caption text-grey">
                Assign modules and permissions
              </div> -->
            </div>

            <v-btn
              icon="mdi-close"
              variant="text"
              color="grey"
              @click="closeD"
            />
          </v-card-title>

          <v-divider />
          <v-divider></v-divider>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="room_section"
                    label="Room Name"
                    :rules="[formRules.required]"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-autocomplete
                    v-model="adviser"
                    outlined
                    label="Select Advider"
                    :items="adviserList"
                    item-title="name"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                    chips
                    closable-chips
                    variant="outlined"
                    density="compact"
                  ></v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  :class="
                    grade == 'Grade 11'
                      ? ''
                      : grade == 'Grade 12'
                      ? ''
                      : 'd-none'
                  "
                >
                  <v-autocomplete
                    v-model="strandId"
                    variant="outlined"
                    density="compact"
                    :rules="
                      grade == 'Grade 11'
                        ? [formRules.required]
                        : grade == 'Grade 12'
                        ? [formRules.required]
                        : []
                    "
                    label="Strand List"
                    :items="strandList"
                    item-title="strand_name"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" variant="outlined" @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="#e35e93"
              class="white--text"
              variant="flat"
              v-if="action == 'Add'"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#e35e93"
              class="white--text"
              variant="flat"
              v-if="action == 'Update'"
              @click="checkConflict('UPDATE')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
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
    <!-- schedule day of week  -->
  </div>
</template>

<script>
import eventBus from "@/eventBus";
export default {
  components: {},
  props: {
    data: null,
    action: null,
    grade: null,
  },
  data() {
    return {
      strandId: null,
      strandList: [],
      adviserList: [],
      adviser: null,
      applicantNumber: null,
      juniorList: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
      seniorList: ["Grade 11", "Grade 12"],
      seniorJunior: null,
      grade_level: null,
      subject_title: null,
      seniorJuniorList: ["Junior High", "Senior High"],
      unit_departmentlist: [],
      dateFrom: null,
      dateTo: null,
      room_section: null,
      updateID: null,
      departmentData: null,
      officeData: null,
      menu: false,
      menu2: false,
      remarksData: [],
      confirmSubmissionDialog: false,
      submitBtnLoading: false,
      schedTimeDialog: false,
      schedDialog: false,

      schedList: [],
      schedTimeList: [],
      tempSelectedDays: [],
      dialog: false,
      timePicker1: null,
      timePicker2: null,

      yearSelection: [],
      confirmSubmit: {
        error: false,
        msg: null,
        type: null,
        show: false,
      },

      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },

  computed: {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        if (data.id) {
          this.initialize();
          this.updateID = data.id;
          this.strandId = data.strandId;
          this.room_section = data.room_section;
          this.grade_level = data.grade_level;
          this.seniorJunior = data.seniorJunior;
          this.dateFrom = data.date_from;
          this.dateTo = data.date_to;
          // this.adviser =
          //   data.teacherId != null ? data.teacherId.toString() : null;
        } else {
          this.$refs.AddClassroom.reset();
          this.strandId = data.strandId;
          this.initialize();
          this.grade_level = data.grade_level;
          this.seniorJunior = data.seniorJunior;
          this.dateFrom = data.date_from;
          this.dateTo = data.date_to;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getAllStrand();
      this.loadYearSelection();
      this.getRoleTeachers();
    },

    loadYearSelection() {
      let d = new Date();

      for (let i = parseInt(d.getFullYear()); i >= 2021; i--) {
        this.yearSelection.push(i);
      }
    },

    closeD() {
      eventBus.emit("closeAddClassroom", false);
      this.dialog = false;
      this.confirmSubmissionDialog = false;
      this.confirmSubmit.type = null;
      this.confirmSubmit.error = false;
      this.confirmSubmit.msg = null;
    },

    checkConflict(type) {
      if (this.$refs.AddClassroom.validate()) {
        if (type == "ADD") {
          if (this.room_section == null) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Please fill all fields";
          } else {
            let data;
            if (this.grade == "Grade 11" || this.grade == "Grade 12") {
              data = {
                room_section: this.room_section,
                grade_level: this.grade,
                teacherId: this.adviser,
                strandId: this.strandId,
              };
            } else {
              data = {
                room_section: this.room_section,
                grade_level: this.grade,
                teacherId: this.adviser,
              };
            }
            // console.log(data);
            this.axiosCall("/rooms-section", "POST", data).then((res) => {
              console.log(res.data);
              // alert("Successfully Added");

              if (res.data.status == 201) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = "Successfully Added Subject!";
                this.closeD();
                // location.reload();
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            });
          }
        } else if (type == "UPDATE") {
          // alert("UPDATED");
          if (this.room_section == null) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Please fill all fields";
          } else {
            let data;
            if (this.grade == "Grade 11" || this.grade == "Grade 12") {
              data = {
                room_section: this.room_section,
                grade_level: this.grade,
                teacherId: this.adviser,
                strandId: this.strandId,
              };
            } else {
              data = {
                room_section: this.room_section,
                grade_level: this.grade,
                teacherId: this.adviser,
              };
            }
            this.axiosCall(
              "/rooms-section/" + this.updateID,
              "PATCH",
              data,
            ).then((res) => {
              console.log(res.data);
              if (res.data.status == 201) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = "Successfully updated!!";
                this.closeD();
                location.reload();
              } else if (res.data.status == 400) {
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

    getAllStrand() {
      this.axiosCall("/rooms-section/AllStrand/Data/strand", "GET").then(
        (res) => {
          if (res) {
            let data = [];

            for (let index = 0; index < res.data.length; index++) {
              const arr = {
                id: res.data[index].id,
                strand_name: res.data[index].strand_name,
                trackId: res.data[index].trackId,
              };
              data.push(arr);
            }
            this.strandList = data;
            console.log("All Strand", res.data);
          }
        },
      );
    },

    getRoleTeachers() {
      this.axiosCall(
        "/user-details/getAdvisoryNotAssigned/" + this.grade,
        "GET",
      ).then((res) => {
        console.log("Teacher Role", res.data);
        this.adviserList = res.data;
      });
    },
  },
};
</script>
