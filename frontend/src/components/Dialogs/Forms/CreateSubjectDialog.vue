<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="900px">
      <v-form ref="AddSubjectDialog" @submit.prevent>
        <v-card rounded="xl">
          <!-- Header -->
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 font-weight-bold">{{ action }} Subject</div>
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
            <v-row>
              <v-col cols="12" :md="grade_level == 'Senior High' ? '6' : '12'">
                <v-text-field
                  v-model="subject_title"
                  label="Subject Title"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12" md="6" v-if="grade_level == 'Junior High'">
                <v-autocomplete
                  v-model="grade_level"
                  :items="seniorJuniorList"
                  label="Junior High"
                  variant="outlined"
                  density="compact"
                  readonly
                ></v-autocomplete>
              </v-col> -->
              <v-col cols="12" md="6" v-if="grade_level == 'Senior High'">
                <v-autocomplete
                  v-model="semester"
                  :items="['First Semester', 'Second Semester']"
                  label="Semester"
                  variant="outlined"
                  density="compact"
                ></v-autocomplete
              ></v-col>
              <v-col cols="12" md="6" v-if="grade_level == 'Senior High'">
                <v-autocomplete
                  v-model="senior_level"
                  :items="['Grade 11', 'Grade 12']"
                  label="Grade Level"
                  variant="outlined"
                  density="compact"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="grade_level == 'Senior High'">
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
              <v-col cols="12" md="6" v-if="grade_level == 'Senior High'">
                <v-card
                  variant="outlined"
                  rounded="lg"
                  class="pa-2 d-flex justify-space-between align-center"
                >
                  <div>
                    <div class="font-weight-medium">Subject Specialized</div>
                    <div class="text-caption text-grey">
                      Subject specified only for specific strand
                    </div>
                  </div>

                  <v-switch
                    v-model="isSpecialized"
                    true-value="1"
                    false-value="0"
                    inset
                    color="primary"
                    hide-details
                  />
                </v-card>
              </v-col>
              <v-col
                cols="12"
                md="6"
                v-if="isSpecialized == 1 && grade_level == 'Senior High'"
              >
                <v-autocomplete
                  v-model="strandID"
                  :items="stranDataList"
                  label="Strand"
                  variant="outlined"
                  density="compact"
                  item-value="id"
                  item-title="strand_name"
                ></v-autocomplete>
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
              variant="flat"
              class="white--text"
              v-if="action == 'Add'"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#e35e93"
              variant="flat"
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
      isSpecialized: false,
      writenWorks: null,
      semester: null,
      senior_level: null,
      performanceTask: null,
      quarterAssessment: null,
      subSubjectList: [],
      statusList: [
        { id: 1, description: 'Elementary' },
        { id: 2, description: 'High School' },
      ],
      juniorList: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
      seniorList: ['Grade 11', 'Grade 12'],
      seniorJunior: null,
      grade_level: null,
      subject_title: null,
      seniorJuniorList: ['Junior High', 'Senior High'],
      unit_departmentlist: [],
      indicatorList: ['CORE', 'APPLIED', 'SPECIALIZED'],
      indicator: null,
      strandID: null,
      updateID: null,
      tempSelectedDays: [],
      dialog: false,
      stranDataList: [],
      yearSelection: [],
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
        console.log('View Data', data);
        if (data.id) {
          this.initialize();
          this.updateID = data.id;
          this.subject_title = data.subject_title;
          this.seniorJunior = data.seniorJunior;
          this.indicator = data.indicator;
          this.semester = data.semester;
          this.senior_level = data.senior_level;
          this.grade_level = data.grade_level;
          this.strandID = data.strandID;
          this.isSpecialized = data.isSpecialized.toString();
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
          this.grade_level = data[0].tab == 1 ? 'Junior High' : 'Senior High';
          this.initialize();
          this.subject_title = data.subject_title;
          this.seniorJunior = data.seniorJunior;
          this.semester = null;
          this.senior_level = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.loadYearSelection();
      this.getAllStrand();
    },
    loadYearSelection() {
      let d = new Date();

      for (let i = parseInt(d.getFullYear()); i >= 2021; i--) {
        this.yearSelection.push(i);
      }
    },
    closeD() {
      eventBus.emit('closeAddSubjectDialog', false);
      this.subSubjectList = [];
      this.dialog = false;
    },
    editItem() {
      const newId = this.subSubjectList.length
        ? Math.max(...this.subSubjectList.map((item) => item.id)) + 1
        : 1;

      this.subSubjectList.push({ id: newId, description: '' });
    },
    deleteSub(item) {
      this.subSubjectList = this.subSubjectList.filter((i) => i.id !== item.id);
    },
    checkConflict(type) {
      console.log(type, this.subSubjectList);
      if (type == 'ADD') {
        if (
          this.subject_title == null ||
          this.grade_level == null ||
          this.writenWorks == null ||
          this.performanceTask == null ||
          this.quarterAssessment == null
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = 'Please fill all fields';
        } else {
          let data = {
            subject_title: this.subject_title,
            indicator: this.indicator,
            sub_subject: JSON.stringify(this.subSubjectList),
            grade_level: this.grade_level,
            writen_works: this.writenWorks,
            performance_task: this.performanceTask,
            quarter_assessment: this.quarterAssessment,
            semester: this.semester,
            senior_level: this.senior_level,
            isSpecialized: this.isSpecialized,
            strandID: this.strandID,
          };
          console.log(data);
          this.axiosCall('/subjects', 'POST', data).then((res) => {
            console.log(res.data);
            this.closeD();
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'success';
              this.fadeAwayMessage.header = 'System Message';
              this.fadeAwayMessage.message = 'Successfully Added Subject!';
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'error';
              this.fadeAwayMessage.header = 'System Message';
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        }
      } else if (type == 'UPDATE') {
        // alert("UPDATED");
        if (
          this.subject_title == null ||
          this.grade_level == null ||
          this.writenWorks == null ||
          this.performanceTask == null ||
          this.quarterAssessment == null
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = 'Please fill all fields';
        } else {
          let data = {
            subject_title: this.subject_title,
            grade_level: this.grade_level,
            writen_works: this.writenWorks,
            indicator: this.indicator,
            sub_subject: JSON.stringify(this.subSubjectList),
            performance_task: this.performanceTask,
            quarter_assessment: this.quarterAssessment,
            semester: this.semester,
            senior_level: this.senior_level,
            isSpecialized: this.isSpecialized,
            strandID: this.strandID,
          };
          console.log(data);
          this.axiosCall('/subjects/' + this.updateID, 'PATCH', data).then(
            (res) => {
              if (res.data.status == 201) {
                this.closeD();
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = 'success';
                this.fadeAwayMessage.header = 'System Message';
                this.fadeAwayMessage.message = 'Successfully updated!!';

                // location.reload();
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = 'error';
                this.fadeAwayMessage.header = 'System Message';
                this.fadeAwayMessage.message = res.data.msg;
              }
            },
          );
        }
      }
    },
    getAllStrand() {
      this.axiosCall('/rooms-section/AllStrand/Data/strand', 'GET').then(
        (res) => {
          if (res) {
            this.stranDataList = res.data;
          }
        },
      );
    },
  },
};
</script>
