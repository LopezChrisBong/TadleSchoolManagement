<template>
  <div>
    <!-- MAIN CLASS RECORD DIALOG -->
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
          <v-card-title class="dialog-header d-flex align-center ga-3">
            <div class="header-icon-badge">
              <v-icon icon="mdi-notebook-edit-outline" size="20" />
            </div>
            <div class="d-flex flex-column" style="min-width: 0">
              <span v-if="data" class="header-title text-truncate">
                {{ data.subject_title }} {{ data.grade_level }}
                {{ data.room_section }}
              </span>
              <span class="header-subtitle">Student Class Records</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              density="comfortable"
              class="close-btn"
              @click="closeD()"
            >
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-5">
            <v-container>
              <v-card class="pa-4 mb-4 border" elevation="0" rounded="lg">
                <v-row dense>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-autocomplete
                      v-if="data"
                      v-model="quarter"
                      :items="
                        data.grade_level == 'Grade 11' ||
                        data.grade_level == 'Grade 12'
                          ? ['1st Quarter', '2nd Quarter']
                          : syType == 0
                          ? [
                              '1st Quarter',
                              '2nd Quarter',
                              '3rd Quarter',
                              '4th Quarter',
                            ]
                          : ['1st Term', '2nd Term', '3rd Term']
                      "
                      chips
                      variant="outlined"
                      density="compact"
                      label="Quarter"
                      hide-details
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
                      hide-details
                      @update:modelValue="changeQuarter"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-text-field
                      v-model="dinominator"
                      label="Highest Possible Score"
                      variant="outlined"
                      density="compact"
                      type="number"
                      hide-details
                      color="green"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-text-field
                      v-model="title"
                      label="Title"
                      :maxlength="25"
                      variant="outlined"
                      counter
                      density="compact"
                      hide-details
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
                      hide-details
                      @update:modelValue="changeQuarter"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>

              <v-row>
                <v-col cols="12">
                  <v-card class="pa-3 mb-3 border" elevation="0" rounded="lg">
                    <div
                      class="d-flex align-center flex-wrap ga-2"
                      style="overflow: auto"
                    >
                      <v-tabs
                        v-model="tab"
                        color="blue"
                        density="compact"
                        class="record-tabs"
                      >
                        <v-tab
                          v-for="tabItem in tabList"
                          :key="tabItem.id"
                          :value="tabItem.id"
                          rounded="lg"
                          class="mx-1"
                          @click="changeTab(tabItem)"
                        >
                          {{ tabItem.name }}
                        </v-tab>
                      </v-tabs>

                      <v-spacer></v-spacer>

                      <v-btn
                        color="pink"
                        variant="tonal"
                        size="small"
                        @click="openGeneratedGrade()"
                      >
                        <v-icon size="16" start
                          >mdi-arrow-top-left-bold-box-outline</v-icon
                        >
                        Generate Grade
                      </v-btn>
                      <v-btn
                        color="green"
                        variant="tonal"
                        size="small"
                        class="mx-1"
                        @click="openQuizList()"
                      >
                        <v-icon size="16" start>mdi-eye</v-icon>
                        Quizzes
                      </v-btn>
                      <v-btn
                        variant="tonal"
                        size="small"
                        @click="openStudentsQuiz()"
                        v-if="data ? data.subjectId != 6 : ''"
                      >
                        <v-icon size="16" start>mdi-printer</v-icon>
                        Print
                      </v-btn>
                      <v-btn
                        variant="tonal"
                        size="small"
                        @click="openMAPEHQuiz()"
                        v-else
                      >
                        <v-icon size="16" start>mdi-printer</v-icon>
                        Print
                      </v-btn>
                    </div>
                  </v-card>

                  <v-card class="border" elevation="0" rounded="lg">
                    <v-data-table
                      :headers="tab != 3 ? headers : headers1"
                      :items="studentList"
                      :group-by="[{ key: 'sex', order: 'asc' }]"
                      density="compact"
                      item-key="name"
                      class="records-table"
                    >
                      <template
                        v-slot:group-header="{
                          item,
                          columns,
                          toggleGroup,
                          isGroupOpen,
                        }"
                      >
                        <tr class="group-header-row">
                          <td :colspan="columns.length">
                            <v-btn
                              :icon="
                                isGroupOpen(item)
                                  ? 'mdi-chevron-down'
                                  : 'mdi-chevron-right'
                              "
                              size="x-small"
                              variant="text"
                              @click="toggleGroup(item)"
                            />
                            <v-icon
                              :icon="
                                item.value === 'Male'
                                  ? 'mdi-gender-male'
                                  : 'mdi-gender-female'
                              "
                              :color="item.value === 'Male' ? 'blue' : 'pink'"
                              size="16"
                              class="mx-1"
                            />
                            <span class="font-weight-medium">{{
                              item.value
                            }}</span>
                          </td>
                        </tr>
                      </template>

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
                      <template v-slot:[`item.records`]="{ item }">
                        <div v-if="scoresNeeded(item) == 'Passed'">
                          <v-icon size="28" color="green"
                            >mdi-check-circle</v-icon
                          >
                        </div>
                        <div
                          v-else
                          v-html="scoresNeeded(item)"
                          class="text-caption"
                        ></div>
                      </template>

                      <template #no-data>
                        <div class="py-8 text-center text-medium-emphasis">
                          <v-icon
                            icon="mdi-account-off-outline"
                            size="32"
                            class="mb-2"
                          />
                          <div>No students found.</div>
                        </div>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" variant="outlined" @click="closeD()">
              <v-icon start>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>
            <v-btn color="green" v-if="edit" variant="flat" @click="save()">
              <v-icon start>mdi-check</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- CONFIRM DIALOG -->
    <v-dialog v-model="confirmDialog" persistent max-width="420">
      <v-card rounded="lg" elevation="8">
        <v-card-title class="d-flex align-center text-warning">
          <v-icon class="me-2">mdi-account-alert</v-icon>
          Confirmation
        </v-card-title>

        <v-divider />

        <v-card-text class="text-body-1">
          Are you sure you want to <strong>submit</strong> this grade?
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn variant="outlined" color="grey" @click="confirmDialog = false">
            Cancel
          </v-btn>

          <v-btn
            color="info"
            variant="flat"
            @click="
              savedata === 'save'
                ? confirmSave()
                : confirmSubmitGradeToParents()
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- GENERATED GRADES DIALOG -->
    <v-dialog v-model="gradesDialog" max-width="900" persistent scrollable>
      <v-card>
        <v-card-title class="dialog-header d-flex align-center ga-3">
          <div class="header-icon-badge">
            <v-icon icon="mdi-clipboard-text-outline" size="20" />
          </div>
          <div class="d-flex flex-column" style="min-width: 0">
            <span v-if="data" class="header-title text-truncate">
              {{ data.subject_title }} {{ data.grade_level }}
              {{ data.room_section }}
            </span>
            <span class="header-subtitle">Student Grade</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            density="comfortable"
            class="close-btn"
            @click="
              gradesDialog = false;
              gradeData = [];
            "
          >
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headersGenerated"
                :items="gradeData"
                :group-by="[{ key: 'sex', order: 'asc' }]"
                density="comfortable"
                class="records-table"
                v-if="sub_subject == null"
              >
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip
                    :color="getColor(item.transmuted_grade)"
                    size="small"
                    variant="flat"
                  >
                    <span class="text-white">
                      {{
                        item.transmuted_grade >= 80
                          ? 'Passed'
                          : item.transmuted_grade >= 75
                          ? 'Warning'
                          : 'At-Risk'
                      }}
                    </span>
                  </v-chip>
                </template>
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
                density="comfortable"
                class="records-table"
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
                    :color="getColor(item.transmuted_grade)"
                    size="small"
                    variant="flat"
                  >
                    <span class="text-white">
                      {{
                        item.transmuted_grade >= 80
                          ? 'Passed'
                          : item.transmuted_grade >= 75
                          ? 'Warning'
                          : 'At-Risk'
                      }}
                    </span>
                  </v-chip>
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
            variant="outlined"
            @click="
              gradesDialog = false;
              gradeData = [];
            "
          >
            Close
          </v-btn>
          <v-btn
            color="#147452"
            variant="flat"
            class="text-white"
            v-if="edit"
            @click="confirmSubmitGrade()"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- QUIZ LIST DIALOG -->
    <v-dialog v-model="quizListDialog" fullscreen eager scrollable>
      <v-card>
        <v-card-title class="dialog-header d-flex align-center ga-3">
          <div class="header-icon-badge">
            <v-icon icon="mdi-clipboard-list-outline" size="20" />
          </div>
          <div class="d-flex flex-column" style="min-width: 0">
            <span v-if="data" class="header-title text-truncate">
              {{ data.subject_title }} {{ data.grade_level }}
              {{ data.room_section }}
            </span>
            <span class="header-subtitle">
              Student Quizzes ({{
                tab == 1
                  ? 'Written Works'
                  : tab == 2
                  ? 'Performance Task'
                  : 'Periodic Assessment'
              }})
            </span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            density="comfortable"
            class="close-btn"
            @click="
              (quizListDialog = false),
                (editScoreData = false),
                (editQuizData = false),
                (editingStudentID = null)
            "
          >
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-card class="border" elevation="0" rounded="lg">
                <v-data-table
                  :headers="headersQuizList"
                  :items="items"
                  :group-by="[{ key: 'sex', order: 'asc' }]"
                  density="comfortable"
                  class="records-table"
                >
                  <template
                    v-slot:group-header="{
                      item,
                      columns,
                      toggleGroup,
                      isGroupOpen,
                    }"
                  >
                    <tr class="group-header-row">
                      <td :colspan="columns.length">
                        <v-btn
                          :icon="
                            isGroupOpen(item)
                              ? 'mdi-chevron-down'
                              : 'mdi-chevron-right'
                          "
                          size="x-small"
                          variant="text"
                          @click="toggleGroup(item)"
                        />
                        <v-icon
                          :icon="
                            item.value === 'Male'
                              ? 'mdi-gender-male'
                              : 'mdi-gender-female'
                          "
                          :color="item.value === 'Male' ? 'blue' : 'pink'"
                          size="16"
                          class="mx-1"
                        />
                        <span class="font-weight-medium">{{ item.value }}</span>
                      </td>
                    </tr>
                  </template>

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
                      <span class="d-flex mx-2 justify-center align-center">
                        /{{ item[header.key].max }}
                      </span>
                    </div>

                    <div v-else-if="header.key === 'name'">
                      {{ item.name }}
                    </div>
                  </template>

                  <template
                    v-slot:[`item.actions`]="{ item }"
                    v-if="editQuizData"
                  >
                    <div class="d-flex justify-center">
                      <v-tooltip
                        text="Edit"
                        location="top"
                        v-if="!editScoreData"
                      >
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-pencil"
                            size="small"
                            variant="text"
                            color="pink"
                            @click="
                              editItemQuiz(item),
                                (editingStudentID = item.studentID)
                            "
                          />
                        </template>
                      </v-tooltip>

                      <v-tooltip
                        text="Save"
                        location="top"
                        v-if="editingStudentID === item.studentID"
                      >
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-content-save-outline"
                            size="small"
                            variant="text"
                            color="pink"
                            @click="saveItemQuiz(item)"
                          />
                        </template>
                      </v-tooltip>
                    </div>
                  </template>

                  <template #no-data>
                    <div class="py-8 text-center text-medium-emphasis">
                      <v-icon
                        icon="mdi-clipboard-off-outline"
                        size="32"
                        class="mb-2"
                      />
                      <div>No quiz data found.</div>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            variant="outlined"
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
            variant="flat"
            color="#147452"
            class="text-white"
            v-if="edit"
            @click="editQuizListData()"
          >
            {{ editQuizData == false ? 'Edit' : 'Return' }}
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
import eventBus from '@/eventBus';

