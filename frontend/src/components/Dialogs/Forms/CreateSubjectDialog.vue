<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="900px">
      <v-form ref="AddSubjectDialog" @submit.prevent>
        <v-card>
          <v-card-title class="d-flex dialog-header">
            <span>{{ action }} Subject</span>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              @click="closeD()"
            >
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" :md="grade_level == 'Senior High' ? 4 : 6">
                  <v-text-field
                    v-model="subject_title"
                    label="Subject Title"
                    variant="outlined"
                    density="compact"
                    style="max-width: 300px"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" :md="grade_level == 'Senior High' ? 4 : 6">
                  <v-autocomplete
                    v-model="grade_level"
                    :items="seniorJuniorList"
                    label="Grade Level"
                    variant="outlined"
                    density="compact"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" v-if="grade_level == 'Senior High'">
                  <v-autocomplete
                    v-model="indicator"
                    :items="indicatorList"
                    label="Indicator"
                    variant="outlined"
                    density="compact"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="writenWorks"
                    label="Written Works (30%)"
                    type="number"
                    variant="outlined"
                    density="compact"
                    class="mx-2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="performanceTask"
                    label="Performance Task 30%"
                    variant="outlined"
                    density="compact"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="quarterAssessment"
                    label="Quarter Asserssment 40%"
                    variant="outlined"
                    density="compact"
                    type="number"
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="12">
                  <div>
                    <div>
                      <v-btn
                        x-small
                        color="pink"
                        class="my-2 ml-5"
                        outlined
                        @click="editItem()"
                      >
                        <v-icon size="14">mdi-plus</v-icon>Sub-Subjects
                      </v-btn>
                    </div>
                    <div
                      class="ml-5"
                      style="
                        border: 1px solid black;
                        border-radius: 10px;
                        padding: 20px;
                      "
                    >
                      <v-row>
                        <v-col
                          cols="12"
                          v-for="item in subSubjectList"
                          :key="item.id"
                        >
                          <div
                            class="d-flex justify-space-between align-center"
                            style="margin-bottom: -1rem; margin-top: -0.5rem"
                          >
                            <v-text-field
                              v-model="item.description"
                              label="Description"
                              variant="outlined"
                              density="compact"
                              class="mx-2"
                              style="max-width: 300px"
                            ></v-text-field>

                            <v-btn
                              size="small"
                              color="pink"
                              variant="outlined"
                              class="mb-4"
                              @click="deleteSub(item)"
                            >
                              <v-icon size="16" start
                                >mdi-delete-outline</v-icon
                              >
                              Delete
                            </v-btn>
                          </div>
                          <v-divider class="my-2"></v-divider>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-col> -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="#e35e93"
              class="white--text"
              v-if="action == 'Add'"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#e35e93"
              class="white--text"
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
    filter: null,
  },
  data() {
    return {
      newStatus: null,
      writenWorks: null,
      performanceTask: null,
      quarterAssessment: null,
      subSubjectList: [],
      statusList: [
        { id: 1, description: "Elementary" },
        { id: 2, description: "High School" },
      ],

      applicantNumber: null,
      juniorList: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
      seniorList: ["Grade 11", "Grade 12"],
      seniorJunior: null,
      grade_level: null,
      subject_title: null,
      seniorJuniorList: ["Junior High", "Senior High"],
      unit_departmentlist: [],
      indicatorList: ["CORE", "APPLIED", "SPECIALIZED"],
      indicator: null,
      dateFrom: null,
      dateTo: null,
      updateID: null,
      departmentData: null,
      officeData: null,
      menu: false,
      menu2: false,
      remarksData: [],
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
        console.log("View Data", data);
        if (data.id) {
          this.initialize();
          this.updateID = data.id;
          this.subject_title = data.subject_title;
          this.seniorJunior = data.seniorJunior;
          this.dateFrom = data.date_from;
          this.indicator = data.indicator;
          this.dateTo = data.date_to;
          this.grade_level = data.grade_level;
          this.newStatus = data.status;
          this.writenWorks = data.writen_works ? data.writen_works : null;
          this.subSubjectList =
            data.sub_subject == null ? [] : JSON.parse(data.sub_subject);
          this.performanceTask = data.performance_task
            ? data.performance_task
            : null;
          this.quarterAssessment = data.quarter_assessment
            ? data.quarter_assessment
            : null;
        } else {
          this.$refs.AddSubjectDialog.reset();
          this.grade_level = data[0].tab == 1 ? "Junior High" : "Senior High";
          this.initialize();
          this.subject_title = data.subject_title;
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
      this.loadYearSelection();
    },
    loadYearSelection() {
      let d = new Date();

      for (let i = parseInt(d.getFullYear()); i >= 2021; i--) {
        this.yearSelection.push(i);
      }
    },
    closeD() {
      eventBus.emit("closeAddSubjectDialog", false);
      this.subSubjectList = [];
      this.dialog = false;
    },
    editItem() {
      const newId = this.subSubjectList.length
        ? Math.max(...this.subSubjectList.map((item) => item.id)) + 1
        : 1;

      this.subSubjectList.push({ id: newId, description: "" });
    },
    deleteSub(item) {
      this.subSubjectList = this.subSubjectList.filter((i) => i.id !== item.id);
    },
    checkConflict(type) {
      console.log(type, this.subSubjectList);
      if (type == "ADD") {
        if (
          this.subject_title == null ||
          this.grade_level == null ||
          this.writenWorks == null ||
          this.performanceTask == null ||
          this.quarterAssessment == null
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill all fields";
        } else {
          let data = {
            subject_title: this.subject_title,
            indicator: this.indicator,
            sub_subject: JSON.stringify(this.subSubjectList),
            grade_level: this.grade_level,
            writen_works: this.writenWorks,
            performance_task: this.performanceTask,
            quarter_assessment: this.quarterAssessment,
          };
          // console.log(data);
          this.axiosCall("/subjects", "POST", data).then((res) => {
            console.log(res.data);
            // alert("Successfully Added");
            this.closeD();
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = "Successfully Added Subject!";

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
        if (
          this.subject_title == null ||
          this.grade_level == null ||
          this.writenWorks == null ||
          this.performanceTask == null ||
          this.quarterAssessment == null
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill all fields";
        } else {
          let data = {
            subject_title: this.subject_title,
            grade_level: this.grade_level,
            writen_works: this.writenWorks,
            indicator: this.indicator,
            sub_subject: JSON.stringify(this.subSubjectList),
            performance_task: this.performanceTask,
            quarter_assessment: this.quarterAssessment,
          };
          console.log(data);
          this.axiosCall("/subjects/" + this.updateID, "PATCH", data).then(
            (res) => {
              console.log(res.data);
              if (res.data.status == 201) {
                this.closeD();
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = "Successfully updated subject!";

                // location.reload();
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          );
        }
      }
    },
  },
};
</script>
