<template>
  <v-container fluid class="dash pa-4 pa-md-6">
    <!-- Header -->
    <header class="page-head">
      <h1 class="page-title">Class overview</h1>
      <p class="page-sub">
        Grades, dropout risk and behavior reports for your advisory classes.
      </p>
    </header>

    <!-- Overview strip -->
    <section class="overview" aria-label="Class totals">
      <div v-for="s in stats" :key="s.key" class="overview-cell">
        <span class="cell-icon" :style="{ '--tone': s.color }">
          <v-icon :icon="s.icon" size="20" />
        </span>
        <span class="cell-body">
          <span class="cell-label">{{ s.label }}</span>
          <span class="cell-value">
            {{ s.value || 0 }}
            <small v-if="s.ofTotal && studentCount" class="cell-of">
              of {{ studentCount }}
            </small>
          </span>
          <span v-if="s.ofTotal && studentCount" class="cell-bar">
            <span
              :style="{ width: percent(s.value) + '%', background: s.color }"
            />
          </span>
        </span>
      </div>
    </section>

    <!-- Charts -->
    <v-row dense class="mb-2">
      <v-col cols="12" md="7">
        <v-card class="panel" elevation="0">
          <h2 class="panel-title">Student overview</h2>
          <p class="panel-sub">Total students compared with flagged students</p>
          <div class="chart-wrap">
            <Bar
              v-if="hasOverviewData"
              :data="overviewChartData"
              :options="barOptions"
            />
            <div v-else class="empty">
              <v-icon icon="mdi-chart-bar" size="34" />
              <strong>No data yet</strong>
              <span>Stats appear once students are enrolled.</span>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="panel" elevation="0">
          <h2 class="panel-title">Risk levels</h2>
          <p class="panel-sub">At-risk students grouped by grade range</p>
          <div class="chart-wrap">
            <Doughnut
              v-if="hasRiskData"
              :data="riskChartData"
              :options="doughnutOptions"
            />
            <div v-else class="empty">
              <v-icon icon="mdi-check-circle-outline" size="34" />
              <strong>Nothing to chart</strong>
              <span>No at-risk students right now.</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- At-risk table -->
    <v-card class="panel" elevation="0">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Students at risk of failing</h2>
          <p class="panel-sub">
            {{ atRiskStudents.length }}
            {{ atRiskStudents.length === 1 ? 'student' : 'students' }} with a
            grade of 80 or below
          </p>
        </div>
        <v-text-field
          v-model="search"
          density="compact"
          placeholder="Search name or LRN"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          clearable
          single-line
          class="search-field"
        />
      </div>

      <v-data-table
        :headers="headers"
        :items="atRiskStudents"
        :search="search"
        density="comfortable"
        hover
        class="tbl"
      >
        <template v-slot:[`item.name`]="{ item }">
          <div class="person">
            <v-avatar size="30" color="primary" variant="tonal" class="avatar">
              {{ initials(item.name) }}
            </v-avatar>
            <span class="person-name">{{ item.name }}</span>
          </div>
        </template>

        <template v-slot:[`item.grade`]="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="riskInfo(item.transmuted_grade).color"
            class="grade-chip"
          >
            {{ item.transmuted_grade ?? '—' }}
            <span class="grade-label">
              {{ riskInfo(item.transmuted_grade).label }}
            </span>
          </v-chip>
        </template>

        <template v-slot:[`item.remarks`]="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="riskInfo(item.transmuted_grade).color"
            class="wrap-chip"
          >
            {{ item.remarks }}
          </v-chip>
        </template>

        <template v-slot:[`item.action_taken`]="{ item }">
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
              class="ms-1 pill-edit"
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
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-eye-outline"
            @click="openAtRiskData(item)"
          >
            View
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="empty">
            <v-icon icon="mdi-check-circle-outline" size="34" />
            <strong>No at-risk students</strong>
            <span>Everyone is currently on track.</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- LARDO table -->
    <v-card class="panel" elevation="0">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Learners at risk of dropping out (LARDO)</h2>
          <p class="panel-sub">
            {{ lardoStudents.length }}
            {{ lardoStudents.length === 1 ? 'learner' : 'learners' }} flagged
            from attendance tracking
          </p>
        </div>
        <v-text-field
          v-model="searchLardo"
          density="compact"
          placeholder="Search name or LRN"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          clearable
          single-line
          class="search-field"
        />
      </div>

      <v-data-table
        :headers="headers1"
        :items="lardoStudents"
        :search="searchLardo"
        density="comfortable"
        hover
        class="tbl"
      >
        <template v-slot:[`item.name`]="{ item }">
          <div class="person">
            <v-avatar size="30" color="primary" variant="tonal" class="avatar">
              {{ initials(item.name) }}
            </v-avatar>
            <span class="person-name">{{ item.name }}</span>
          </div>
        </template>

        <template v-slot:[`item.remarks`]="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="severityOf(item.remarks).color"
            :prepend-icon="severityOf(item.remarks).icon"
          >
            {{ severityOf(item.remarks).label }}
          </v-chip>
        </template>

        <template v-slot:[`item.recommendation`]="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            color="warning"
            class="wrap-chip"
          >
            {{ item.recommendation }}
          </v-chip>
        </template>

        <template v-slot:[`item.action_taken`]="{ item }">
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
              class="ms-1 pill-edit"
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
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-eye-outline"
            @click="openLardoDialog(item)"
          >
            View
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="empty">
            <v-icon icon="mdi-check-circle-outline" size="34" />
            <strong>No LARDO learners</strong>
            <span>New alerts appear here as attendance is recorded.</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Misbehavior -->
    <v-card class="panel" elevation="0">
      <h2 class="panel-title">Student misbehavior reports</h2>
      <p class="panel-sub">
        {{ misbehaveList.length }}
        {{ misbehaveList.length === 1 ? 'report' : 'reports' }}
      </p>

      <ul v-if="paginatedMisbehave.length" class="mis-list">
        <li v-for="(m, i) in paginatedMisbehave" :key="i" class="mis-row">
          <v-avatar size="30" color="primary" variant="tonal" class="avatar">
            {{ initials(m.name) }}
          </v-avatar>
          <span class="person-name mis-name">{{ m.name }}</span>
          <v-chip
            size="small"
            variant="tonal"
            :color="misbehaviorStatus(m.status).color"
          >
            {{ misbehaviorStatus(m.status).label }}
          </v-chip>
        </li>
      </ul>

      <div v-else class="empty">
        <v-icon icon="mdi-emoticon-happy-outline" size="34" />
        <strong>No misbehavior reports</strong>
        <span>Nothing flagged for this period.</span>
      </div>

      <div v-if="misPageCount > 1" class="d-flex justify-center pt-4">
        <v-pagination
          v-model="misPage"
          :length="misPageCount"
          total-visible="5"
          density="compact"
        />
      </div>
    </v-card>

    <!-- Dialog: LARDO details -->
    <v-dialog v-model="lardoDialog" max-width="520">
      <v-card v-if="selectedLardoStudent" class="dlg" elevation="0">
        <div
          class="dlg-band"
          :style="{ '--tone': severityOf(selectedLardoStudent.remarks).hex }"
        />
        <div class="dlg-head">
          <v-avatar size="44" color="primary" variant="tonal">
            {{ initials(selectedLardoStudent.name) }}
          </v-avatar>
          <div class="dlg-who">
            <div class="dlg-name">{{ selectedLardoStudent.name }}</div>
            <div class="dlg-sub">LRN {{ selectedLardoStudent.lrn }}</div>
          </div>
          <v-chip
            size="small"
            variant="tonal"
            :color="severityOf(selectedLardoStudent.remarks).color"
            :prepend-icon="severityOf(selectedLardoStudent.remarks).icon"
          >
            {{ severityOf(selectedLardoStudent.remarks).label }}
          </v-chip>
        </div>
        <v-divider />
        <v-card-text class="dlg-body">
          <div class="fact">
            <div class="fact-label">Subject</div>
            <div class="fact-value">
              {{ selectedLardoStudent.subject_title }}
            </div>
          </div>
          <div
            class="note"
            :style="{ '--tone': severityOf(selectedLardoStudent.remarks).hex }"
          >
            <div class="note-title">What happened</div>
            <p>{{ stripLabel(selectedLardoStudent.remarks) }}</p>
          </div>
          <div
            v-if="selectedLardoStudent.recommendation"
            class="note note-reco"
          >
            <div class="note-title">Recommended action</div>
            <p>{{ selectedLardoStudent.recommendation }}</p>
          </div>
          <div v-if="selectedLardoStudent.action_taken" class="note note-done">
            <div class="note-title">Action taken</div>
            <p>{{ selectedLardoStudent.action_taken }}</p>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn variant="flat" color="primary" @click="lardoDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Parent-Teacher Conference + Intensive Intervention -->
    <v-dialog v-model="conferenceDialog" max-width="540">
      <v-card class="dlg" elevation="0">
        <div class="dlg-band" style="--tone: #c0392b" />
        <div class="dlg-head">
          <v-avatar size="44" color="error" variant="tonal">
            <v-icon icon="mdi-alert-octagon-outline" />
          </v-avatar>
          <div class="dlg-who">
            <div class="dlg-name">Intensive intervention required</div>
            <div class="dlg-sub">{{ selectedData?.[0]?.student_name }}</div>
          </div>
        </div>
        <v-divider />
        <v-card-text class="dlg-body">
          <p class="dlg-lead">
            Multiple failing subjects. Review each one below.
          </p>

          <div v-if="!selectedData" class="empty">
            <v-progress-circular indeterminate size="24" width="2" />
          </div>

          <div
            v-for="subject in selectedData"
            :key="subject.id"
            class="subject"
          >
            <div class="subject-head">
              <span class="subject-title">{{ subject.subject_title }}</span>
              <v-chip
                size="small"
                variant="tonal"
                :color="riskInfo(subject.transmuted_grade).color"
                class="grade-chip"
              >
                {{ subject.transmuted_grade }}
              </v-chip>
            </div>
            <div class="subject-meta">
              {{ subject.grade_level }}, {{ subject.room_name }}
            </div>
            <div class="subject-reco">{{ subject.remarks }}</div>
          </div>

          <v-alert
            v-if="selectedData?.length"
            type="error"
            variant="tonal"
            density="compact"
          >
            Schedule a parent-teacher conference as soon as possible.
          </v-alert>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn
            variant="flat"
            color="primary"
            @click="conferenceDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Other remarks (Peer Tutoring / Mandatory Remediation) -->
    <v-dialog v-model="interventionDialog" max-width="500">
      <v-card v-if="selectedItem" class="dlg" elevation="0">
        <div class="dlg-band" :style="{ '--tone': '#d97706' }" />
        <div class="dlg-head">
          <v-avatar size="44" color="primary" variant="tonal">
            {{ initials(selectedItem.name) }}
          </v-avatar>
          <div class="dlg-who">
            <div class="dlg-name">{{ selectedItem.name }}</div>
            <div class="dlg-sub">LRN {{ selectedItem.lrn }}</div>
          </div>
          <v-chip
            size="small"
            variant="tonal"
            :color="riskInfo(selectedItem.transmuted_grade).color"
            class="grade-chip"
          >
            {{ selectedItem.transmuted_grade }}
          </v-chip>
        </div>
        <v-divider />
        <v-card-text class="dlg-body">
          <div class="fact">
            <div class="fact-label">Subject</div>
            <div class="fact-value">{{ selectedItem.subject_title }}</div>
          </div>
          <div class="note note-reco">
            <div class="note-title">Recommended support</div>
            <p>{{ selectedItem.remarks }}</p>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn
            variant="flat"
            color="primary"
            @click="interventionDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Record / edit Action Taken (shared by both tables) -->
    <v-dialog v-model="actionDialog" max-width="480" persistent>
      <v-card v-if="actionDialogItem" class="dlg" elevation="0">
        <div class="dlg-band" style="--tone: #2b5fa8" />
        <div class="dlg-head">
          <v-avatar size="44" color="primary" variant="tonal">
            {{ initials(actionDialogItem.name) }}
          </v-avatar>
          <div class="dlg-who">
            <div class="dlg-name">
              {{ actionDialogItem.action_taken ? 'Edit' : 'Log' }} action taken
            </div>
            <div class="dlg-sub">{{ actionDialogItem.name }}</div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            :disabled="savingAction"
            @click="closeActionDialog"
          />
        </div>
        <v-divider />
        <v-card-text class="dlg-body">
          <div
            v-if="
              actionDialogType === 'at_risk'
                ? actionDialogItem.remarks
                : actionDialogItem.recommendation
            "
            class="note note-reco"
          >
            <div class="note-title">Recommended intervention</div>
            <p>
              {{
                actionDialogType === 'at_risk'
                  ? actionDialogItem.remarks
                  : actionDialogItem.recommendation
              }}
            </p>
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
            hide-details="auto"
            @update:model-value="actionError = ''"
            @keydown.enter.ctrl="confirmSaveAction"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3">
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
      misPage: 1,
      misItemsPerPage: 10,
      search: '',
      searchLardo: '',
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
        { title: 'LRN', key: 'lrn', align: 'start' },
        { title: 'Student', key: 'name' },
        { title: 'Grade', key: 'grade' },
        { title: 'Recommendation', key: 'remarks' },
        { title: 'Action taken', key: 'action_taken', sortable: false },
        { title: '', key: 'actions', align: 'end', sortable: false },
      ],
      headers1: [
        { title: 'LRN', key: 'lrn', align: 'start' },
        { title: 'Student', key: 'name' },
        { title: 'Alert', key: 'remarks' },
        { title: 'Recommendation', key: 'recommendation' },
        { title: 'Action taken', key: 'action_taken', sortable: false },
        { title: '', key: 'actions', align: 'end', sortable: false },
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
    stats() {
      return [
        {
          key: 'students',
          label: 'Total students',
          value: this.studentCount,
          icon: 'mdi-account-group-outline',
          color: '#2b5fa8',
        },
        {
          key: 'risk',
          label: 'At-risk students',
          value: this.atRiskCount,
          icon: 'mdi-alert-outline',
          color: '#c0392b',
          ofTotal: true,
        },
        {
          key: 'lardo',
          label: 'LARDO students',
          value: this.lardoCount,
          icon: 'mdi-clipboard-alert-outline',
          color: '#b45309',
          ofTotal: true,
        },
      ];
    },
    paginatedMisbehave() {
      const list = this.misbehaveList || [];
      const start = (this.misPage - 1) * this.misItemsPerPage;
      return list.slice(start, start + this.misItemsPerPage);
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
        labels: ['Total students', 'At risk', 'LARDO'],
        datasets: [
          {
            label: 'Students',
            data: [
              this.studentCount || 0,
              this.atRiskCount || 0,
              this.lardoCount || 0,
            ],
            backgroundColor: ['#2b5fa8', '#c0392b', '#b45309'],
            borderRadius: 6,
            maxBarThickness: 60,
          },
        ],
      };
    },
    // Buckets atRiskStudents by the same riskInfo() thresholds used in the
    // table, so the chart and the table can never disagree.
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
      const colorMap = {
        High: '#d63b3b',
        Moderate: '#e08a00',
        Passable: '#f2c200',
        Good: '#2e9e5b',
        'N/A': '#9aa0a6',
      };
      const entries = Object.entries(this.riskCounts).filter(([, v]) => v > 0);
      return {
        labels: entries.map(([label]) => label),
        datasets: [
          {
            data: entries.map(([, v]) => v),
            backgroundColor: entries.map(([label]) => colorMap[label]),
            borderWidth: 0,
          },
        ],
      };
    },
  },
  methods: {
    initialize() {
      this.getFacultyDashboardData();
    },
    percent(n) {
      if (!this.studentCount || !n) return 0;
      return Math.min(100, Math.round((n / this.studentCount) * 100));
    },
    initials(name) {
      return (
        String(name || '?')
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0].toUpperCase())
          .join('') || '?'
      );
    },
    stripLabel(remarks) {
      const r = remarks || '';
      const i = r.indexOf(':');
      return i > -1 ? r.slice(i + 1).trim() : r;
    },
    severityOf(remarks) {
      const r = remarks || '';
      if (r.startsWith('CRITICAL')) {
        return {
          label: 'Critical',
          color: 'red',
          hex: '#c0392b',
          icon: 'mdi-alert-octagon-outline',
        };
      }
      if (r.startsWith('EARLY WARNING')) {
        return {
          label: 'Early warning',
          color: 'orange',
          hex: '#d97706',
          icon: 'mdi-alert-outline',
        };
      }
      return {
        label: 'Notice',
        color: 'blue',
        hex: '#2b5fa8',
        icon: 'mdi-information-outline',
      };
    },
    openLardoDialog(item) {
      this.selectedLardoStudent = item;
      this.lardoDialog = true;
    },
    openAtRiskData(item) {
      if (
        item.remarks === 'Parent-Teacher Conference + Intensive Intervention'
      ) {
        this.selectedData = null;
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
      const filter = this.$store.getters.getFilterSelected;
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
        0: { label: 'Adviser review', color: 'amber-darken-2' },
        1: { label: 'Prefect review', color: 'orange' },
        2: { label: 'Parent review', color: 'red' },
      };
      return map[status] || { label: 'Resolved', color: 'green' };
    },

    // Opens the shared "Action Taken" dialog for a row from either table.
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
        this.actionError = 'Describe the action taken before saving';
        return;
      }
      this.persistAction(this.actionInput.trim());
    },
    clearAction() {
      this.persistAction('');
    },

    // NOTE: adjust the endpoint/payload shape to match your actual API.
    persistAction(value) {
      const item = this.actionDialogItem;
      const type = this.actionDialogType;
      if (!item) return;

      const previous = item.action_taken;
      item.action_taken = value;

      const oldData = {
        id: item.id,
        type,
        action_taken: item.action_taken,
        recommendation: type === 'lardo' ? item.recommendation : item.remarks,
      };
      const data = { data: JSON.stringify(oldData) };

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
            text: 'Could not save. Please try again.',
            color: 'error',
          };
        })
        .finally(() => {
          this.savingAction = false;
        });
    },

    getFacultyDashboardData() {
      const filter = this.$store.getters.getFilterSelected;
      const assignedModuleID = localStorage.getItem('AssignedModID');
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
          this.atRiskStudents = res.data.atRiskStudents ?? [];
          this.misbehaveList = res.data.misbehaveList ?? [];
          this.alertStudents = res.data.alertStudents ?? [];
          this.lardoStudents = res.data.lardoStudents ?? [];
        }
      });
    },
  },
};
</script>

