<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable fullscreen>
      <v-form ref="StudentGrades" @submit.prevent>
        <v-card>
          <v-card-title
            class="d-flex dialog-header justify-center align-center"
          >
            <span>{{ action }} Students Grade</span>
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
            <v-row>
              <v-col cols="12" md="3" class="d-flex">
                <v-autocomplete
                  v-if="data"
                  v-model="quarter"
                  :items="
                    data.grade_level == 'Grade 11' ||
                    data.grade_level == 'Grade 12'
                      ? ['1st Quarter', '2nd Quarter', 'All']
                      : [
                          '1st Quarter',
                          '2nd Quarter',
                          '3rd Quarter',
                          '4th Quarter',
                          'All',
                        ]
                  "
                  chips
                  variant="outlined"
                  density="compact"
                  label="Quarter"
                  @update:modelValue="changeQuarter"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" class="d-flex">
                <v-autocomplete
                  v-model="semester"
                  :label="
                    data && !['Grade 11', 'Grade 12'].includes(data.grade_level)
                      ? 'Grade Level'
                      : 'Semester'
                  "
                  :disabled="
                    data && !['Grade 11', 'Grade 12'].includes(data.grade_level)
                  "
                  :items="['1st Semester', '2nd Semester']"
                  chips
                  variant="outlined"
                  density="compact"
                  @update:modelValue="changeQuarter"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="students"
                  item-value="id"
                >
                  <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                      :color="item.average <= 80 ? 'red' : 'green'"
                      variant="flat"
                    >
                      {{ item.average <= 80 ? "Fail" : "Passed" }}
                    </v-chip>
                  </template>
                </v-data-table></v-col
              >
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <button
              class="pa-2"
              @click="printData()"
              style="background-color: blue; color: white; border-radius: 10px"
            >
              <v-icon size="small">mdi-printer</v-icon>
              Printer All
            </button>
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
      updateID: null,
      dialog: false,
      quarter: "1st Quarter",
      semester: null,
      studentsGrade: [],
      students: [],
      headers: [],
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
        console.log("View Data", data);
        if (data.id) {
          data.grade_level == "Grade 11" || data.grade_level == "Grade 12"
            ? (this.semester = "1st Semester")
            : (this.semester = "Junior High");
          this.initialize();
          this.updateID = data.id;
        } else {
          data.grade_level == "Grade 11" || data.grade_level == "Grade 12"
            ? (this.semester = "1st Semester")
            : (this.semester = "Junior High");
          this.initialize();
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getAllStudentsGrade();
    },
    buildTable(data) {
      const students = {};
      const subjects = new Set();
      const quarters = new Set();
      data.forEach((item) => {
        if (!students[item.id]) {
          students[item.id] = {
            id: item.id,
            name: item.name,
          };
        }
        const subject = item.subject_title;
        subjects.add(subject);
        quarters.add(item.quarter);
        if (this.quarter === "All") {
          students[item.id][`${subject}_${item.quarter}`] = item.final_grade;
          if (!students[item.id][`${subject}_grades`]) {
            students[item.id][`${subject}_grades`] = [];
          }
          students[item.id][`${subject}_grades`].push(item.final_grade);
        } else {
          students[item.id][subject] = item.final_grade;
        }
      });
      if (this.quarter === "All") {
        Object.values(students).forEach((student) => {
          let subjectFinals = [];

          subjects.forEach((subject) => {
            const grades = student[`${subject}_grades`] || [];
            if (grades.length > 0) {
              const avg = grades.reduce((sum, g) => sum + g, 0) / grades.length;
              student[`${subject}_Final`] = Math.round(
                parseFloat(avg.toFixed(2)),
              );
              subjectFinals.push(avg);
            }
            delete student[`${subject}_grades`];
          });
          if (subjectFinals.length > 0) {
            const overallAvg =
              subjectFinals.reduce((a, b) => a + b, 0) / subjectFinals.length;
            student["average"] = Math.round(parseFloat(overallAvg.toFixed(2)));
          }
        });
      }
      const subjectAverages = {};
      if (this.quarter === "All") {
        subjects.forEach((subject) => {
          const allFinals = Object.values(students)
            .map((s) => s[`${subject}_Final`])
            .filter((val) => val !== undefined);
          if (allFinals.length > 0) {
            subjectAverages[subject] =
              allFinals.reduce((a, b) => a + b, 0) / allFinals.length;
          }
        });
        const allSubjectAvgs = Object.values(subjectAverages);
        if (allSubjectAvgs.length > 0) {
          subjectAverages["average"] =
            allSubjectAvgs.reduce((a, b) => a + b, 0) / allSubjectAvgs.length;
        }
      }

      this.students = Object.values(students);
      let subjectHeaders = [];
      if (this.quarter === "All") {
        subjectHeaders = Array.from(subjects).map((subject) => ({
          title: subject,
          align: "center",
          children: [
            ...Array.from(quarters).map((q) => ({
              title: q,
              key: `${subject}_${q}`,
              align: "center",
            })),
            {
              title: "Final Grade",
              key: `${subject}_Final`,
              align: "center",
            },
          ],
        }));
        subjectHeaders.push(
          {
            title: "Final Average",
            key: "average",
            align: "center",
          },
          {
            title: "Status",
            key: "status",
            align: "center",
          },
        );
      } else {
        subjectHeaders = Array.from(subjects).map((subject) => ({
          title: subject,
          key: subject,
          align: "center",
        }));
      }

      this.headers = [
        { title: "No.", key: "id", align: "center", width: 20 },
        { title: "Name", key: "name", align: "center", width: 80 },
        ...subjectHeaders,
      ];
      // this.subjectAverages = subjectAverages;
      // this.header.push({ title: "Status", key: "status" });
    },
    getAllStudentsGrade() {
      this.axiosCall(
        "/enroll-student/getAllStudentsFinalGrade/" +
          this.data.school_yearID +
          "/" +
          this.data.roomID +
          "/" +
          this.quarter +
          "/" +
          this.semester,
        "GET",
      ).then((res) => {
        // console.log(res.data);
        if (res.data) {
          this.buildTable(res.data);
          this.studentsGrade = res.data;
        }
      });
    },
    changeQuarter() {
      this.axiosCall(
        "/enroll-student/getAllStudentsFinalGrade/" +
          this.data.school_yearID +
          "/" +
          this.data.roomID +
          "/" +
          this.quarter +
          "/" +
          this.semester,
        "GET",
      ).then((res) => {
        // console.log(res.data);
        if (res.data) {
          this.buildTable(res.data);
          this.studentsGrade = res.data;
        }
      });
    },
    printData() {
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getAllStudentsFinalGrade/" +
          this.data.school_yearID +
          "/" +
          this.data.roomID +
          "/" +
          this.quarter +
          "/" +
          this.semester +
          "/" +
          this.data.grade_level +
          "",
        "_blank",
      );
    },
    closeD() {
      eventBus.emit("closeStudentGradeDialog", false);
      this.dialog = false;
    },
  },
};
</script>
