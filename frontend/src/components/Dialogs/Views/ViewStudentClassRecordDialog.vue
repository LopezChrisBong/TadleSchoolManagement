<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      eager
      scrollable
      max-width="1200px"
    >
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="d-flex dialog-header align-center">
            <span v-if="data">
              {{ data.subject_title }} {{ data.grade_level }}
              {{ data.room_section }} Student Classrecords
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

          <v-card-text style="max-height: 700px" class="my-5">
            <v-container>
              <v-row>
                <v-col cols="12" md="3" class="d-flex">
                  <v-autocomplete
                    v-if="data"
                    v-model="quarter"
                    :items="
                      data.grade_level == 'Grade 11' ||
                      data.grade_level == 'Grade 12'
                        ? ['1st Quarter', '2nd Quarter']
                        : [
                            '1st Quarter',
                            '2nd Quarter',
                            '3rd Quarter',
                            '4th Quarter',
                          ]
                    "
                    chips
                    variant="outlined"
                    density="compact"
                    label="Quarter"
                    @update:modelValue="changeQuarter"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" class="d-flex">
                  <v-autocomplete
                    v-model="semester"
                    :label="
                      data &&
                      !['Grade 11', 'Grade 12'].includes(data.grade_level)
                        ? 'Grade Level'
                        : 'Semester'
                    "
                    :disabled="
                      data &&
                      !['Grade 11', 'Grade 12'].includes(data.grade_level)
                    "
                    :items="['1st Semester', '2nd Semester']"
                    chips
                    variant="outlined"
                    density="compact"
                    @update:modelValue="changeQuarter"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" class="d-flex">
                  <v-text-field
                    v-model="dinominator"
                    label="Highest Posible Score"
                    variant="outlined"
                    density="compact"
                    type="number"
                    style="max-width: 300px"
                    color="green"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  class="d-flex"
                  v-if="sub_subject != null"
                >
                  <v-autocomplete
                    v-model="sub_subject"
                    label="Sub Subject"
                    :items="subSubjectList"
                    item-value="id"
                    item-title="description"
                    :disabled="subSubjectList != [] ? false : true"
                    chips
                    variant="outlined"
                    density="compact"
                    @update:modelValue="changeQuarter"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <div class="flex-items mb-2" style="overflow: auto">
                    <v-tab
                      v-for="tab in tabList"
                      :key="tab.id"
                      :value="tab.id"
                      @click="changeTab(tab)"
                      :class="[
                        ' pa-3 mx-3 transition-all',
                        tab.active
                          ? 'bg-blue-lighten-1 text-white'
                          : 'bg-grey-lighten-4',
                      ]"
                      rounded="lg"
                      >{{ tab.name }}</v-tab
                    >
                    <v-spacer></v-spacer>
                    <v-btn color="pink" @click="openGeneratedGrade()">
                      <v-icon size="18"
                        >mdi-arrow-top-left-bold-box-outline</v-icon
                      >Generate Grade</v-btn
                    >
                    <v-btn color="green" @click="openQuizList()" class="mx-2">
                      <v-icon size="18">mdi-eye</v-icon>View Quiz List</v-btn
                    >
                  </div>

                  <v-data-table
                    :headers="headers"
                    :items="studentList"
                    density="compact"
                    item-key="name"
                  >
                    <template v-slot:[`item.quarterScore`]="{ item }">
                      <div class="d-flex justify-center align-center mt-3">
                        <v-text-field
                          v-model.number="item.quarterScore"
                          type="number"
                          :disabled="dinominator == null ? true : false"
                          variant="outlined"
                          density="compact"
                          :max="dinominator"
                          width="100px"
                          @input="onInputGradeScore(item)"
                        ></v-text-field>
                      </div>
                    </template>
                    <!-- <template v-slot:[`item.action`]="{ item }">
                      <div class="d-flex justify-center align-center">
                        <v-btn
                          class="mx-2"
                          x-small
                          color="blue"
                          outlined
                          @click="editItem(item)"
                        >
                          <v-icon size="18">mdi-pencil</v-icon>
                        </v-btn>
                      </div></template
                    > -->
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>
            <v-btn color="green" v-if="edit" outlined @click="save()">
              <v-icon>mdi-check</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="350">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-account</v-icon> &nbsp;
              Are you sure you want to save this information?
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
                  Are you sure you want to proceed?
                </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn
            color="#147452"
            class="white--text"
            @click="
              savedata == 'save' ? confirmSave() : confirmSubmitGradeToParents()
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="gradesDialog" fullscreen eager scrollable>
      <v-card>
        <v-card-title class="d-flex dialog-header align-center">
          <span v-if="data">
            {{ data.subject_title }} {{ data.grade_level }}
            {{ data.room_section }} Student Grade</span
          >
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="
              gradesDialog = false;
              gradeData = [];
            "
          >
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="">
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headersGenerated"
                :items="gradeData"
                v-if="sub_subject == null"
              >
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip
                    :border="`${getColor(
                      item.transmuted_grade
                    )} thin opacity-25`"
                    :color="getColor(item.transmuted_grade)"
                    size="small"
                    class="pa-2"
                    >{{
                      item.transmuted_grade >= 80
                        ? "Passed"
                        : item.transmuted_grade >= 75
                        ? "Warning"
                        : "At-Risk"
                    }}</v-chip
                  >
                </template>
                <!-- <template v-slot:[`item.initial_grade`]="{ item }">
                  <div class="d-flex justify-center align-center mt-3">
                    <v-text-field
                      v-model="item.initial_grade"
                      type="number"
                      :readonly="edit == true ? false : true"
                      variant="outlined"
                      density="compact"
                      width="100px"
                    ></v-text-field>
                  </div>
                </template>
                <template v-slot:[`item.transmuted_grade`]="{ item }">
                  <div class="d-flex justify-center align-center mt-3">
                    <v-text-field
                      v-model="item.transmuted_grade"
                      type="number"
                      :readonly="edit == true ? false : true"
                      variant="outlined"
                      density="compact"
                      width="100px"
                    ></v-text-field>
                  </div>
                </template> -->
              </v-data-table>
              <v-data-table
                :headers="headersMapeh"
                :items="gradeData"
                :items-per-page="50"
                :search="search"
                @update:options="options"
                :loading="loading"
                @pagination="pagination"
                :group-by="groupBy"
                :sort-by="sortBy"
                :custom-sort="customSort"
                v-if="sub_subject != null"
              >
                <template
                  v-slot:group-header="{
                    item,
                    columns,
                    toggleGroup,
                    isGroupOpen,
                  }"
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

                        <span class="ms-4">{{ item.value }}</span>
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip
                    :border="`${getColor(
                      item.transmuted_grade
                    )} thin opacity-25`"
                    :color="getColor(item.transmuted_grade)"
                    size="small"
                    class="pa-2"
                    >{{
                      item.transmuted_grade >= 80
                        ? "Passed"
                        : item.transmuted_grade >= 75
                        ? "Warning"
                        : "At-Risk"
                    }}</v-chip
                  >
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              gradesDialog = false;
              gradeData = [];
            "
          >
            Close
          </v-btn>
          <v-btn
            color="#147452"
            class="white--text"
            v-if="edit"
            @click="confirmSubmitGrade()"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="quizListDialog" fullscreen eager scrollable>
      <v-card>
        <v-card-title class="d-flex dialog-header align-center">
          <span v-if="data">
            {{ data.subject_title }} {{ data.grade_level }}
            {{ data.room_section }} Student Quizes</span
          >
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="
              (quizListDialog = false),
                (editScoreData = false),
                (editQuizData = false),
                (editingStudentID = null)
            "
          >
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="">
          <v-row>
            <v-col cols="12">
              <v-data-table :headers="headersQuizList" :items="items">
                <!-- Dynamic quiz columns -->
                <template
                  v-for="header in headersQuizList"
                  v-slot:[`item.${header.key}`]="{ item }"
                  :key="header.key"
                >
                  <div
                    v-if="header.key.startsWith('Quiz')"
                    class="d-flex justify-center align-center mt-3"
                  >
                    <v-text-field
                      v-model.number="item[header.key].value"
                      type="number"
                      :readonly="
                        !editScoreData && editingStudentID !== item.studentID
                      "
                      :max="item[header.key].max"
                      variant="outlined"
                      density="compact"
                      style="max-width: 100px"
                      hide-details
                      @input="onInputScore(item, header.key)"
                    />
                    <span class="d-flex mx-2 justify-center align-center"
                      >/{{ item[header.key].max }}</span
                    >
                  </div>

                  <div v-else-if="header.key === 'name'">
                    {{ item.name }}
                  </div>
                </template>

                <template
                  v-slot:[`item.actions`]="{ item }"
                  v-if="editQuizData"
                >
                  <div class="d-flex">
                    <!-- Show Edit if not currently editing this student -->
                    <v-btn
                      class="mx-2"
                      x-small
                      v-if="!editScoreData"
                      color="#dc0b70"
                      outlined
                      @click="
                        editItemQuiz(item), (editingStudentID = item.studentID)
                      "
                    >
                      <v-icon size="18">mdi-pencil</v-icon>
                      Edit
                    </v-btn>

                    <!-- Show Save if currently editing this student -->
                    <v-btn
                      class="mx-2"
                      x-small
                      v-if="editingStudentID === item.studentID"
                      color="#dc0b70"
                      outlined
                      @click="saveItemQuiz(item)"
                    >
                      Save <v-icon size="18">mdi-arrow-right</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              (quizListDialog = false),
                (editScoreData = false),
                (editQuizData = false),
                (editingStudentID = null)
            "
            v-if="!editQuizData"
          >
            Close
          </v-btn>
          <v-btn
            color="#147452"
            class="white--text"
            v-if="edit"
            @click="editQuizListData()"
          >
            {{ editQuizData == false ? "Edit" : "Return" }}
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
    <teleport to="body">
      <v-alert
        style="
          z-index: 9999;
          position: fixed;
          top: 20px;
          right: 0;
          transform: translateX(-10%);
          background-color: white;
          width: auto;
        "
        v-if="showAlert"
        :type="type"
        variant="tonal"
        border="start"
        border-color="white"
        class="mb-4"
        >{{ message }}
      </v-alert>
    </teleport>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
export default {
  props: {
    data: Object,
    action: String,
  },
  components: {},
  data() {
    return {
      groupBy: [{ key: "name", order: "ASD" }],
      sortBy: [{ key: "name", order: "ASD" }],
      readonly: true,
      dialog: false,
      sub_subject: null,
      gradeData: [],
      newData: [],
      confirmDialog: false,
      savedata: "save",
      quarter: "1st Quarter",
      semester: null,
      gradesDialog: false,
      dinominator: null,
      message: null,
      status: null,
      type: null,
      filter: null,
      userRoleID: null,
      quizListDialog: false,
      studentList: [],
      subSubjectList: [],
      showAlert: false,
      edit: true,
      conflictData: null,
      editQuizData: false,
      editScoreData: false,
      headersMapeh: [
        { title: "Subject", key: "subject_title" },
        { title: "Written Works", key: "ww_weighted" },
        { title: "Performance Task", key: "pt_weighted" },
        { title: "Quarterly Assessment", key: "qa_weighted" },
        { title: "Initial Grade", key: "initial_grade" },
        { title: "Final Grade", key: "transmuted_grade" },
        { title: "Status", key: "status" },
      ],
      activeTab: {
        id: 1,
        name: "For Verification",
        active: true,
      },
      tab: 1,
      tabList: [
        { id: 1, name: "Written Works", active: true },
        { id: 2, name: "Performance Tasks", active: false },
        { id: 3, name: "Quarterly Assessment", active: false },
        // { id: 4, name: "Final Grade", active: false },
      ],
      items: [],
      quizLabels: [],
      headersQuizList: [],
      headers: [
        { title: "Name", align: "start", sortable: false, key: "name" },
        {
          title: "Score",
          align: "center",
          sortable: false,
          key: "quarterScore",
          width: "200",
        },
      ],
      headersGenerated: [
        { title: "Name", align: "start", sortable: false, key: "name" },
        { title: "Status", align: "center", sortable: false, key: "status" },
        {
          title: "Initial Grade",
          align: "end",
          sortable: false,
          key: "initial_grade",
          width: "200",
        },
        {
          title: "Final Grade",
          align: "end",
          sortable: false,
          key: "transmuted_grade",
          width: "80",
        },
      ],
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
          data.grade_level == "Grade 11" || data.grade_level == "Grade 12"
            ? (this.semester = "1st Semester")
            : (this.semester = "Junior High");
          this.subSubjectList =
            data.sub_subject != null ? JSON.parse(data.sub_subject) : [];
          this.sub_subject =
            data.sub_subject != null ? this.subSubjectList[0].id : null;
        }
        this.checkConflict();
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.filter = this.$store.getters.getFilterSelected;
      this.userRoleID = this.$store.state.user.id;
      this.getTaggedStudent();
    },
    onInputScore(item, key) {
      const quiz = item[key];
      if (quiz.value > quiz.max) {
        quiz.value = quiz.max;
      } else if (quiz.value < 0) {
        quiz.value = 0;
      }
    },
    onInputGradeScore(item) {
      if (item.quarterScore > this.dinominator) {
        item.quarterScore = this.dinominator;
      } else if (item.quarterScore < 0) {
        item.quarterScore = 0;
      }
    },
    editQuizListData() {
      this.editQuizData = !this.editQuizData;
    },
    saveItemQuiz(item) {
      let data = {
        data: JSON.stringify(item),
        // attendanceDate: this.formatDate3(this.attendanceDate),
        quarter: this.quarter,
        semester: this.semester,
        // school_yearID: this.filter,
      };
      console.log("saveQuiz", data);
      this.axiosCall(
        "/rooms-section/updateStudentGrade/" + item.studentID,
        "PATCH",
        data
      ).then((res) => {
        console.log(res.data);
        if (res.data.status == 200) {
          this.dialogConfirmSave = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully updated scores!";
          this.quizListDialog = false;
          this.editScoreData = false;
          this.editQuizData = false;
          this.editingStudentID = null;
          // location.reload();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    editItemQuiz(item) {
      // Object.keys(item).forEach((key) => {
      //   if (key.startsWith("Quiz")) {
      //     const quiz = item[key]; // quiz = { id, value }

      //     if (quiz && typeof quiz.value === "string") {
      //       // only update the value, keep id
      //       quiz.value = parseInt(quiz.value.split("/")[0], 10);
      //     }
      //   }
      // });

      this.editScoreData = true;
      console.log("Editing:", item);
    },
    openGeneratedGrade() {
      this.gradesDialog = true;
      let subjectID = this.sub_subject == null ? "noData" : this.sub_subject;
      console.log(this.sub_subject);
      this.axiosCall(
        "/rooms-section/getGeneratedGrade/" +
          this.data.roomId +
          "/" +
          this.filter +
          "/" +
          this.quarter +
          "/" +
          this.semester +
          "/" +
          this.data.subjectId +
          "/" +
          subjectID,
        "GET"
      ).then((res) => {
        console.log("Data Grades", res.data);
        if (res.data) {
          this.gradeData = res.data;
        }
      });
    },
    openQuizList() {
      this.quizListDialog = true;
      if (this.quarter == null) {
        this.type = "info";
        this.message =
          "Please select quarter of semester to view grades, thank you!";
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 3000);
      } else {
        this.axiosCall(
          "/rooms-section/getAllGradeByQuarter/" +
            this.quarter +
            "/" +
            this.semester +
            "/" +
            this.data.roomId +
            "/" +
            this.data.subjectId +
            "/" +
            this.tab +
            "/" +
            this.filter +
            "/" +
            this.sub_subject,
          "GET"
        ).then((res) => {
          console.log("Data Students", res.data);
          // if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          // this.studentList = res.data;
          this.buildTable(res.data);
          // this.edit = false;
          // } else {
          //   this.initialize();
          //   this.edit = true;
          // }
        });
      }
    },
    getColor(grade) {
      if (grade < 80) {
        this.status = "Warning";
        return "warning";
      } else if (grade < 75) {
        this.status = "At-Risk";
        return "error";
      } else {
        this.status = "Passed";
        return "success";
      }
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.changeQuarter();
      // Optional: mark this tab active
      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });

      // ✅ Only reload class record for this tab
    },
    getTaggedStudent() {
      this.axiosCall(
        "/rooms-section/getMyStudentClassRecords/" +
          this.userRoleID +
          "/" +
          this.filter +
          "/" +
          this.data.roomId,
        "GET"
      ).then((res) => {
        console.log("Data Students", res.data);
        if (res.data) {
          this.studentList = res.data;
        }
      });
    },
    buildTable(data) {
      this.headersQuizList = [
        { title: "Name", align: "start", sortable: false, key: "name" },
      ];

      // unique quiz labels
      this.quizLabels = [...new Set(data.map((r) => r.quiz_label))];

      this.quizLabels.forEach((quiz) => {
        const normalizedKey = quiz.replace(/\s+/g, ""); // "Quiz 1" -> "Quiz1"
        this.headersQuizList.push({
          title: quiz, // show "Quiz 1" in header
          align: "center",
          sortable: false,
          key: normalizedKey, // but data key is "Quiz1"
        });
      });

      this.headersQuizList.push({
        title: "Action",
        align: "end",
        sortable: false,
        key: "actions",
        width: 40,
      });

      // build items
      const students = {};
      data.forEach((r) => {
        if (!students[r.SG_studentID]) {
          students[r.SG_studentID] = {
            name: r.name,
            studentID: r.SG_studentID,
            roomID: r.SG_roomID,
            school_yearID: r.SG_school_yearID,
            subjectID: r.SG_subjectID,
          };
        }

        const normalizedKey = r.quiz_label.replace(/\s+/g, ""); // same normalization
        students[r.SG_studentID][normalizedKey] = {
          id: r.SG_id,
          value: r.SG_quarterScore,
          max: r.SG_highest_posible_score,
        };
      });

      this.items = Object.values(students);

      // console.log("Headers:", this.headersQuizList);
      console.log("Items:", this.items);
    },
    checkConflict() {
      this.axiosCall(
        "/rooms-section/getConflictQuarterGrade/" +
          this.semester +
          "/" +
          this.filter +
          "/" +
          this.quarter +
          "/" +
          this.data.roomId +
          "/" +
          this.data.subjectId,
        "GET"
      ).then((res) => {
        if (res.data) {
          this.conflictData = res.data.count_gen;
          console.log("Conflict", res.data.count_gen);

          if (res.data.count_gen == 0) {
            this.edit = true;
          } else {
            this.edit = false;
            this.type = "info";
            this.message =
              "The " +
              this.quarter +
              " is already submited no changes will be added!";
            this.showAlert = true;
            setTimeout(() => (this.showAlert = false), 10000);
          }
        }
      });
    },

    changeQuarter() {
      this.axiosCall(
        "/rooms-section/getConflictQuarterGrade/" +
          this.semester +
          "/" +
          this.filter +
          "/" +
          this.quarter +
          "/" +
          this.data.roomId +
          "/" +
          this.data.subjectId,
        "GET"
      ).then((res) => {
        if (res.data) {
          this.conflictData = res.data.count_gen;

          if (res.data.count_gen == 0) {
            this.edit = true;
          } else {
            this.edit = false;
            this.type = "info";
            this.message =
              "The " +
              this.quarter +
              " is already submited no changes will be added!";
            this.showAlert = true;
            setTimeout(() => (this.showAlert = false), 10000);
          }
        }
      });
    },
    checkAllGrades() {
      return this.studentList.every(
        (student) =>
          student.quarterScore !== null &&
          student.quarterScore !== undefined &&
          student.quarterScore !== ""
      );
    },
    editItem(data) {
      console.log(data);
    },

    save() {
      if (this.quarter == null || this.dinominator == null) {
        this.type = "error";
        this.message = "Please give value on field highest posible score!";
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 3000);
      } else if (!this.checkAllGrades()) {
        this.type = "error";
        this.message =
          "Some student have no score given please check before saving!";
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 5000);
      } else {
        // this.confirmSave();
        this.confirmDialog = true;
      }
    },
    confirmSubmitGrade() {
      if (this.sub_subject != null) {
        this.newData = this.getTransformData(this.gradeData);
        // console.log("New Data", this.newData);
      } else {
        console.log("OldData", this.gradeData);
      }

      if (this.gradeData.length <= 0 || this.newData.length <= 0) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "No data to submit!";
      } else {
        console.log("submitted");
        this.savedata = "submit";
        this.confirmDialog = true;
      }
    },

    getTransformData(data) {
      const transformed = Object.values(
        data.reduce((acc, curr) => {
          const {
            studentID,
            name,
            subject_title,
            studentLRN,
            initial_grade,
            transmuted_grade,
          } = curr;

          if (!acc[studentID]) {
            acc[studentID] = {
              id: studentID,
              studentID: studentID,
              studentLRN,
              name,
              MAPEH: {
                initial_grade: null,
                transmuted_grade: null,
                sub_subjects: {},
              },
            };
          }

          if (subject_title === "MAPEH") {
            acc[studentID].MAPEH.initial_grade = initial_grade;
            acc[studentID].MAPEH.transmuted_grade = transmuted_grade;
          } else if (
            ["Music", "Arts", "Physical Education", "Health"].includes(
              subject_title
            )
          ) {
            acc[studentID].MAPEH.sub_subjects[subject_title] = {
              initial_grade,
              transmuted_grade,
            };
          }

          return acc;
        }, {})
      );

      // console.log(transformed);
      return transformed;
    },
    confirmSubmitGradeToParents() {
      let userId = this.$store.state.user.id;
      let data = {
        data:
          this.sub_subject == null
            ? JSON.stringify(this.gradeData)
            : JSON.stringify(this.newData),
        quarter: this.quarter,
        subjectID: this.data.subjectId,
        semester: this.semester,
        roomID: this.data.roomId,
        school_yearID: this.filter,
        teacherID: userId,
      };
      console.log("Submitttt", data);
      this.axiosCall("/rooms-section/quarterFinalGrade", "POST", data).then(
        (res) => {
          console.log(res);
          if (res.data.status == 201) {
            this.closeD();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },
    confirmSave() {
      let data = {
        data: JSON.stringify(this.studentList),
        quarter: this.quarter,
        subjectID: this.data.subjectId,
        sub_subject: this.sub_subject,
        semester: this.semester,
        highest_posible_score: this.dinominator,
        type: this.tab,
      };
      console.log(data);
      this.axiosCall("/rooms-section/studentGrade", "POST", data).then(
        (res) => {
          console.log(res);
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },
    closeD() {
      eventBus.emit("closeStudentClassRecordDialog", true);
      this.studentList = [];
      this.quarter = "1st Quarter";
      this.dialog = false;
      this.confirmDialog = false;
      this.dinominator = null;
      this.quizListDialog = false;
      this.gradesDialog = false;
      // this.edit = false;
    },
  },
};
</script>