<style scoped>
.dash {
  --line: rgba(var(--v-border-color), var(--v-border-opacity));
  --muted: rgba(var(--v-theme-on-surface), 0.62);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
}
.page-sub {
  margin: 2px 0 0;
  font-size: 14px;
  color: var(--muted);
}

/* ---------- Overview strip ---------- */
.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
}
.overview-cell {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border-right: 1px solid var(--line);
}
.overview-cell:last-child {
  border-right: 0;
}
.cell-icon {
  --tone: #666;
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: var(--tone);
  background: color-mix(in srgb, var(--tone) 14%, transparent);
}
.cell-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.cell-label {
  font-size: 13px;
  color: var(--muted);
}
.cell-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}
.cell-of {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
}
.cell-bar {
  display: block;
  height: 4px;
  margin-top: 8px;
  border-radius: 4px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  overflow: hidden;
}
.cell-bar > span {
  display: block;
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

/* ---------- Panels ---------- */
.panel {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
}
.panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}
.panel-title {
  font-size: 17px;
  font-weight: 650;
  line-height: 1.3;
}
.panel-sub {
  margin: 2px 0 12px;
  font-size: 13px;
  color: var(--muted);
}
.panel-head .panel-sub {
  margin-bottom: 0;
}
.search-field {
  min-width: 220px;
  max-width: 280px;
}
.chart-wrap {
  position: relative;
  height: 250px;
}

