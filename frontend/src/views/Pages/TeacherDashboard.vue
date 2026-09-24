<template>
  <v-container fluid class="pa-6 dashboard-bg">
    <!-- HEADER -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
      <div>
        <div class="text-overline text-medium-emphasis mb-1">
          Advisor Dashboard
        </div>
        <div class="text-h5 font-weight-bold text-slate">Class Overview</div>
      </div>
    </div>

    <!-- STATS CARDS -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="4">
        <v-card class="pa-4 stat-card" rounded="lg" border elevation="0">
          <div class="stat-icon-wrap blue-icon">
            <v-icon icon="mdi-account-group-outline" size="22" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold text-slate">
              {{ studentCount ? studentCount : 0 }}
            </div>
            <div class="text-caption text-medium-emphasis">Total Students</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 stat-card" rounded="lg" border elevation="0">
          <div class="stat-icon-wrap red-icon">
            <v-icon icon="mdi-alert-outline" size="22" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold text-slate">
              {{ atRiskCount ? atRiskCount : 0 }}
            </div>
            <div class="text-caption text-medium-emphasis">
              At-Risk Student/s
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 stat-card" rounded="lg" border elevation="0">
          <div class="stat-icon-wrap orange-icon">
            <v-icon icon="mdi-clipboard-alert-outline" size="22" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold text-slate">
              {{ lardoCount ? lardoCount : 0 }}
            </div>
            <div class="text-caption text-medium-emphasis">LARDO Student/s</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- CHARTS -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="7">
        <v-card class="pa-4" rounded="lg" border elevation="0">
          <div class="section-eyebrow mb-1">
            <v-icon icon="mdi-chart-bar" size="16" class="me-1" />
            OVERVIEW
          </div>
          <v-card-title class="font-weight-bold px-0 pt-0 text-slate">
            Student Overview
          </v-card-title>
          <div class="chart-wrap">
            <Bar
              v-if="hasOverviewData"
              :data="overviewChartData"
              :options="barOptions"
            />
            <v-empty-state
              v-else
              icon="mdi-chart-bar"
              title="No data yet"
              text="Stats will appear once students are enrolled."
              class="empty-chart-state"
            />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-4" rounded="lg" border elevation="0">
          <div class="section-eyebrow mb-1">
            <v-icon icon="mdi-chart-donut" size="16" class="me-1" />
            BREAKDOWN
          </div>
          <v-card-title class="font-weight-bold px-0 pt-0 text-slate">
            Risk Level Breakdown
          </v-card-title>
          <div class="chart-wrap">
            <Doughnut
              v-if="hasRiskData"
              :data="riskChartData"
              :options="doughnutOptions"
            />
            <v-empty-state
              v-else
              icon="mdi-check-circle-outline"
              title="Nothing to chart"
              text="No at-risk students currently."
              class="empty-chart-state"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <!-- LEFT / MAIN COLUMN -->
      <v-col cols="12" md="12">
        <!-- AT RISK TABLE -->
        <v-card class="mb-6 pa-4" rounded="lg" border elevation="0">
          <v-card-title
            class="font-weight-bold d-flex align-center flex-wrap ga-3 px-0 pt-0 text-slate"
          >
            <v-icon
              icon="mdi-school-outline"
              size="20"
              class="me-2 text-red-lighten-1"
            />
            Students at Risk of Grade Failure
            <v-spacer />
            <v-text-field
              v-model="search"
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              clearable
              style="max-width: 220px"
            />
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="atRiskStudents"
            :search="search"
            density="comfortable"
            class="risk-table"
          >
            <template v-slot:[`item.transmuted_grade`]="{ item }">
              <v-chip
                :color="riskInfo(item.transmuted_grade).color"
                size="small"
                variant="flat"
              >
                <span class="text-white">{{
                  riskInfo(item.transmuted_grade).label
                }}</span>
              </v-chip>
            </template>
            <template v-slot:[`item.grade`]="{ item }">
              {{ item.transmuted_grade }}
            </template>

            <template v-slot:[`item.remarks`]="{ item }">
              <v-btn
                size="small"
                :color="riskInfo(item.transmuted_grade).color"
                variant="flat"
              >
                <span class="text-white" style="font-size: 10px">
                  {{ item.remarks }}
                </span>
              </v-btn>
            </template>

            <template v-slot:[`item.action_taken`]="{ item }">
              <div class="action-taken-cell">
                <button
                  v-if="item.action_taken"
                  type="button"
                  class="action-pill action-pill--done"
                  @click="openActionDialog(item, 'at_risk')"
                >
                  <v-icon icon="mdi-check-circle" size="16" class="me-1" />
                  <span class="action-pill-text">{{ item.action_taken }}</span>
                  <v-icon
                    icon="mdi-pencil-outline"
                    size="14"
                    class="ms-1 action-pill-edit"
                  />
                </button>
                <button
                  v-else
                  type="button"
                  class="action-pill action-pill--empty"
                  @click="openActionDialog(item, 'at_risk')"
                >
                  <v-icon icon="mdi-plus" size="16" class="me-1" />
                  Log action taken
                </button>
              </div>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <div class="d-flex justify-end">
                <v-btn
                  size="small"
                  variant="flat"
                  color="pink"
                  prepend-icon="mdi-eye-outline"
                  @click="openAtRiskData(item)"
                >
                  View
                </v-btn>
              </div>
            </template>

            <template v-slot:no-data>
              <v-empty-state
                icon="mdi-check-circle-outline"
                title="No at-risk students found"
                text="Everyone's currently on track."
              />
            </template>
          </v-data-table>
        </v-card>

        <!-- LARDO TABLE -->
        <v-card class="mb-6 pa-4" rounded="lg" border elevation="0">
          <v-card-title
            class="font-weight-bold d-flex align-center flex-wrap ga-3 px-0 pt-0 text-slate"
          >
            <v-icon
              icon="mdi-clipboard-alert-outline"
              size="20"
              class="me-2 text-orange-darken-1"
            />
            Learner's At-Risk of Dropping Out (LARDO)
            <v-spacer />
            <v-text-field
              v-model="search"
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              clearable
              style="max-width: 220px"
            />
          </v-card-title>

          <v-data-table
            :headers="headers1"
            :items="lardoStudents"
            :search="search"
            density="comfortable"
            class="risk-table"
          >
            <template v-slot:[`item.name`]="{ item }">
              <div class="d-flex align-center justify-center ga-2">
                <span class="font-weight-medium" style="font-size: 10px">{{
                  item.name
                }}</span>
              </div>
            </template>

            <template v-slot:[`item.remarks`]="{ item }">
              <div class="d-flex justify-end">
                <span class="text-black" style="font-size: 10px">
                  {{ item.remarks }}
                </span>
              </div>
            </template>

            <template v-slot:[`item.action_taken`]="{ item }">
              <div class="action-taken-cell">
                <button
                  v-if="item.action_taken"
                  type="button"
                  class="action-pill action-pill--done"
                  @click="openActionDialog(item, 'lardo')"
                >
                  <v-icon icon="mdi-check-circle" size="16" class="me-1" />
                  <span class="action-pill-text">{{ item.action_taken }}</span>
                  <v-icon
                    icon="mdi-pencil-outline"
                    size="14"
                    class="ms-1 action-pill-edit"
                  />
                </button>
                <button
                  v-else
                  type="button"
                  class="action-pill action-pill--empty"
                  @click="openActionDialog(item, 'lardo')"
                >
                  <v-icon icon="mdi-plus" size="16" class="me-1" />
                  Log action taken
                </button>
              </div>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <div class="d-flex justify-end">
                <v-btn
                  size="small"
                  variant="flat"
                  color="pink"
                  prepend-icon="mdi-eye-outline"
                  @click="openLardoDialog(item)"
                >
                  View
                </v-btn>
              </div>
            </template>

            <template v-slot:no-data>
              <v-empty-state
                icon="mdi-check-circle-outline"
                title="No at-risk students found"
                text="Everyone's currently on track."
              />
            </template>
          </v-data-table>
        </v-card>

        <!-- LARDO Details Dialog -->
        <v-dialog v-model="lardoDialog" max-width="480">
          <v-card rounded="lg" v-if="selectedLardoStudent">
            <v-card-title class="d-flex align-center px-5 pt-5 pb-2">
              <v-icon
                icon="mdi-clipboard-alert-outline"
                size="22"
                class="me-2 text-orange-darken-1"
              />
              <span class="font-weight-bold">At-Risk Report</span>
              <v-spacer />
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="lardoDialog = false"
              />
            </v-card-title>

            <v-divider />

            <v-card-text class="px-5 py-4">
              <div class="mb-3">
                <div class="text-caption text-medium-emphasis">Student</div>
                <div class="text-body-1 font-weight-medium">
                  {{ selectedLardoStudent.name }}
                </div>
              </div>

              <div class="mb-3">
                <div class="text-caption text-medium-emphasis">LRN</div>
                <div class="text-body-2">{{ selectedLardoStudent.lrn }}</div>
              </div>

              <div class="mb-3">
                <div class="text-caption text-medium-emphasis">Subject</div>
                <div class="text-body-2">
                  {{ selectedLardoStudent.subject_title }}
                </div>
              </div>

              <div class="mb-3">
                <div class="text-caption text-medium-emphasis">Remarks</div>
                <div class="text-body-2">
                  {{ selectedLardoStudent.remarks }}
                </div>
              </div>

              <div>
                <div class="text-caption text-medium-emphasis">
                  Recommendation
                </div>
                <v-chip
                  color="warning"
                  variant="tonal"
                  size="small"
                  class="mt-1"
                >
                  {{ selectedLardoStudent.recommendation }}
                </v-chip>
              </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="px-5 py-3">
              <v-spacer />
              <v-btn
                variant="flat"
                color="primary"
                @click="lardoDialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <!-- SECONDARY COLUMN -->
      <v-col cols="12" md="12">
        <!-- MISBEHAVIOR -->
        <v-card class="mb-6 pa-4" rounded="lg" border elevation="0">
          <v-card-title
            class="font-weight-bold px-0 pt-0 text-slate d-flex align-center"
          >
            <v-icon
              icon="mdi-account-alert-outline"
              size="20"
              class="me-2 text-amber-darken-2"
            />
            Student Misbehavior Reports
          </v-card-title>

          <v-list density="compact" class="px-0">
            <v-list-item
              v-for="(m, i) in paginatedMisbehave"
              :key="i"
              class="border-bottom py-2 px-0"
            >
              <div class="d-flex justify-space-between align-center">
                <v-list-item-title>{{ m.name }}</v-list-item-title>
                <v-chip
                  size="x-small"
                  :color="misbehaviorStatus(m.status).color"
                  variant="flat"
                  class="ml-2"
                >
                  {{ misbehaviorStatus(m.status).label }}
                </v-chip>
              </div>
            </v-list-item>

            <v-list-item
              v-if="paginatedMisbehave && !paginatedMisbehave.length"
              class="px-0"
            >
              <v-empty-state
                icon="mdi-emoticon-happy-outline"
                title="No misbehavior reports"
                text="Nothing flagged for this period."
                density="compact"
              />
            </v-list-item>
          </v-list>

          <div
            class="d-flex justify-center pt-4"
            v-if="misbehaveList && misbehaveList.length"
          >
            <v-pagination
              v-model="misPage"
              :length="misPageCount"
              total-visible="5"
              density="compact"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog: Parent-Teacher Conference + Intensive Intervention -->
    <v-dialog v-model="conferenceDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-red-darken-1 text-white">
          <v-icon start icon="mdi-alert-octagon-outline"></v-icon>
          Intensive Intervention Required
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="mb-2">
            <strong>{{ selectedData?.[0]?.student_name }}</strong> has multiple
            failing subjects and requires immediate attention.
          </p>

          <v-card
            v-for="subject in selectedData"
            :key="subject.id"
            variant="outlined"
            class="mb-3"
          >
            <v-card-text class="py-2">
              <div class="text-subtitle-2 font-weight-bold mb-1">
                {{ subject.subject_title }}
              </div>
              <v-list density="compact">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-chart-line"></v-icon>
                  </template>
                  <v-list-item-title>
                    Grade: {{ subject.transmuted_grade }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-clipboard-text-outline"></v-icon>
                  </template>
                  <v-list-item-title>
                    Recommendation: {{ subject.remarks }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-google-classroom"></v-icon>
                  </template>
                  <v-list-item-title>
                    {{ subject.grade_level }} - {{ subject.room_name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <v-alert
            v-if="selectedData?.length"
            type="error"
            variant="tonal"
            class="mt-3"
            density="compact"
          >
            A parent-teacher conference should be scheduled immediately.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="conferenceDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Other remarks (Peer Tutoring / Mandatory Remediation) -->
    <v-dialog v-model="interventionDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-amber-darken-1 text-white">
          <v-icon start icon="mdi-information-outline"></v-icon>
          Intervention Details
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="mb-2">
            <strong>{{ selectedItem?.name }}</strong> is at risk and needs the
            following support.
          </p>
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend
                ><v-icon icon="mdi-school-outline"></v-icon
              ></template>
              <v-list-item-title
                >LRN: {{ selectedItem?.lrn }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend
                ><v-icon icon="mdi-file-outline"></v-icon
              ></template>
              <v-list-item-title
                >Subject: {{ selectedItem?.subject_title }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend
                ><v-icon icon="mdi-chart-line"></v-icon
              ></template>
              <v-list-item-title
                >Grade: {{ selectedItem?.transmuted_grade }}</v-list-item-title
              >
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend
                ><v-icon icon="mdi-clipboard-text-outline"></v-icon
              ></template>
              <v-list-item-title
                >Recommendation: {{ selectedItem?.remarks }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="interventionDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Record / edit Action Taken (shared by both tables) -->
    <v-dialog v-model="actionDialog" max-width="460" persistent>
      <v-card rounded="lg" v-if="actionDialogItem">
        <v-card-title class="d-flex align-center px-5 pt-5 pb-2">
          <v-icon
            icon="mdi-clipboard-check-outline"
            size="20"
            class="me-2 text-primary"
          />
          <span class="font-weight-bold">
            {{ actionDialogItem.action_taken ? 'Edit' : 'Log' }} Action Taken
          </span>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            :disabled="savingAction"
            @click="closeActionDialog"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="px-5 py-4">
          <div class="mb-3">
            <div class="text-caption text-medium-emphasis">Student</div>
            <div class="text-body-1 font-weight-medium">
              {{ actionDialogItem.name }}
            </div>
          </div>

          <div
            class="mb-4"
            v-if="
              actionDialogType === 'at_risk'
                ? actionDialogItem.remarks
                : actionDialogItem.recommendation
            "
          >
            <div class="text-caption text-medium-emphasis">
              Recommended intervention
            </div>
            <v-chip color="primary" variant="tonal" size="small" class="mt-1">
              {{
                actionDialogType === 'at_risk'
                  ? actionDialogItem.remarks
                  : actionDialogItem.recommendation
              }}
            </v-chip>
          </div>

          <v-textarea
            v-model="actionInput"
            label="What action was taken?"
            placeholder="e.g. Met with student and parent to discuss remedial schedule"
            variant="outlined"
            auto-grow
            rows="3"
            counter="300"
            maxlength="300"
            :error-messages="actionError"
            :disabled="savingAction"
            autofocus
            @update:model-value="actionError = ''"
            @keydown.enter.ctrl="confirmSaveAction"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-5 py-3">
          <v-btn
            v-if="actionDialogItem.action_taken"
            variant="text"
            color="error"
            :disabled="savingAction"
            @click="clearAction"
          >
            Remove
          </v-btn>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="savingAction"
            @click="closeActionDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            :loading="savingAction"
            @click="confirmSaveAction"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Feedback for saving/clearing an action -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2500"
      location="bottom right"
    >
      <v-icon
        :icon="
          snackbar.color === 'error'
            ? 'mdi-alert-circle-outline'
            : 'mdi-check-circle-outline'
        "
        class="me-2"
      />
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>
<script>
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);

export default {
  components: { Bar, Doughnut },
  data() {
    return {
      savingAction: false,
      conferenceDialog: false,
      interventionDialog: false,
      selectedItem: null,
      selectedData: null,
      page: 1,
      itemsPerPage: 10,
      misPage: 1,
      misItemsPerPage: 10,
      search: '',
      roomList: [],
      atRiskCount: null,
      studentCount: null,
      lardoCount: null,
      atRiskStudents: [],
      alertStudents: [],
      misbehaveList: [],
      lardoStudents: [],
      lardoDialog: false,
      selectedLardoStudent: null,

      // Action Taken dialog state (shared by the at-risk and LARDO tables)
      actionDialog: false,
      actionDialogItem: null,
      actionDialogType: null, // 'at_risk' | 'lardo'
      actionInput: '',
      actionError: '',
      snackbar: { show: false, text: '', color: 'success' },

      headers: [
        { title: 'LRN', key: 'lrn', align: 'start', width: '200' },
        { title: 'Student Name', key: 'name', width: '200' },
        { title: 'Grade', key: 'grade', width: '100' },
        {
          title: 'Recommendataion',
          key: 'remarks',
          align: 'center',
          width: '200',
        },
        {
          title: 'Action Taken',
          key: 'action_taken',
          align: 'start',
          width: '240',
        },
        {
          title: 'Action',
          key: 'actions',
          align: 'end',
          width: '200',
        },
      ],

      headers1: [
        { title: 'LRN', key: 'lrn', align: 'start', width: '200' },
        { title: 'Student Name', key: 'name', align: 'center', width: '200' },
        { title: 'Action', key: 'remarks', align: 'center', width: '200' },
        {
          title: 'Recommendation',
          key: 'recommendation',
          align: 'end',
          width: '200',
        },
        {
          title: 'Action Taken',
          key: 'action_taken',
          align: 'start',
          width: '240',
        },
        // { title: 'Grade', key: 'grade' },
        { title: 'Action', key: 'actions', align: 'end' },
      ],
      students: [
        {
          lrn: '1885338',
          name: 'John Dela Cruz',
          risk: 'Low',
          reason: 'Low Scores',
          remedial: true,
        },
        {
          lrn: '1885339',
          name: 'Mia Santiago',
          risk: 'Moderate',
          reason: 'Frequent Absences',
          remedial: false,
        },
        {
          lrn: '1885340',
          name: 'Alex Reyes',
          risk: 'High',
          reason: 'Low Scores',
          remedial: true,
        },
      ],

      remedials: ['Ferdinand Lim – 3:30 PM', 'Mia Santiago – 4:30 PM'],

      reminders: ['Submit class report on time'],

      alerts: [
        'LARDO Alert: Louis skipped 5 days',
        'At-Risk: Mia low scores in English',
      ],

      notifications: [
        'Alex reported to Prefect',
        'Louis flagged as LARDO',
        'Counseling session tomorrow',
      ],

      barOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
      doughnutOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
        },
      },
    };
  },
  mounted() {
    this.initialize();
  },
  watch: {
    '$store.getters.getFilterSelected'() {
      this.initialize();
    },
  },
  computed: {
    paginatedAlerts() {
      const list = this.alertStudents || [];
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return list.slice(start, end);
    },
    pageCount() {
      if (!this.alertStudents || !this.itemsPerPage) return 1;
      return Math.ceil(this.alertStudents.length / this.itemsPerPage);
    },
    paginatedMisbehave() {
      const list = this.misbehaveList || [];
      const start = (this.misPage - 1) * this.misItemsPerPage;
      const end = start + this.misItemsPerPage;
      return list.slice(start, end);
    },
    misPageCount() {
      if (!this.misbehaveList || !this.misItemsPerPage) return 1;
      return Math.ceil(this.misbehaveList.length / this.misItemsPerPage);
    },

    hasOverviewData() {
      return !!(this.studentCount || this.atRiskCount || this.lardoCount);
    },
    overviewChartData() {
      return {
        labels: ['Total Students', 'At-Risk', 'LARDO'],
        datasets: [
          {
            label: 'Students',
            data: [
              this.studentCount || 0,
              this.atRiskCount || 0,
              this.lardoCount || 0,
            ],
            backgroundColor: ['#1565c0', '#c62828', '#ef6c00'],
            borderRadius: 6,
            maxBarThickness: 60,
          },
        ],
      };
    },

    // Buckets atRiskStudents by the same riskInfo() thresholds used in the table,
    // so the chart and the table can never disagree.
    riskCounts() {
      const counts = { High: 0, Moderate: 0, Passable: 0, Good: 0, 'N/A': 0 };
      (this.atRiskStudents || []).forEach((s) => {
        const label = this.riskInfo(s.transmuted_grade).label;
        counts[label] = (counts[label] || 0) + 1;
      });
      return counts;
    },
    hasRiskData() {
      return (this.atRiskStudents || []).length > 0;
    },
    riskChartData() {
      const c = this.riskCounts;
      const entries = Object.entries(c).filter(([, v]) => v > 0);
      return {
        labels: entries.map(([label]) => label),
        datasets: [
          {
            data: entries.map(([, v]) => v),
            backgroundColor: entries.map(([label]) => {
              const colorMap = {
                High: '#e53935',
                Moderate: '#fb8c00',
                Passable: '#ffb300',
                Good: '#43a047',
                'N/A': '#9e9e9e',
              };
              return colorMap[label];
            }),
          },
        ],
      };
    },
  },
  methods: {
    initialize() {
      this.getFacultyDashboardData();
    },
    openLardoDialog(item) {
      this.selectedLardoStudent = item;
      this.lardoDialog = true;
    },
    openAtRiskData(item) {
      if (
        item.remarks === 'Parent-Teacher Conference + Intensive Intervention'
      ) {
        this.conferenceDialog = true;
        this.getAllSubjectThatAtRisk(item.id);
      } else {
        this.selectedItem = item;
        this.interventionDialog = true;
      }
    },
    scheduleConference() {
      // wire up your route/API call here
      this.conferenceDialog = false;
    },
    getAllSubjectThatAtRisk(id) {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/enroll-student/getAllSubjectThatAtRisk/' + filter + '/' + id,
        'GET',
      ).then((res) => {
        if (res) {
          this.selectedData = res.data;
        }
      });
    },
    riskInfo(grade) {
      if (grade == null) {
        return { label: 'N/A', color: 'grey', action: '—' };
      }
      if (grade <= 70) {
        return {
          label: 'High',
          color: 'red',
          action: 'Remedial Class + Parent Meeting',
        };
      }
      if (grade <= 75) {
        return {
          label: 'Moderate',
          color: 'orange',
          action: 'Teacher Consultation',
        };
      }
      if (grade <= 80) {
        return {
          label: 'Passable',
          color: 'amber-darken-2',
          action: 'Counseling',
        };
      }
      return { label: 'Good', color: 'green', action: 'Monitor' };
    },
    misbehaviorStatus(status) {
      const map = {
        0: { label: 'Adviser Review', color: 'yellow-darken-2' },
        1: { label: 'Prefect Review', color: 'orange' },
        2: { label: 'Parent Review', color: 'red' },
      };
      return map[status] || { label: 'Resolved', color: 'green' };
    },

    // Opens the shared "Action Taken" dialog for a row from either table.
    // `type` is 'at_risk' or 'lardo' so we know which recommendation field
    // to show and which payload shape to send when saving.
    openActionDialog(item, type) {
      this.actionDialogItem = item;
      this.actionDialogType = type;
      this.actionInput = item.action_taken || '';
      this.actionError = '';
      this.actionDialog = true;
    },
    closeActionDialog() {
      if (this.savingAction) return;
      this.actionDialog = false;
      this.actionDialogItem = null;
      this.actionDialogType = null;
      this.actionInput = '';
      this.actionError = '';
    },
    confirmSaveAction() {
      if (!this.actionInput || !this.actionInput.trim()) {
        this.actionError = 'Please describe the action taken before saving';
        return;
      }

      this.persistAction(this.actionInput.trim());
    },
    clearAction() {
      this.persistAction('');
    },

    // Saves the teacher's "Action Taken" entry for a row in either table.
    // `type` is 'at_risk' or 'lardo' so the backend can tell which record to update.
    // NOTE: adjust the endpoint/payload shape to match your actual API.
    persistAction(value) {
      const item = this.actionDialogItem;
      const type = this.actionDialogType;
      if (!item) return;

      const previous = item.action_taken;
      item.action_taken = value;

      let oldData = {
        id: item.id,
        type,
        action_taken: item.action_taken,
        recommendation: type === 'lardo' ? item.recommendation : item.remarks,
      };
      let data = {
        data: JSON.stringify(oldData),
      };
      this.savingAction = true;
      this.axiosCall(
        '/enroll-student/updateActionTaken/' + item.atriskID,
        'PATCH',
        data,
      )
        .then((res) => {
          if (res) {
            item.action_taken_saved = true;
            this.snackbar = {
              show: true,
              text: value ? 'Action taken saved' : 'Action taken removed',
              color: 'success',
            };
            this.actionDialog = false;
            this.actionDialogItem = null;
            this.actionDialogType = null;
            this.actionInput = '';
          }
        })
        .catch(() => {
          item.action_taken = previous;
          this.snackbar = {
            show: true,
            text: 'Could not save — please try again',
            color: 'error',
          };
        })
        .finally(() => {
          this.savingAction = false;
        });
    },

    getFacultyDashboardData() {
      let filter = this.$store.getters.getFilterSelected;
      let assignedModuleID = localStorage.getItem('AssignedModID');
      this.axiosCall(
        '/enroll-student/getFacultyDashboardData/' +
          filter +
          '/' +
          assignedModuleID,
        'GET',
      ).then((res) => {
        if (res) {
          this.roomList = res.data.data;
          this.studentCount = res.data.studentCount;
          this.atRiskCount = res.data.atRiskCount;
          this.lardoCount = res.data.lardoCount;
          this.atRiskStudents = res.data.atRiskStudents;
          this.misbehaveList = res.data.misbehaveList;
          this.alertStudents = res.data.alertStudents;
          this.lardoStudents = res.data.lardoStudents;

          console.log('getFacultyDashboardData', res.data);
        }
      });
    },
  },
};
</script>

<style scoped>
.dashboard-bg {
  background: #f8fafc;
  min-height: 100vh;
}

.text-slate {
  color: #1e293b;
}

.section-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #94a3b8;
  display: flex;
  align-items: center;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border-color: #e2e8f0 !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.blue-icon {
  background: #dbeafe;
  color: #1d4ed8;
}
.red-icon {
  background: #fee2e2;
  color: #dc2626;
}
.orange-icon {
  background: #ffedd5;
  color: #ea580c;
}

.border-bottom {
  border-bottom: 1px solid #eef2f6;
}

.risk-table :deep(thead th) {
  font-weight: 600 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #fdfeff !important;
  opacity: 1;
}

.risk-table :deep(tbody tr:hover) {
  background: #f8fafc;
}

.action-taken-cell {
  min-width: 200px;
  padding: 6px 0;
}

/* "Action Taken" pill — a single click target that both displays the saved
   note and opens the edit dialog, instead of an always-open text field. */
.action-pill {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1.3;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;
  text-align: left;
}

.action-pill--empty {
  color: #64748b;
  background: #f1f5f9;
  border-color: #e2e8f0;
  font-weight: 500;
}
.action-pill--empty:hover {
  background: #e2e8f0;
  color: #334155;
}

.action-pill--done {
  color: #166534;
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.action-pill--done:hover {
  background: #dcfce7;
  border-color: #86efac;
}

.action-pill-text {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-pill-edit {
  opacity: 0;
  transition: opacity 0.12s ease;
}
.action-pill--done:hover .action-pill-edit {
  opacity: 1;
}

.chart-wrap {
  height: 240px;
  position: relative;
}

.empty-chart-state {
  height: 100%;
}
</style>
