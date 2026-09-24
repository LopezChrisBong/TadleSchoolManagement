<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable fullscreen>
      <v-form ref="MyChildrenGrade" @submit.prevent>
        <v-card>
          <v-card-title
            class="d-flex dialog-header justify-center align-center"
          >
            <span v-if="data">{{ action }} {{ data.name }} Class Record </span>
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
              <v-col cols="12">
                <!-- Junior High Table -->
                <template v-if="isJunior">
                  <div class="text-center font-weight-bold mb-4">
                    REPORT ON LEARNING PROGRESS AND ACHIEVEMENT
                  </div>
                  <!-- <div class="mb-2">
                    Student Name: <u>{{ data.name }}</u>
                  </div> -->

                  <v-data-table
                    :headers="
                      syType == 0 ||
                      this.data.grade_level == 'Grade 11' ||
                      this.data.grade_level == 'Grade 12'
                        ? juniorHeaders
                        : juniortermHeaders
                    "
                    :items="
                      syType == 0 ||
                      this.data.grade_level == 'Grade 11' ||
                      this.data.grade_level == 'Grade 12'
                        ? juniorData
                        : juniorTermData
                    "
                    item-key="subject"
                    class="elevation-1"
                  >
                    <template v-slot:[`item.remarks`]="{ item }">
                      <span
                        :style="{
                          color: item.remarks === 'Passed' ? 'green' : 'red',
                        }"
                      >
                        {{ item.remarks }}
                      </span>
                    </template>

                    <!-- Footer for General Average -->
                    <template v-slot:bottom>
                      <tr class="mt-5 ml-5 mb-2">
                        <td colspan="5" class="text-right font-weight-bold">
                          General Average:
                        </td>
                        <td class="text-center">
                          <b>{{
                            syType == 0 ||
                            this.data.grade_level == 'Grade 11' ||
                            this.data.grade_level == 'Grade 12'
                              ? calculateGeneralAverage(juniorData)
                              : calculateGeneralAverage(juniorTermData)
                          }}</b>
                        </td>
                        <td></td>
                      </tr>
                    </template>
                  </v-data-table>
                </template>

                <!-- Senior High Tables -->
                <template v-else>
                  <div v-if="firstSemData.length">
                    <!-- First Sem -->
                    <v-card class="elevation-1 mb-3">
                      <div class="text-center font-weight-bold my-4">
                        REPORT ON LEARNING PROGRESS AND ACHIEVEMENT 1ST SEMESTER
                      </div>
                      <v-data-table
                        :headers="semHeaders"
                        :items="firstSemData"
                        item-key="subject"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.remarks`]="{ item }">
                          <span
                            :style="{
                              color:
                                item.remarks === 'Passed' ? 'green' : 'red',
                            }"
                          >
                            {{ item.remarks }}
                          </span>
                        </template>

                        <!-- Footer for General Average -->
                        <template v-slot:bottom>
                          <tr>
                            <td colspan="3" class="text-right font-weight-bold">
                              General Average:
                            </td>
                            <td class="text-center">
                              <b>{{ calculateGeneralAverage(firstSemData) }}</b>
                            </td>
                            <td></td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-card>

                    <!-- Second Sem -->
                    <v-card class="elevation-1">
                      <div class="text-center font-weight-bold my-4">
                        REPORT ON LEARNING PROGRESS AND ACHIEVEMENT 2ND SEMESTER
                      </div>
                      <v-data-table
                        :headers="semHeaders"
                        :items="secondSemData"
                        item-key="subject"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.remarks`]="{ item }">
                          <span
                            :style="{
                              color:
                                item.remarks === 'Passed' ? 'green' : 'red',
                            }"
                          >
                            {{ item.remarks }}
                          </span>
                        </template>

                        <!-- Footer for General Average -->
                        <template v-slot:bottom>
                          <tr>
                            <td colspan="3" class="text-right font-weight-bold">
                              General Average:
                            </td>
                            <td class="text-center">
                              <b>{{
                                calculateGeneralAverage(secondSemData)
                              }}</b>
                            </td>
                            <td></td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-card>
                  </div>
                  <div v-else>
                    <v-empty-state
                      icon="mdi-account-off"
                      title="Student not yet graded for this school year"
                      text="Please contact the school if the grades for the specific semester or school year have already been submitted."
                    />
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="blue" outlined @click="acknowledgeGrade()">
              <v-icon>mdi-file-chart-check-outline</v-icon>
              Acknowledge Grade
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- Acknowledgment Dialog -->
    <v-dialog v-model="ackDialog" max-width="520" persistent>
      <v-card>
        <v-card-title class="d-flex align-center dialog-header">
          <v-icon class="mr-2">mdi-file-chart-check-outline</v-icon>
          Grade Acknowledgment
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-select
            v-model="selectedPeriod"
            :items="periods"
            label="Grading Period"
            density="compact"
            hide-details
            class="mb-4"
          />
          <v-select
            v-if="
              data?.grade_level == 'Grade 11' || data?.grade_level == 'Grade 12'
            "
            v-model="semester"
            :items="['First Sem', 'Second Sem']"
            label="Semester"
            density="compact"
            hide-details
            class="mb-4"
          />

          <v-table density="compact" class="mb-4">
            <thead>
              <tr>
                <th>Subject</th>
                <th class="text-right">Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in studentGrade.juniorHigh" :key="i">
                <td>{{ row.subject }}</td>
                <td class="text-right">{{ row[selectedPeriod] ?? '—' }}</td>
              </tr>
            </tbody>
            <tbody
              v-if="
                data?.grade_level == 'Grade 11' ||
                (data?.grade_level == 'Grade 12' && semester == 'First Sem')
              "
            >
              <tr v-for="(row, i) in studentGrade.seniorHigh.firstSem" :key="i">
                <td>{{ row.subject }}</td>
                <td class="text-right">{{ row[selectedPeriod] ?? '—' }}</td>
              </tr>
            </tbody>
            <tbody
              v-if="
                data?.grade_level == 'Grade 11' ||
                (data?.grade_level == 'Grade 12' && semester == 'Second Sem')
              "
            >
              <tr
                v-for="(row, i) in studentGrade.seniorHigh.secondSem"
                :key="i"
              >
                <td>{{ row.subject }}</td>
                <td class="text-right">{{ row[selectedPeriod] ?? '—' }}</td>
              </tr>
            </tbody>
          </v-table>

          <div class="font-weight-bold mb-4">
            {{ selectedPeriod }} Average:
            {{
              syType == 0 ||
              this.data.grade_level == 'Grade 11' ||
              this.data.grade_level == 'Grade 12'
                ? periodAverageQuarter
                : periodAverage
            }}
          </div>

          <v-divider class="mb-4" />

          <div class="font-weight-bold mb-2">Parent Acknowledgment</div>

          <v-checkbox
            v-model="ack1"
            density="compact"
            hide-details
            class="mb-2"
          >
            <template #label>
              <span>
                I acknowledge that I have reviewed my child's grades for
                <strong>{{ selectedPeriod }}</strong> and understand the
                academic results displayed above.
              </span>
            </template>
          </v-checkbox>

          <v-checkbox v-model="ack2" density="compact" hide-details>
            <template #label>
              <span>
                I confirm that the grades shown are the grades I received for
                review and I am ready to provide my electronic signature for
                this grading period.
              </span>
            </template>
          </v-checkbox>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeAckDialog()">Cancel</v-btn>
          <v-btn
            color="blue"
            :disabled="!(ack1 && ack2)"
            :loading="submitting"
            @click="submitAcknowledgment()"
          >
            Confirm & Sign
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
  emits: ['acknowledged'],
  data() {
    return {
      semester: 'First Sem',
      updateID: null,
      dialog: false,
      items: [],
      syType: null,
      ackDialog: false,
      ack1: false,
      ack2: false,
      submitting: false,
      quarterAverage: null,
      selectedPeriod: null,
      currentDate: new Date(),
      studentGrade: [],
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Added!',
        message: '',
        top: 10,
      },
    };
  },

  computed: {
    periods() {
      return this.syType === 0 ||
        this.data.grade_level == 'Grade 11' ||
        this.data.grade_level == 'Grade 12'
        ? this.quarterArray()
        : this.termArray();
    },
    periodAverage() {
      const grades = this.studentGrade.juniorHigh
        .map((row) => row[this.selectedPeriod])
        .filter((g) => g !== null && g !== undefined && g !== '')
        .map(Number);

      if (!grades.length) return 'XX';

      const avg = grades.reduce((sum, g) => sum + g, 0) / grades.length;
      return avg.toFixed(2);
    },
    periodAverageQuarter() {
      if (this.semester == 'First Sem') {
        const grades = this.studentGrade.seniorHigh.firstSem
          .map((row) => row[this.selectedPeriod])
          .filter((g) => g !== null && g !== undefined && g !== '')
          .map(Number);

        if (!grades.length) return 'XX';

        const avg = grades.reduce((sum, g) => sum + g, 0) / grades.length;
        return avg.toFixed(2);
      } else {
        const grades = this.studentGrade.seniorHigh.secondSem
          .map((row) => row[this.selectedPeriod])
          .filter((g) => g !== null && g !== undefined && g !== '')
          .map(Number);

        if (!grades.length) return 'XX';

        const avg = grades.reduce((sum, g) => sum + g, 0) / grades.length;
        return avg.toFixed(2);
      }
    },
    isJunior() {
      return !!this.studentGrade.juniorHigh;
    },
    juniorData() {
      if (!this.studentGrade.juniorHigh) return [];
      return this.studentGrade.juniorHigh.map((row) => ({
        subject: row.subject,
        '1st Quarter': row['1st Quarter'] ?? '-',
        '2nd Quarter': row['2nd Quarter'] ?? '-',
        '3rd Quarter': row['3rd Quarter'] ?? '-',
        '4th Quarter': row['4th Quarter'] ?? '-',
        finalGrade: row.finalGrade ?? '-',
        remarks: row.remarks ?? '-',
      }));
    },

    juniorTermData() {
      if (!this.studentGrade.juniorHigh) return [];
      return this.studentGrade.juniorHigh.map((row) => ({
        subject: row.subject,
        '1st Term': row['1st Term'] ?? '-',
        '2nd Term': row['2nd Term'] ?? '-',
        '3rd Term': row['3rd Term'] ?? '-',
        finalGrade: row.finalGrade ?? '-',
        remarks: row.remarks ?? '-',
      }));
    },

    firstSemData() {
      return (
        this.studentGrade.seniorHigh?.firstSem?.map((row) => ({
          subject: row.subject,
          '1st Quarter': row['1st Quarter'] ?? '-',
          '2nd Quarter': row['2nd Quarter'] ?? '-',
          finalGrade: row.finalGrade ?? '-',
          remarks: row.remarks ?? '-',
        })) ?? []
      );
    },

    secondSemData() {
      return (
        this.studentGrade.seniorHigh?.secondSem?.map((row) => ({
          subject: row.subject,
          '1st Quarter': row['1st Quarter'] ?? '-',
          '2nd Quarter': row['2nd Quarter'] ?? '-',
          finalGrade: row.finalGrade ?? '-',
          remarks: row.remarks ?? '-',
        })) ?? []
      );
    },
    juniorHeaders() {
      return [
        { title: 'Subject', value: 'subject' },
        { title: '1st Q', value: '1st Quarter' },
        { title: '2nd Q', value: '2nd Quarter' },
        { title: '3rd Q', value: '3rd Quarter' },
        { title: '4th Q', value: '4th Quarter' },
        { title: 'Final Grade', value: 'finalGrade' },
        { title: 'Remarks', value: 'remarks' },
      ];
    },
    juniortermHeaders() {
      return [
        { title: 'Subject', value: 'subject' },
        { title: '1st T', value: '1st Term' },
        { title: '2nd T', value: '2nd Term' },
        { title: '3rd T', value: '3rd Term' },
        { title: 'Final Grade', value: 'finalGrade' },
        { title: 'Remarks', value: 'remarks' },
      ];
    },
    semHeaders() {
      return [
        { title: 'Subject', value: 'subject' },
        { title: '1st', value: '1st Quarter' },
        { title: '2nd', value: '2nd Quarter' },
        { title: 'Final Grade', value: 'finalGrade' },
        { title: 'Remarks', value: 'remarks' },
      ];
    },
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log('View Data', data);
        if (data.id) {
          this.initialize();
          this.updateID = data.id;
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
      this.getAllStudentsGrade();
    },
    quarterArray() {
      if (!this.studentGrade.juniorHigh) return [];

      const quarters = [
        '1st Quarter',
        '2nd Quarter',
        '3rd Quarter',
        '4th Quarter',
      ];

      return quarters.filter((quarter) =>
        this.studentGrade.juniorHigh.some(
          (row) =>
            row[quarter] !== null &&
            row[quarter] !== undefined &&
            row[quarter] !== '-',
        ),
      );
    },
    termArray() {
      if (!this.studentGrade.juniorHigh) return [];

      const terms = ['1st Term', '2nd Term', '3rd Term'];

      return terms.filter((term) =>
        this.studentGrade.juniorHigh.some(
          (row) =>
            row[term] !== null && row[term] !== undefined && row[term] !== '-',
        ),
      );
    },
    getAllStudentsGrade() {
      this.axiosCall(
        '/parent-records/getMyChildrenGrades/' +
          this.data.id +
          '/' +
          this.filter +
          '/' +
          this.data.grade_level,
        'GET',
      ).then((res) => {
        console.log('Child Data', res.data);
        if (res.data) {
          this.studentGrade = res.data;
        }
      });
    },
    calculateGeneralAverage(data) {
      const grades = data
        .map((row) => Number(row.finalGrade))
        .filter((val) => !isNaN(val));
      console.log('calculateGeneralAverage', data);
      if (!grades.length) return '-';
      this.quarterAverage = (
        grades.reduce((a, b) => a + b, 0) / grades.length
      ).toFixed(2);
      return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
    },
    acknowledgeGrade() {
      this.selectedPeriod = this.periods[0];
      this.ack1 = false;
      this.ack2 = false;
      this.ackDialog = true;
    },
    closeAckDialog() {
      this.ackDialog = false;
    },
    async submitAcknowledgment() {
      this.submitting = true;
      try {
        let filter = this.$store.getters.getFilterSelected;
        let data = {
          semester:
            this.data?.grade_level == 'Grade 11' ||
            this.data?.grade_level == 'Grade 12'
              ? this.semester
              : null,
          period: this.selectedPeriod,
          school_yearID: filter,
          parentID: this.$store.state.user.id,
          studentID: this.data.id,
        };
        this.axiosCall(
          '/parent-records/parentAcknowledgement',
          'POST',
          data,
        ).then((res) => {
          console.log(res.data);
          if (res.data.status == 201) {
            this.ackDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message =
              'Successfully Aknowledge ' + this.selectedPeriod;
            this.initialize();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'error';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      } finally {
        this.submitting = false;
      }
    },
    closeD() {
      eventBus.emit('closeMyChildrenGradeDialog', false);
      this.studentGrade = [];
      this.dialog = false;
      this.isJunior = false;
    },
  },
};
</script>