export default {
  props: {
    data: Object,
    action: String,
  },
  data() {
    return {
      // 'ASD' isn't a valid sort order for Vuetify's data-table (it expects
      // 'asc' / 'desc'), so grouping/sorting on the MAPEH table was likely
      // silently ignoring this and falling back to default order.
      groupBy: [{ key: 'name', order: 'asc' }],
      sortBy: [{ key: 'name', order: 'asc' }],
      readonly: true,
      dialog: false,
      syType: null,
      sub_subject: null,
      gradeData: [],
      newData: [],
      confirmDialog: false,
      title: null,
      savedata: 'save',
      quarter: '',
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
      decisionData: [],
      headersMapeh: [
        { title: 'Subject', key: 'subject_title' },
        { title: 'Written Works', key: 'ww_weighted' },
        { title: 'Performance Task', key: 'pt_weighted' },
        { title: 'Periodic Assessment', key: 'qa_weighted' },
        { title: 'Initial Grade', key: 'initial_grade' },
        { title: 'Final Grade', key: 'transmuted_grade' },
        { title: 'Status', key: 'status' },
      ],
      activeTab: {
        id: 1,
        name: 'For Verification',
        active: true,
      },
      tab: 1,
      tabList: [
        { id: 1, name: 'Written Works', active: true },
        { id: 2, name: 'Performance Tasks', active: false },
        { id: 3, name: 'Periodic Assessment', active: false },
      ],
      items: [],
      quizLabels: [],
      headersQuizList: [],
      headers: [
        { title: 'Name', align: 'start', sortable: false, key: 'name' },
        { title: 'LRN', align: 'center', sortable: false, key: 'lrnNo' },
        {
          title: 'Score',
          align: 'center',
          sortable: false,
          key: 'quarterScore',
          width: '200',
        },
      ],
      headers1: [
        { title: 'Name', align: 'start', sortable: false, key: 'name' },
        {
          title: 'Recommendation',
          align: 'center',
          sortable: false,
          key: 'records',
        },
        {
          title: 'Score',
          align: 'center',
          sortable: false,
          key: 'quarterScore',
          width: '200',
        },
      ],
      headersGenerated: [
        { title: 'Name', align: 'start', sortable: false, key: 'name' },
        { title: 'Status', align: 'center', sortable: false, key: 'status' },
        {
          title: 'Initial Grade',
          align: 'end',
          sortable: false,
          key: 'initial_grade',
          width: '200',
        },
        {
          title: 'Final Grade',
          align: 'end',
          sortable: false,
          key: 'transmuted_grade',
          width: '80',
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
    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        if (data.id) {
          data.grade_level == 'Grade 11' || data.grade_level == 'Grade 12'
            ? (this.semester = '1st Semester')
            : (this.semester = 'Junior High');
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
      this.syType = this.$store.getters.getSyType;
      this.quarter = this.syType == 0 ? '1st Quarter' : '1st Term';
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
        quarter: this.quarter,
        semester: this.semester,
      };
      this.axiosCall(
        '/rooms-section/updateStudentGrade/' + item.studentID,
        'PATCH',
        data,
      ).then((res) => {
        if (res.data.status == 200) {
          this.dialogConfirmSave = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = 'Successfully updated scores!';
          this.quizListDialog = false;
          this.editScoreData = false;
          this.editQuizData = false;
          this.editingStudentID = null;
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    editItemQuiz(item) {
      this.editScoreData = true;
      console.log('Editing:', item);
    },
    openGeneratedGrade() {
      this.gradesDialog = true;
      let subjectID = this.sub_subject == null ? 'noData' : this.sub_subject;
      this.axiosCall(
        '/rooms-section/getGeneratedGrade/' +
          this.data.roomId +
          '/' +
          this.filter +
          '/' +
          this.quarter +
          '/' +
          this.semester +
          '/' +
          this.data.subjectId +
          '/' +
          subjectID,
        'GET',
      ).then((res) => {
        if (res.data) {
          this.gradeData = res.data;
        }
      });
    },
    openQuizList() {
      this.quizListDialog = true;
      if (this.quarter == null) {
        this.type = 'info';
        this.message =
          'Please select quarter of semester to view grades, thank you!';
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 3000);
      } else {
        this.axiosCall(
          '/rooms-section/getAllGradeByQuarter/' +
            this.quarter +
            '/' +
            this.semester +
            '/' +
            this.data.roomId +
            '/' +
            this.data.subjectId +
            '/' +
            this.tab +
            '/' +
            this.filter +
            '/' +
            this.sub_subject,
          'GET',
        ).then((res) => {
          this.buildTable(res.data);
        });
      }
    },
    // Now matches the >=80 / >=75 / below-75 thresholds used everywhere
    // else in this file (the status chip text, the SF9 logic). Previously
    // `grade < 80` was checked first, so `grade < 75` never fired and
    // every failing grade showed as 'warning' instead of 'error'.
    getColor(grade) {
      if (grade < 75) {
        this.status = 'At-Risk';
        return 'error';
      } else if (grade < 80) {
        this.status = 'Warning';
        return 'warning';
      } else {
        this.status = 'Passed';
        return 'success';
      }
    },
    changeTab(tabItem) {
      this.activeTab = tabItem;
      this.tab = tabItem.id;
      this.changeQuarter();
      this.tabList.forEach((t) => {
        t.active = t.id === tabItem.id;
      });
      if (tabItem.id == 3) {
        this.decisionSupport();
      }
    },

    getTaggedStudent() {
      this.axiosCall(
        '/rooms-section/getMyStudentClassRecords/' +
          this.userRoleID +
          '/' +
          this.filter +
          '/' +
          this.data.roomId,
        'GET',
      ).then((res) => {
        if (res.data) {
          this.studentList = res.data;
        }
      });
    },
    buildTable(data) {
      this.headersQuizList = [
        { title: 'Name', align: 'start', sortable: false, key: 'name' },
      ];

      this.quizLabels = [...new Set(data.map((r) => r.quiz_label))];

      this.quizLabels.forEach((quiz) => {
        const normalizedKey = quiz.replace(/\s+/g, '');
        const quizRecord = data.find((r) => r.quiz_label === quiz);

        this.headersQuizList.push({
          title: quizRecord?.SG_title?.trim() ? quizRecord.SG_title : quiz,
          align: 'center',
          sortable: false,
          key: normalizedKey,
        });
      });

      this.headersQuizList.push({
        title: 'Action',
        align: 'end',
        sortable: false,
        key: 'actions',
        width: 40,
      });

      const students = {};
      data.forEach((r) => {
        if (!students[r.SG_studentID]) {
          students[r.SG_studentID] = {
            name: r.name,
            studentID: r.SG_studentID,
            sex: r.SG_sex,
            roomID: r.SG_roomID,
            school_yearID: r.SG_school_yearID,
            subjectID: r.SG_subjectID,
          };
        }

        const normalizedKey = r.quiz_label.replace(/\s+/g, '');

        students[r.SG_studentID][normalizedKey] = {
          id: r.SG_id,
          value: r.SG_quarterScore,
          max: r.SG_highest_posible_score,
        };
      });

      this.items = Object.values(students);
    },
    checkConflict() {
      this.axiosCall(
        '/rooms-section/getConflictQuarterGrade/' +
          this.semester +
          '/' +
          this.filter +
          '/' +
          this.quarter +
          '/' +
          this.data.roomId +
          '/' +
          this.data.subjectId,
        'GET',
      ).then((res) => {
        if (res.data) {
          this.conflictData = res.data.count_gen;

          if (res.data.count_gen == 0) {
            this.edit = true;
          } else {
            this.edit = false;
            this.type = 'info';
            this.message =
              'The ' +
              this.quarter +
              ' is already submited no changes will be added!';
            this.showAlert = true;
            setTimeout(() => (this.showAlert = false), 10000);
          }
        }
      });
    },

    changeQuarter() {
      this.axiosCall(
        '/rooms-section/getConflictQuarterGrade/' +
          this.semester +
          '/' +
          this.filter +
          '/' +
          this.quarter +
          '/' +
          this.data.roomId +
          '/' +
          this.data.subjectId,
        'GET',
      ).then((res) => {
        if (res.data) {
          this.conflictData = res.data.count_gen;

          if (res.data.count_gen == 0) {
            this.edit = true;
          } else {
            this.edit = false;
            this.type = 'info';
            this.message =
              'The ' +
              this.quarter +
              ' is already submited no changes will be added!';
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
          student.quarterScore !== '',
      );
    },
    editItem(data) {
      console.log(data);
    },

    save() {
      if (this.quarter == null || this.dinominator == null) {
        this.type = 'error';
        this.message = 'Please give value on field highest posible score!';
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 3000);
      } else if (!this.checkAllGrades()) {
        // this.type = 'error';
        // this.message =
        //   'Some student have no score given please check before saving!';
        // this.showAlert = true;
        // setTimeout(() => (this.showAlert = false), 5000);
        this.studentList.forEach((student) => {
          if (
            student.quarterScore === null ||
            student.quarterScore === undefined ||
            student.quarterScore === ''
          ) {
            student.quarterScore = 0;
          }
        });

        this.studentList.every(
          (student) =>
            student.quarterScore !== null && student.quarterScore !== undefined,
        );

        this.confirmDialog = true;
      } else {
        this.confirmDialog = true;
      }
    },
    confirmSubmitGrade() {
      if (this.sub_subject != null) {
        this.newData = this.getTransformData(this.gradeData);
      }

      if (this.gradeData.length <= 0 && this.newData.length <= 0) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = 'error';
        this.fadeAwayMessage.header = 'System Message';
        this.fadeAwayMessage.message = 'No data to submit!';
      } else {
        this.savedata = 'submit';
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

          if (subject_title === 'MAPEH') {
            acc[studentID].MAPEH.initial_grade = initial_grade;
            acc[studentID].MAPEH.transmuted_grade = transmuted_grade;
          } else if (
            ['Music', 'Arts', 'Physical Education', 'Health'].includes(
              subject_title,
            )
          ) {
            acc[studentID].MAPEH.sub_subjects[subject_title] = {
              initial_grade,
              transmuted_grade,
            };
          }

          return acc;
        }, {}),
      );

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
      this.axiosCall('/rooms-section/quarterFinalGrade', 'POST', data).then(
        (res) => {
          if (res.data.status == 201) {
            this.closeD();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'error';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
          }
        },
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
        title: this.title,
      };
      this.axiosCall('/rooms-section/studentGrade', 'POST', data).then(
        (res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
            this.confirmDialog = false;
            this.getTaggedStudent();
            this.dinominator = null;
            if (this.tab != 4) {
              this.closeD();
            }
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'error';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
          }
        },
      );
    },
    closeD() {
      eventBus.emit('closeStudentClassRecordDialog', true);

      this.studentList = [];
      this.quarter = '1st Quarter';
      this.dialog = false;
      this.confirmDialog = false;
      this.dinominator = null;
      this.quizListDialog = false;
      this.gradesDialog = false;

      this.tab = 1;
      this.activeTab = {
        id: 1,
        name: 'For Verification',
        active: true,
      };

      this.tabList = this.tabList.map((tabItem) => ({
        ...tabItem,
        active: tabItem.id === 1,
      }));
    },
    decisionSupport() {
      let subjectID = this.sub_subject == null ? 'noData' : this.sub_subject;
      this.axiosCall(
        '/rooms-section/getGeneratedGrade/' +
          this.data.roomId +
          '/' +
          this.filter +
          '/' +
          this.quarter +
          '/' +
          this.semester +
          '/' +
          this.data.subjectId +
          '/' +
          subjectID,
        'GET',
      ).then((res) => {
        if (res.data) {
          this.decisionData = res.data;
        }
      });
    },
    scoresNeeded(rec) {
      const record = this.decisionData.find((d) => d.studentID === rec.id);
      let remaining = 62 - record?.initial_grade;
      let weight = this.data.writen_works / 100;
      let highest = this.dinominator;

      let grade = (remaining / weight) * (highest / 100);

      if (remaining <= 0) {
        return 'Passed';
      }
      return `Student is below 75<br>
        Suggested score needed: ${grade.toFixed(0)} / ${this.dinominator}`;
    },
    openStudentsQuiz() {
      window.open(
        process.env.VUE_APP_SERVER +
          '/pdf-generator/getStudentSQuizes/' +
          this.quarter +
          '/' +
          this.semester +
          '/' +
          this.data.roomId +
          '/' +
          this.data.subjectId +
          '/' +
          this.filter +
          '/' +
          this.sub_subject +
          '/' +
          this.userRoleID +
          '',
        '_blank',
      );
    },
    openMAPEHQuiz() {
      window.open(
        process.env.VUE_APP_SERVER +
          '/pdf-generator/getMAPEHQuizes/' +
          this.quarter +
          '/' +
          this.semester +
          '/' +
          this.data.roomId +
          '/' +
          this.data.subjectId +
          '/' +
          this.filter +
          '/' +
          this.sub_subject +
          '/' +
          this.userRoleID +
          '',
        '_blank',
      );
    },
  },
};
</script>

<style scoped>
.dialog-header {
  background: linear-gradient(135deg, #ad1457, #e35e93);
  color: white;
  padding: 16px 20px;
}

.header-icon-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-title {
  font-weight: 700;
  font-size: 15px;
  text-transform: uppercase;
}

.header-subtitle {
  font-size: 12px;
  opacity: 0.85;
}

.close-btn {
  flex-shrink: 0;
}

.v-card.border {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.record-tabs :deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
}

.record-tabs :deep(.v-tab--selected) {
  background: #bbdefb;
  color: #1565c0 !important;
}

.records-table :deep(thead th) {
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
  padding: 6px 12px !important;
}
</style>
