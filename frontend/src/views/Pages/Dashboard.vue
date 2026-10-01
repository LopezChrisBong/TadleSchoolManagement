<template>
  <v-container fluid class="dash pa-4 pa-md-6">
    <!-- Overview strip -->
    <section class="overview" aria-label="Overview">
      <component
        :is="s.action ? 'button' : 'div'"
        v-for="s in stats"
        :key="s.key"
        class="overview-cell"
        :class="{ clickable: !!s.action }"
        :type="s.action ? 'button' : undefined"
        @click="s.action && s.action()"
      >
        <span class="cell-icon" :style="{ '--tone': s.color }">
          <v-icon :icon="s.icon" size="20" />
        </span>
        <span class="cell-body">
          <span class="cell-label">{{ s.label }}</span>
          <span class="cell-value">
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="18"
              width="2"
            />
            <template v-else>{{ s.value ?? 0 }}</template>
            <small v-if="s.ofTotal && totalStudents" class="cell-of">
              of {{ totalStudents }}
            </small>
          </span>
          <span v-if="s.ofTotal && totalStudents" class="cell-bar">
            <span
              :style="{
                width: percent(s.value) + '%',
                background: s.color,
              }"
            />
          </span>
        </span>
      </component>
    </section>

    <!-- At-risk table -->
    <v-card class="panel" elevation="0">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Students at risk</h2>
          <p class="panel-sub">
            {{ filteredAtRisk.length }}
            {{ filteredAtRisk.length === 1 ? 'student' : 'students' }} with a
            grade of 80 or below
          </p>
        </div>

        <div class="panel-tools">
          <template v-if="assignedModuleID == 1">
            <v-select
              v-model="selectedLevel"
              :items="levelOptions"
              label="Level"
              density="compact"
              variant="outlined"
              clearable
              hide-details
              class="filter-field"
              @update:model-value="onLevelChange"
            />
            <v-select
              v-model="selectedGrade"
              :items="gradeOptions"
              label="Grade"
              density="compact"
              variant="outlined"
              clearable
              hide-details
              :disabled="!selectedLevel"
              class="filter-field"
            />
          </template>
          <v-text-field
            v-model="search"
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search name, LRN, adviser"
            hide-details
            single-line
            clearable
            class="search-field"
          />
        </div>
      </div>

      <div class="legend">
        <span><i class="dot dot-safe" />Safe, above 80</span>
        <span><i class="dot dot-watch" />Watch, 76 to 80</span>
        <span><i class="dot dot-risk" />At risk, 75 or below</span>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredAtRisk"
        :search="search"
        :loading="loading"
        density="comfortable"
        hover
        class="tbl"
      >
        <template v-slot:[`item.student_name`]="{ item }">
          <div class="person">
            <v-avatar size="30" class="avatar" color="primary" variant="tonal">
              {{ initials(item.student_name) }}
            </v-avatar>
            <span class="person-name">{{ item.student_name }}</span>
          </div>
        </template>

        <template v-slot:[`item.transmuted_grade`]="{ item }">
          <v-chip
            size="small"
            :color="riskColor(item.transmuted_grade)"
            variant="tonal"
            class="grade-chip"
          >
            <i class="dot" :class="'dot-' + riskKey(item.transmuted_grade)" />
            {{ item.transmuted_grade }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn size="small" variant="text" @click="viewStudent(item)">
            View
          </v-btn>
          <v-btn size="small" variant="tonal" @click="editStudent(item)">
            Edit
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="empty">
            <v-icon icon="mdi-check-circle-outline" size="34" />
            <strong>No at-risk students</strong>
            <span
              >Everyone matching these filters is above the watch line.</span
            >
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Lardo table -->
    <v-card class="panel" elevation="0">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">Lardo alerts</h2>
          <p class="panel-sub">
            {{ lardo.length }}
            {{ lardo.length === 1 ? 'alert' : 'alerts' }} raised from attendance
            tracking
          </p>
        </div>
      </div>

      <v-data-table
        :headers="headers_lardo"
        :items="lardo"
        :search="search"
        :loading="loading"
        density="comfortable"
        hover
        class="tbl"
      >
        <template v-slot:[`item.student_name`]="{ item }">
          <div class="person">
            <v-avatar size="30" class="avatar" color="primary" variant="tonal">
              {{ initials(item.student_name) }}
            </v-avatar>
            <span class="person-name">{{ item.student_name }}</span>
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

        <template v-slot:[`item.action_taken`]="{ item }">
          <v-chip
            size="small"
            variant="text"
            :color="item.action_taken ? 'success' : 'grey'"
          >
            {{ item.action_taken ? 'Action recorded' : 'Pending' }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-message-text-outline"
            @click="openRemarks(item)"
          >
            Remarks
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="empty">
            <v-icon icon="mdi-check-circle-outline" size="34" />
            <strong>No Lardo alerts</strong>
            <span>New alerts will appear here as attendance is recorded.</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Remarks dialog -->
    <v-dialog v-model="remarksDialog" max-width="560">
      <v-card v-if="selected" class="remarks" elevation="0">
        <div class="remarks-band" :style="{ '--tone': severity.hex }" />

        <div class="remarks-head">
          <v-avatar size="44" color="primary" variant="tonal">
            {{ initials(selected.student_name) }}
          </v-avatar>
          <div class="remarks-who">
            <div class="remarks-name">{{ selected.student_name }}</div>
            <div class="remarks-lrn">LRN {{ selected.lrn }}</div>
          </div>
          <v-chip
            :color="severity.color"
            :prepend-icon="severity.icon"
            variant="tonal"
            size="small"
          >
            {{ severity.label }}
          </v-chip>
        </div>

        <v-divider />

        <v-card-text class="remarks-body">
          <dl class="facts">
            <div>
              <dt>Grade and section</dt>
              <dd>{{ selected.grade_level }}, {{ selected.room_name }}</dd>
            </div>
            <div>
              <dt>Subject</dt>
              <dd>{{ selected.subject_title }}</dd>
            </div>
            <div>
              <dt>Adviser</dt>
              <dd>{{ selected.adviser }}</dd>
            </div>
            <div>
              <dt>Flagged on</dt>
              <dd>{{ formatDate(selected.created_at) }}</dd>
            </div>
          </dl>

          <div class="note" :style="{ '--tone': severity.hex }">
            <div class="note-title">What happened</div>
            <p>{{ remarkParts.finding }}</p>
          </div>

          <div v-if="remarkParts.recommendation" class="note note-reco">
            <div class="note-title">Recommended action</div>
            <p>{{ remarkParts.recommendation }}</p>
          </div>

          <div v-if="selected.action_taken" class="note note-done">
            <div class="note-title">Action taken</div>
            <p>{{ selected.action_taken }}</p>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn variant="flat" color="primary" @click="closeRemarks">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const JHS_GRADES = [7, 8, 9, 10];
const SHS_GRADES = [11, 12];

export default {
  data() {
    return {
      remarksDialog: false,
      selected: null,
      headers: [
        { title: 'LRN', key: 'lrn' },
        { title: 'Student', key: 'student_name' },
        { title: 'Grade', key: 'transmuted_grade' },
        { title: 'Adviser', key: 'adviser' },
        { title: 'Subject teacher', key: 'teacher' },
        { title: 'Subject', key: 'subject_title' },
        { title: 'Level', key: 'grade_level' },
        { title: 'Section', key: 'room_name' },
        // { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
      ],
      headers_lardo: [
        { title: 'LRN', key: 'lrn' },
        { title: 'Student', key: 'student_name' },
        { title: 'Alert', key: 'remarks' },
        { title: 'Status', key: 'action_taken' },
        { title: 'Adviser', key: 'adviser' },
        { title: 'Subject', key: 'subject_title' },
        { title: 'Level', key: 'grade_level' },
        { title: 'Section', key: 'room_name' },
        { title: '', key: 'actions', sortable: false, align: 'end' },
      ],
      juniorCount: null,
      seniorCount: null,
      assignedModuleID: null,
      riskCount: null,
      lardoCount: null,
      totalStudents: null,
      atRisk: [],
      lardo: [],
      search: '',
      loading: false,

      levelOptions: ['Junior High', 'Senior High'],
      selectedLevel: null,
      selectedGrade: null,
    };
  },
  computed: {
    stats() {
      const id = Number(this.assignedModuleID);
      const list = [];
      if (id === 28 || id === 1) {
        list.push({
          key: 'jhs',
          label: 'JHS students',
          value: this.juniorCount,
          icon: 'mdi-school-outline',
          color: '#2f7d5b',
          action: this.JuniorHighList,
        });
      }
      if (id === 29 || id === 1) {
        list.push({
          key: 'shs',
          label: 'SHS students',
          value: this.seniorCount,
          icon: 'mdi-school',
          color: '#2b5fa8',
          action: this.SeniorHighList,
        });
      }
      list.push({
        key: 'risk',
        label: 'At-risk students',
        value: this.riskCount,
        icon: 'mdi-alert-outline',
        color: '#c0392b',
        ofTotal: true,
        action: this.AtRiskList,
      });
      // The Lardo card has no PDF of its own yet, so it is not clickable.
      list.push({
        key: 'lardo',
        label: 'Lardo students',
        value: this.lardoCount,
        icon: 'mdi-account-alert-outline',
        color: '#b45309',
        ofTotal: true,
        action: this.LardoList,
      });
      return list;
    },
    gradeOptions() {
      if (this.selectedLevel === 'Junior High') {
        return JHS_GRADES.map((g) => ({ title: `Grade ${g}`, value: g }));
      }
      if (this.selectedLevel === 'Senior High') {
        return SHS_GRADES.map((g) => ({ title: `Grade ${g}`, value: g }));
      }
      return [];
    },
    filteredAtRisk() {
      return this.atRisk.filter((item) => {
        const grade = this.extractGradeNumber(item.grade_level);
        if (
          this.selectedLevel === 'Junior High' &&
          !JHS_GRADES.includes(grade)
        ) {
          return false;
        }
        if (
          this.selectedLevel === 'Senior High' &&
          !SHS_GRADES.includes(grade)
        ) {
          return false;
        }
        if (this.selectedGrade && grade !== this.selectedGrade) {
          return false;
        }
        return true;
      });
    },
    severity() {
      return this.severityOf(this.selected?.remarks);
    },
    remarkParts() {
      const r = this.selected?.remarks || '';
      const i = r.indexOf(':');
      const body = i > -1 ? r.slice(i + 1).trim() : r;
      const j = body.search(/Recommendation:/i);
      if (j === -1) return { finding: body, recommendation: '' };
      return {
        finding: body.slice(0, j).trim(),
        recommendation: body.slice(j + 'Recommendation:'.length).trim(),
      };
    },
  },
  mounted() {
    if (localStorage.getItem('AssignedModID') == null) {
      localStorage.setItem(
        'AssignedModID',
        this.$store.state.user.user.assignedModuleID,
      );
      this.assignedModuleID = localStorage.getItem('AssignedModID');
    } else {
      this.assignedModuleID = localStorage.getItem('AssignedModID');
    }
    this.initialize();
  },
  watch: {
    '$store.getters.getFilterSelected'() {
      this.initialize();
    },
  },
  methods: {
    initialize() {
      if (localStorage.getItem('AssignedModID') == null) {
        localStorage.setItem(
          'AssignedModID',
          this.$store.state.user.user.assignedModuleID,
        );
      }
      this.assignedModuleID = localStorage.getItem('AssignedModID');
      this.getFacultyDashboardData();
    },
    percent(n) {
      if (!this.totalStudents || !n) return 0;
      return Math.min(100, Math.round((n / this.totalStudents) * 100));
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
    riskKey(risk) {
      if (risk == null) return 'none';
      if (risk <= 75) return 'risk';
      if (risk <= 80) return 'watch';
      return 'safe';
    },
    riskColor(risk) {
      return { none: 'grey', risk: 'red', watch: 'orange', safe: 'green' }[
        this.riskKey(risk)
      ];
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
    // Pulls the numeric grade out of "Grade 7", "7", 7, "G11", etc.
    extractGradeNumber(gradeLevel) {
      if (gradeLevel == null) return null;
      const match = String(gradeLevel).match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    },
    onLevelChange() {
      this.selectedGrade = null;
    },
    viewStudent(item) {
      this.$emit('view-student', item);
    },
    editStudent(item) {
      this.$emit('edit-student', item);
    },
    openRemarks(item) {
      this.selected = item;
      this.remarksDialog = true;
    },
    closeRemarks() {
      this.remarksDialog = false;
    },
    formatDate(d) {
      return d
        ? new Date(d).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '—';
    },
    openPdf(path) {
      window.open(process.env.VUE_APP_SERVER + path, '_blank');
    },
    JuniorHighList() {
      const filter = this.$store.getters.getFilterSelected;
      this.openPdf(
        '/pdf-generator/getAllStudenListByLevel/' + filter + '/Junior High',
      );
    },
    SeniorHighList() {
      const filter = this.$store.getters.getFilterSelected;
      this.openPdf(
        '/pdf-generator/getAllStudenListByLevel/' + filter + '/Senior High',
      );
    },
    AtRiskList() {
      const filter = this.$store.getters.getFilterSelected;
      this.openPdf(
        '/pdf-generator/getAllAtRiskStudents/' +
          filter +
          '/' +
          this.assignedModuleID,
      );
    },
    LardoList() {
      const filter = this.$store.getters.getFilterSelected;
      this.openPdf(
        '/pdf-generator/getAllLardoStudents/' +
          filter +
          '/' +
          this.assignedModuleID,
      );
    },
    getFacultyDashboardData() {
      const filter = this.$store.getters.getFilterSelected;
      this.loading = true;
      this.axiosCall(
        '/enroll-student/getAdminDashboardData/' +
          filter +
          '/' +
          this.assignedModuleID,
        'GET',
      )
        .then((res) => {
          if (res) {
            this.juniorCount = res.data.juniorCount;
            this.seniorCount = res.data.seniorCount;
            this.atRisk = res.data.atRisk ?? [];
            this.riskCount = res.data.riskCount ?? 0;
            this.totalStudents = res.data.totalStudents ?? null;
            this.lardo = res.data.lardo ?? [];
            this.lardoCount = res.data.lardoCount ?? 0;
          }
        })
        .finally(() => {
          this.loading = false;
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
  text-align: left;
  background: transparent;
  border: 0;
  border-right: 1px solid var(--line);
  color: inherit;
  font: inherit;
}
.overview-cell:last-child {
  border-right: 0;
}
.overview-cell.clickable {
  cursor: pointer;
  transition: background 0.15s ease;
}
.overview-cell.clickable:hover {
  background: rgba(var(--v-theme-on-surface), 0.04);
}
.overview-cell.clickable:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: -2px;
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
  min-width: 0;
  flex: 1;
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
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--muted);
}
.panel-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.filter-field {
  min-width: 150px;
  max-width: 180px;
}
.search-field {
  min-width: 220px;
  max-width: 280px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--muted);
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
  vertical-align: middle;
}
.dot-safe {
  background: #2e9e5b;
}
.dot-watch {
  background: #e08a00;
}
.dot-risk {
  background: #d63b3b;
}
.dot-none {
  background: #9aa0a6;
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

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 36px 12px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}
.empty strong {
  color: rgb(var(--v-theme-on-surface));
  font-size: 14px;
}

/* ---------- Remarks dialog ---------- */
.remarks {
  border-radius: 14px;
  overflow: hidden;
}
.remarks-band {
  --tone: #2b5fa8;
  height: 5px;
  background: var(--tone);
}
.remarks-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
}
.remarks-who {
  flex: 1;
  min-width: 0;
}
.remarks-name {
  font-size: 17px;
  font-weight: 650;
  line-height: 1.25;
}
.remarks-lrn {
  font-size: 12.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.remarks-body {
  padding: 18px 20px !important;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
  margin: 0;
}
.facts dt {
  font-size: 12px;
  color: var(--muted);
}
.facts dd {
  margin: 2px 0 0;
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
  font-size: 12.5px;
  font-weight: 650;
  margin-bottom: 4px;
}
.note p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .overview-cell {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .overview-cell:last-child {
    border-bottom: 0;
  }
  .facts {
    grid-template-columns: 1fr;
  }
  .search-field,
  .filter-field {
    max-width: none;
    flex: 1 1 100%;
  }
}
</style>