/* ---------- Tables ---------- */
.tbl {
  background: transparent;
}
.tbl :deep(thead th) {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--muted) !important;
  background: rgba(var(--v-theme-on-surface), 0.03) !important;
  white-space: nowrap;
}
.tbl :deep(tbody td) {
  font-size: 13.5px;
}
.tbl :deep(tbody tr:last-child td) {
  border-bottom: 0;
}

.person {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  font-size: 12px;
  font-weight: 600;
}
.person-name {
  font-weight: 550;
  white-space: nowrap;
}
.grade-chip {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.grade-label {
  margin-left: 6px;
  font-weight: 450;
  opacity: 0.8;
}
.wrap-chip {
  height: auto !important;
  min-height: 24px;
  padding-block: 4px;
}
.wrap-chip :deep(.v-chip__content) {
  white-space: normal;
  line-height: 1.3;
}

/* Action pill: shows the saved note and opens the edit dialog */
.action-pill {
  display: inline-flex;
  align-items: center;
  max-width: 260px;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.3;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;
}
.action-pill:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.action-pill--empty {
  color: var(--muted);
  font-weight: 500;
  background: rgba(var(--v-theme-on-surface), 0.05);
  border-color: var(--line);
}
.action-pill--empty:hover {
  background: rgba(var(--v-theme-on-surface), 0.1);
}
.action-pill--done {
  color: rgb(var(--v-theme-success));
  background: color-mix(in srgb, rgb(var(--v-theme-success)) 10%, transparent);
  border-color: color-mix(
    in srgb,
    rgb(var(--v-theme-success)) 30%,
    transparent
  );
}
.action-pill--done:hover {
  background: color-mix(in srgb, rgb(var(--v-theme-success)) 18%, transparent);
}
.action-pill-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pill-edit {
  opacity: 0;
  transition: opacity 0.12s ease;
}
.action-pill--done:hover .pill-edit,
.action-pill--done:focus-visible .pill-edit {
  opacity: 1;
}

.empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 32px 12px;
  text-align: center;
  font-size: 13px;
  color: var(--muted);
}
.empty strong {
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface));
}

