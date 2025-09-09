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
                    :headers="juniorHeaders"
                    :items="juniorData"
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
                          <b>{{ calculateGeneralAverage(juniorData) }}</b>
                        </td>
                        <td></td>
                      </tr>
                    </template>
                  </v-data-table>
                </template>

                <!-- Senior High Tables -->
                <template v-else>
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
                            color: item.remarks === 'Passed' ? 'green' : 'red',
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
                            color: item.remarks === 'Passed' ? 'green' : 'red',
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
                            <b>{{ calculateGeneralAverage(secondSemData) }}</b>
                          </td>
                          <td></td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-card>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
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
      items: [],
      //   headers: [
      //     { title: "Subject", value: "subject" },
      //     { title: "1st Q", value: "1st Quarter" },
      //     { title: "2nd Q", value: "2nd Quarter" },
      //     { title: "3rd Q", value: "3rd Quarter" },
      //     { title: "4th Q", value: "4th Quarter" },
      //     { title: "Final Grade", value: "finalGrade" },
      //     { title: "Remarks", value: "remarks" },
      //   ],
      currentDate: new Date(),
      studentGrade: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },

  computed: {
    isJunior() {
      return !!this.studentGrade.juniorHigh;
    },
    juniorData() {
      if (!this.studentGrade.juniorHigh) return [];
      return this.studentGrade.juniorHigh.map((row) => ({
        subject: row.subject,
        "1st Quarter": row["1st Quarter"] ?? "-",
        "2nd Quarter": row["2nd Quarter"] ?? "-",
        "3rd Quarter": row["3rd Quarter"] ?? "-",
        "4th Quarter": row["4th Quarter"] ?? "-",
        finalGrade: row.finalGrade ?? "-",
        remarks: row.remarks ?? "-",
      }));
    },

    firstSemData() {
      return (
        this.studentGrade.seniorHigh?.firstSem?.map((row) => ({
          subject: row.subject,
          "1st Quarter": row["1st Quarter"] ?? "-",
          "2nd Quarter": row["2nd Quarter"] ?? "-",
          finalGrade: row.finalGrade ?? "-",
          remarks: row.remarks ?? "-",
        })) ?? []
      );
    },

    secondSemData() {
      return (
        this.studentGrade.seniorHigh?.secondSem?.map((row) => ({
          subject: row.subject,
          "1st Quarter": row["1st Quarter"] ?? "-",
          "2nd Quarter": row["2nd Quarter"] ?? "-",
          finalGrade: row.finalGrade ?? "-",
          remarks: row.remarks ?? "-",
        })) ?? []
      );
    },
    juniorHeaders() {
      return [
        { title: "Subject", value: "subject" },
        { title: "1st Q", value: "1st Quarter" },
        { title: "2nd Q", value: "2nd Quarter" },
        { title: "3rd Q", value: "3rd Quarter" },
        { title: "4th Q", value: "4th Quarter" },
        { title: "Final Grade", value: "finalGrade" },
        { title: "Remarks", value: "remarks" },
      ];
    },
    semHeaders() {
      return [
        { title: "Subject", value: "subject" },
        { title: "1st", value: "1st Quarter" },
        { title: "2nd", value: "2nd Quarter" },
        { title: "Final Grade", value: "finalGrade" },
        { title: "Remarks", value: "remarks" },
      ];
    },
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("View Data", data);
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
      this.getAllStudentsGrade();
    },
    getAllStudentsGrade() {
      this.axiosCall(
        "/parent-records/getMyChildrenGrades/" +
          this.data.id +
          "/" +
          this.filter +
          "/" +
          this.data.grade_level,
        "GET"
      ).then((res) => {
        console.log("Child Data", res.data);
        if (res.data) {
          this.studentGrade = res.data;
        }
      });
    },
    calculateGeneralAverage(data) {
      const grades = data
        .map((row) => Number(row.finalGrade))
        .filter((val) => !isNaN(val));
      if (!grades.length) return "-";
      return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
    },

    closeD() {
      eventBus.emit("closeMyChildrenGradeDialog", false);
      this.dialog = false;
    },
  },
};
</script>
