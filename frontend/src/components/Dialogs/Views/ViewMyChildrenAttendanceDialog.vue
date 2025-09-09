<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable fullscreen>
      <v-form ref="MyChildrenAttendance" @submit.prevent>
        <v-card>
          <v-card-title
            class="d-flex dialog-header justify-center align-center"
          >
            <span v-if="data">{{ action }} {{ data.name }} Attendance</span>
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
              <!-- <v-col cols="12" md="3">
                <div class="d-flex justify-center align-center">
                  <div><span class="text-h5 red--text">✅</span> = Present</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="d-flex justify-center align-center">
                  <div><span class="text-h5 red--text">❌</span> =Absent</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="d-flex justify-center align-center">
                  <div><span class="text-h4 red--text">◩</span> = Tardy</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="d-flex justify-center align-center">
                  <div><span class="text-h4 red--text">◪</span> = Excuse</div>
                </div>
              </v-col> -->
              <v-col cols="12">
                <div>
                  <div class="d-flex align-center justify-space-between mb-4">
                    <v-btn @click="prevMonth">Prev</v-btn>
                    <h3>{{ currentMonthLabel }}</h3>
                    <v-btn @click="nextMonth">Next</v-btn>
                  </div>
                  <v-data-table
                    :headers="headers"
                    :items="tableData"
                    class="sticky-first-col elevation-1"
                  >
                    <template
                      v-for="day in daysInMonth"
                      v-slot:[`item.${day}`]="{ item }"
                      :key="day"
                    >
                      <span v-if="item[day] === '1'" class="text-h6 red--text"
                        >✅</span
                      >
                      <span
                        v-else-if="item[day] === '0'"
                        class="text-h6 red--text"
                        >❌</span
                      >
                      <span
                        v-else-if="item[day] === '2'"
                        class="text-h4 red--text"
                        >◩</span
                      >
                      <span
                        v-else-if="item[day] === '3'"
                        class="text-h4 red--text"
                        >◪</span
                      >
                      <span v-else>-</span>
                    </template>
                    <template
                      v-for="day in daysInMonth"
                      v-slot:[`header.${day}`]
                      :key="day"
                    >
                      <span>{{ new Date(day).getDate() }}</span>
                    </template>
                  </v-data-table>
                </div>
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
      currentDate: new Date(),
      studentAttendance: [],
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
    daysInMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      return Array.from(
        { length: lastDay },
        (_, i) =>
          `${year}-${String(month + 1).padStart(2, "0")}-${String(
            i + 1
          ).padStart(2, "0")}`
      );
    },
    headers() {
      return [
        { title: "Subject", value: "subject" },
        ...this.daysInMonth.map((day) => ({
          title: new Date(day).getDate().toString(),
          value: day,
        })),
        { title: "Total Absent", value: "totalAbsent" },
        { title: "Total Tardy", value: "totalTardy" },
      ];
    },
    tableData() {
      return this.studentAttendance.map((row) => {
        const totalAbsent = Object.keys(row).filter(
          (key) => this.daysInMonth.includes(key) && row[key] === "0"
        ).length;
        const totalTardy = Object.keys(row).filter(
          (key) => this.daysInMonth.includes(key) && row[key] === "2"
        ).length;

        return {
          ...row,
          totalAbsent,
          totalTardy,
        };
      });
    },
    currentMonthLabel() {
      return this.currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
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
      this.getStudentAttendance();
    },
    getStudentAttendance() {
      this.axiosCall(
        "/parent-records/getMyChildrenAttendance/" +
          this.data.id +
          "/" +
          this.filter,
        "GET"
      ).then((res) => {
        console.log(res.data);
        if (res.data) {
          this.studentAttendance = res.data;
        }
      });
    },

    closeD() {
      eventBus.emit("closeMyChildrenAttendanceDialog", false);
      this.dialog = false;
    },
    prevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    },
  },
};
</script>
<style scoped>
.sticky-first-col :deep(.v-table__wrapper) {
  overflow-x: auto; /* enables horizontal scroll */
}

.sticky-first-col :deep(table) {
  border-collapse: separate; /* sticky plays nicer than with 'collapse' */
  border-spacing: 0;
}

.sticky-first-col :deep(th:first-child),
.sticky-first-col :deep(td:first-child) {
  position: sticky;
  left: 0;
  background: #fff; /* fallback */
  background: rgb(var(--v-theme-surface)); /* Vuetify theme background */
  z-index: 2;
  /* optional: set a width so it doesn’t shrink */
  min-width: 200px;
}

/* keep header cell above body cells */
.sticky-first-col :deep(thead th:first-child) {
  z-index: 3;
}

/* optional: subtle separator */
.sticky-first-col :deep(td:first-child) {
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.06);
}
</style>