/* ---------- Misbehavior ---------- */
.mis-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mis-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}
.mis-row:last-child {
  border-bottom: 0;
}
.mis-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---------- Dialogs ---------- */
.dlg {
  border-radius: 14px;
  overflow: hidden;
}
.dlg-band {
  --tone: #2b5fa8;
  height: 5px;
  background: var(--tone);
}
.dlg-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
}
.dlg-who {
  flex: 1;
  min-width: 0;
}
.dlg-name {
  font-size: 17px;
  font-weight: 650;
  line-height: 1.25;
}
.dlg-sub {
  font-size: 12.5px;
  color: var(--muted);
}
.dlg-body {
  padding: 18px 20px !important;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dlg-lead {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}
.fact-label {
  font-size: 12px;
  color: var(--muted);
}
.fact-value {
  margin-top: 2px;
  font-size: 14px;
  font-weight: 550;
}

.note {
  --tone: #2b5fa8;
  padding: 12px 14px;
  border-radius: 10px;
  border-left: 4px solid var(--tone);
  background: color-mix(in srgb, var(--tone) 9%, transparent);
}
.note-reco {
  --tone: #2f7d5b;
}
.note-done {
  --tone: #6b7685;
}
.note-title {
  margin-bottom: 4px;
  font-size: 12.5px;
  font-weight: 650;
}
.note p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.subject {
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
}
.subject-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.subject-title {
  font-weight: 650;
  font-size: 14px;
}
.subject-meta {
  margin-top: 2px;
  font-size: 12.5px;
  color: var(--muted);
}
.subject-reco {
  margin-top: 8px;
  font-size: 13.5px;
}

@media (max-width: 600px) {
  .overview-cell {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .overview-cell:last-child {
    border-bottom: 0;
  }
  .search-field {
    max-width: none;
    flex: 1 1 100%;
  }
}
</style>
