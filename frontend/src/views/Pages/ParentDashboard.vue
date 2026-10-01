<template>
  <v-container fluid class="dash pa-4 pa-md-6">
    <!-- Header -->
    <header class="page-head">
      <h1 class="page-title">Parent dashboard</h1>
      <p class="page-sub">
        Attendance, alerts and announcements for your child.
      </p>
    </header>

    <v-row dense>
      <!-- Student profile -->
      <v-col cols="12" md="5">
        <v-card class="panel panel-fill" elevation="0">
          <h2 class="panel-title">Student profile</h2>

          <div v-if="currentStudent" class="profile">
            <v-avatar
              size="64"
              color="primary"
              variant="tonal"
              class="p-avatar"
            >
              {{ initials(currentStudent.name) }}
            </v-avatar>
            <div class="profile-info">
              <div class="profile-name">{{ currentStudent.name }}</div>
              <div class="profile-meta">LRN {{ currentStudent.lrnNo }}</div>
              <div class="profile-meta">{{ currentStudent.grade_level }}</div>
            </div>
          </div>

          <div v-if="studentList.length > 1" class="switcher">
            <v-btn
              icon="mdi-chevron-left"
              variant="tonal"
              size="small"
              aria-label="Previous child"
              :disabled="activeIndex === 0"
              @click="activeIndex--"
            />
            <span class="switcher-label">
              Child {{ activeIndex + 1 }} of {{ studentList.length }}
            </span>
            <v-btn
              icon="mdi-chevron-right"
              variant="tonal"
              size="small"
              aria-label="Next child"
              :disabled="activeIndex === studentList.length - 1"
              @click="activeIndex++"
            />
          </div>

          <div v-if="!studentList.length" class="empty">
            <v-icon icon="mdi-account-search-outline" size="34" />
            <strong>No students linked</strong>
            <span>No students are linked to this account.</span>
          </div>
        </v-card>
      </v-col>

      <!-- Attendance -->
      <v-col cols="12" md="7">
        <v-card class="panel panel-fill" elevation="0">
          <h2 class="panel-title">Attendance</h2>
          <p class="panel-sub">Present days as a share of school days</p>

          <v-row align="center">
            <v-col cols="12" sm="4" class="text-center">
              <v-progress-circular
                :model-value="percent || 0"
                size="124"
                width="12"
                :color="attendanceColor"
              >
                <span class="ring-value">{{ percent || 0 }}%</span>
              </v-progress-circular>
            </v-col>

            <v-col cols="12" sm="8">
              <ul class="att-list">
                <li class="att-row">
                  <v-icon icon="mdi-check-circle" color="green" size="20" />
                  <span class="att-label">Present</span>
                  <span class="att-value">{{ present ?? 0 }}</span>
                </li>
                <li class="att-row">
                  <v-icon icon="mdi-close-circle" color="red" size="20" />
                  <span class="att-label">Absences</span>
                  <span class="att-value">{{ absent ?? 0 }}</span>
                </li>
                <li class="att-row">
                  <v-icon
                    icon="mdi-file-document-alert"
                    color="amber-darken-2"
                    size="20"
                  />
                  <span class="att-label">Excused</span>
                  <span class="att-value">{{ excuse ?? 0 }}</span>
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alerts -->
    <v-row v-if="lardoAlert || disciplineCase" dense>
      <v-col v-if="lardoAlert" cols="12" md="6">
        <v-card class="panel panel-fill" elevation="0">
          <div class="dlg-band" style="--tone: #c0392b" />
          <h2 class="panel-title">Alert status</h2>
          <p class="panel-sub">Learner at risk of dropping out (LARDO)</p>

          <div class="note" style="--tone: #c0392b">
            <div class="note-title">Reason</div>
            <p>{{ lardoAlert.remarks }}</p>
          </div>

          <dl class="facts">
            <div>
              <dt>Teacher</dt>
              <dd>{{ lardoAlert.teacher_name }}</dd>
            </div>
            <div>
              <dt>Recommendation</dt>
              <dd>{{ lardoAlert.recommendation }}</dd>
            </div>
          </dl>
        </v-card>
      </v-col>

      <v-col v-if="disciplineCase" cols="12" md="6">
        <v-card class="panel panel-fill" elevation="0">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Discipline case</h2>
              <p class="panel-sub">Where the case stands</p>
            </div>
            <v-chip size="small" variant="tonal" color="blue">
              {{ disciplineCase.type }}
            </v-chip>
          </div>

          <ol class="steps">
            <li
              v-for="(step, i) in disciplineSteps"
              :key="step"
              class="step"
              :class="{ done: i <= currentDisciplineStep }"
            >
              <span class="step-dot">
                <v-icon v-if="i <= currentDisciplineStep" size="14">
                  mdi-check
                </v-icon>
              </span>
              <span class="step-label">{{ step }}</span>
            </li>
          </ol>

          <div
            class="note"
            :style="{
              '--tone': disciplineCase.status === 4 ? '#2e9e5b' : '#d97706',
            }"
          >
            <div class="note-title">Current status</div>
            <p>{{ disciplineStatusLabel(disciplineCase.status) }}</p>
          </div>

          <v-btn
            class="mt-4"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-eye-outline"
            block
            @click="disciplineDialog = true"
          >
            View details
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Announcements -->
    <section>
      <h2 class="section-title">Announcements</h2>

      <v-card
        v-for="(post, index) in posts"
        :key="post.postID ?? index"
        class="panel post"
        elevation="0"
      >
        <div class="post-head">
          <v-avatar size="40" color="primary" variant="tonal" class="avatar">
            {{ initials(post.teacherName) }}
          </v-avatar>
          <div>
            <div class="post-author">{{ post.teacherName }}</div>
            <div class="post-date">{{ formatDate(post.date) }}</div>
          </div>
        </div>

        <p class="post-text">{{ post.text }}</p>

        <v-btn
          variant="text"
          size="small"
          prepend-icon="mdi-comment-outline"
          @click="post.showComment = !post.showComment"
        >
          Comments ({{ post.comments.length }})
        </v-btn>

        <v-expand-transition>
          <div v-if="post.showComment" class="comments">
            <div class="comment-form">
              <v-text-field
                v-model="post.newComment"
                label="Write a comment"
                density="compact"
                variant="outlined"
                hide-details
                @keyup.enter="addComment(index)"
              />
              <v-btn
                icon="mdi-send"
                variant="flat"
                color="primary"
                size="small"
                aria-label="Send comment"
                @click="addComment(index)"
              />
            </div>

            <ul v-if="post.comments.length" class="comment-list">
              <li v-for="(c, i) in post.comments" :key="i" class="comment">
                <v-avatar
                  size="28"
                  color="primary"
                  variant="tonal"
                  class="avatar"
                >
                  {{ initials(c.name) }}
                </v-avatar>
                <div class="bubble">
                  <div class="bubble-name">{{ c.name }}</div>
                  <div>{{ c.title }}</div>
                </div>
              </li>
            </ul>
            <p v-else class="no-comments">No comments yet.</p>
          </div>
        </v-expand-transition>
      </v-card>

      <v-card v-if="!posts.length" class="panel" elevation="0">
        <div class="empty">
          <v-icon icon="mdi-bulletin-board" size="34" />
          <strong>No announcements yet</strong>
          <span>Teacher announcements will appear here.</span>
        </div>
      </v-card>
    </section>

    <!-- Discipline details dialog -->
    <v-dialog v-model="disciplineDialog" max-width="640" scrollable>
      <v-card v-if="disciplineCase" class="dlg" elevation="0">
        <div
          class="dlg-band"
          :style="{
            '--tone': disciplineCase.report_type === 2 ? '#c0392b' : '#2b5fa8',
          }"
        />
        <div class="dlg-head">
          <v-avatar
            size="44"
            :color="reportTypeColor(disciplineCase.report_type)"
            variant="tonal"
          >
            <v-icon :icon="reportTypeIcon(disciplineCase.report_type)" />
          </v-avatar>
          <div class="dlg-who">
            <div class="dlg-name">
              {{ reportTypeLabel(disciplineCase.report_type) }}
            </div>
            <div class="dlg-sub">
              Case #{{ disciplineCase.id }},
              {{ formatDateTime(disciplineCase.createdAt) }}
            </div>
          </div>
          <v-chip
            size="small"
            variant="tonal"
            :color="disciplineCase.status === 4 ? 'success' : 'warning'"
          >
            {{ disciplineStatusLabel(disciplineCase.status) }}
          </v-chip>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            aria-label="Close"
            @click="disciplineDialog = false"
          />
        </div>

        <v-divider />

        <v-card-text class="dlg-body">
          <dl class="facts facts-grid">
            <div>
              <dt>Student</dt>
              <dd>{{ disciplineCase.studentID }}</dd>
            </div>
            <div>
              <dt>Teacher</dt>
              <dd>{{ disciplineCase.teacherID }}</dd>
            </div>
            <div>
              <dt>Room</dt>
              <dd>{{ disciplineCase.roomID }}</dd>
            </div>
            <div>
              <dt>Grade level</dt>
              <dd>{{ disciplineCase.grade_level }}</dd>
            </div>
            <div>
              <dt>Subject</dt>
              <dd>{{ disciplineCase.subjectID }}</dd>
            </div>
            <div>
              <dt>School year</dt>
              <dd>{{ disciplineCase.school_yearID }}</dd>
            </div>
            <div class="span-2">
              <dt>Reported</dt>
              <dd>
                {{ disciplineCase.report_date }},
                {{ disciplineCase.report_time }}
              </dd>
            </div>
          </dl>

          <div>
            <div class="fact-label">Tagged students</div>
            <div v-if="taggedStudentsList.length" class="tags">
              <v-chip
                v-for="student in taggedStudentsList"
                :key="student"
                size="small"
                variant="tonal"
                prepend-icon="mdi-account"
              >
                {{ student }}
              </v-chip>
            </div>
            <div v-else class="muted-text">None tagged</div>
          </div>

          <div class="note">
            <div class="note-title">Report description</div>
            <p>
              {{
                disciplineCase.report_description || 'No description provided.'
              }}
            </p>
          </div>

          <div class="note note-done">
            <div class="note-title">Comments</div>
            <p>{{ disciplineCase.comments || 'No comments provided.' }}</p>
          </div>

          <div class="muted-text">
            Last updated {{ formatDateTime(disciplineCase.updatedAt) }}
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn
            variant="flat"
            color="primary"
            @click="disciplineDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    lardoAlert: null,
    disciplineDialog: false,
    disciplineCase: null,
    disciplineSteps: ['Reported', 'Counseled', 'Referred to Prefect'],
    studentList: [],
    activeIndex: 0,
    present: null,
    absent: null,
    posts: [],
    excuse: null,
    percent: null,
  }),
  computed: {
    currentStudent() {
      return this.studentList[this.activeIndex] || null;
    },
    currentDisciplineStep() {
      return this.disciplineStatusStep(this.disciplineCase?.status);
    },
    attendanceColor() {
      const p = this.percent || 0;
      if (p >= 90) return 'green';
      if (p >= 75) return 'orange';
      return 'red';
    },
    taggedStudentsList() {
      const raw = this.disciplineCase?.tag_students;
      if (!raw) return [];
      try {
        return Array.isArray(raw) ? raw : JSON.parse(raw);
      } catch (e) {
        return [];
      }
    },
  },
  mounted() {
    this.initialize();
  },
  watch: {
    // Changing the active child (arrows below the profile) loads their data.
    activeIndex(newIndex) {
      const student = this.studentList[newIndex];
      if (!student) return;
      this.studentData(student);
      this.getParentAnnouncements(student);
    },
    '$store.getters.getFilterSelected'() {
      this.initialize();
    },
  },
  methods: {
    initialize() {
      this.getMyStudent();
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
    disciplineStatusLabel(status) {
      return (
        { 0: 'Adviser review', 1: 'Prefect review', 4: 'Resolved' }[status] ??
        'Unknown'
      );
    },
    reportTypeLabel(type) {
      return (
        { 1: 'Academic concern', 2: 'Disciplinary concern' }[type] ?? 'Unknown'
      );
    },
    reportTypeIcon(type) {
      return (
        { 1: 'mdi-school', 2: 'mdi-alert-octagon' }[type] ?? 'mdi-help-circle'
      );
    },
    reportTypeColor(type) {
      return { 1: 'blue', 2: 'red' }[type] ?? 'grey';
    },
    // status 0 -> step 0, 1 -> step 1, 4 -> step 2 (2/3 unused)
    disciplineStatusStep(status) {
      if (status === 0) return 0;
      if (status === 1) return 1;
      if (status === 4) return 2;
      return 0;
    },
    riskLevelColor(level) {
      const l = (level || '').toLowerCase();
      if (l === 'high') return 'red';
      if (l === 'medium') return 'orange';
      return 'green';
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return date;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    // formatDateTime was commented out in the original but still used in the
    // dialog. Swap the locale/options if you already have your own version.
    formatDateTime(dt) {
      if (!dt) return '';
      const d = new Date(dt);
      if (Number.isNaN(d.getTime())) return dt;
      return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    },
    getStudentAlerts(student) {
      const filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/parent-records/getStudentAlerts/' + filter + '/' + student.id,
        'GET',
      ).then((res) => {
        if (res) {
          this.lardoAlert = res.data.lardoData || null;
          this.disciplineCase = res.data.disciplineData || null;
        }
      });
    },
    getMyStudent() {
      this.filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/parent-records/getMyChildrenList/' + this.filter,
        'GET',
      ).then((res) => {
        if (res) {
          const data = res.data || [];
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.studentList = data;
          if (data.length) {
            // Keep the selected child if the list reloads (e.g. after a comment).
            if (this.activeIndex >= data.length) this.activeIndex = 0;
            this.studentData(data[this.activeIndex]);
            this.getParentAnnouncements(data[this.activeIndex]);
          }
        }
      });
    },
    studentData(student) {
      const filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/parent-records/getStudentAchievements/' + filter + '/' + student.id,
        'GET',
      ).then((res) => {
        if (res) {
          this.present = res.data.present;
          this.absent = res.data.absent;
          this.excuse = res.data.excuse;
          this.percent = res.data.percent;
        }
      });
      this.getStudentAlerts(student);
    },
    getParentAnnouncements(student) {
      const filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/parent-records/getParentAnnouncements/' + filter + '/' + student.id,
        'GET',
      ).then((res) => {
        if (res) {
          const data = res.data || [];
          for (let i = 0; i < data.length; i++) {
            data[i].teacherName = this.toTitleCase(data[i].teacherName);
          }
          this.posts = data;
        }
      });
    },
    addComment(i) {
      const userID = this.$store.state.user.id;
      const filter = this.$store.getters.getFilterSelected;
      const p = this.posts[i];
      if (!p.newComment) return;

      const commentData = {
        userID: userID,
        title: p.newComment,
        school_yearID: filter,
        postID: p.postID,
      };
      const data = { data: JSON.stringify(commentData) };
      this.axiosCall('/announcement/addComment', 'POST', data).then((res) => {
        if (res.data.status == 201) {
          this.initialize();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
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
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
}
.page-sub {
  margin: 2px 0 4px;
  font-size: 14px;
  color: var(--muted);
}

/* ---------- Panels ---------- */
.panel {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
  overflow: hidden;
}
.panel-fill {
  height: 100%;
}
.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.panel-title {
  font-size: 17px;
  font-weight: 650;
  line-height: 1.3;
}
.panel-sub {
  margin: 2px 0 14px;
  font-size: 13px;
  color: var(--muted);
}
.section-title {
  margin: 8px 0 12px;
  font-size: 19px;
  font-weight: 650;
}

/* ---------- Profile ---------- */
.profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
}
.p-avatar {
  flex: none;
  font-size: 22px;
  font-weight: 650;
}
.profile-name {
  font-size: 18px;
  font-weight: 650;
  line-height: 1.25;
}
.profile-meta {
  font-size: 13px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}
.switcher-label {
  font-size: 13px;
  color: var(--muted);
}

/* ---------- Attendance ---------- */
.ring-value {
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.att-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.att-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}
.att-row:last-child {
  border-bottom: 0;
}
.att-label {
  flex: 1;
  color: var(--muted);
  font-size: 14px;
}
.att-value {
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* ---------- Notes, facts, steps ---------- */
.note {
  --tone: #2b5fa8;
  padding: 12px 14px;
  border-radius: 10px;
  border-left: 4px solid var(--tone);
  background: color-mix(in srgb, var(--tone) 9%, transparent);
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

.facts {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0 0;
}
.facts dt,
.fact-label {
  font-size: 12px;
  color: var(--muted);
}
.facts dd {
  margin: 2px 0 0;
  font-size: 14px;
  font-weight: 550;
}
.facts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px 18px;
  margin: 0;
}
.span-2 {
  grid-column: span 2;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}
.muted-text {
  font-size: 13px;
  color: var(--muted);
}

.steps {
  list-style: none;
  display: flex;
  margin: 0 0 16px;
  padding: 0;
}
.step {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  left: calc(50% + 16px);
  right: calc(-50% + 16px);
  height: 2px;
  background: rgba(var(--v-theme-on-surface), 0.15);
}
.step.done:not(:last-child)::after {
  background: rgb(var(--v-theme-success));
}
.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(var(--v-theme-on-surface), 0.15);
}
.step.done .step-dot {
  background: rgb(var(--v-theme-success));
}
.step-label {
  font-size: 12px;
  color: var(--muted);
}
.step.done .step-label {
  color: rgb(var(--v-theme-on-surface));
}

/* ---------- Announcements ---------- */
.post {
  margin-bottom: 12px;
}
.post-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  font-size: 12px;
  font-weight: 600;
}
.post-author {
  font-weight: 650;
  font-size: 14.5px;
}
.post-date {
  font-size: 12.5px;
  color: var(--muted);
}
.post-text {
  margin: 12px 0 8px;
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-line;
}
.comments {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}
.comment-form {
  display: flex;
  align-items: center;
  gap: 8px;
}
.comment-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.comment {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.bubble {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 13.5px;
  background: rgba(var(--v-theme-on-surface), 0.05);
}
.bubble-name {
  font-size: 12px;
  font-weight: 650;
}
.no-comments {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 28px 12px;
  text-align: center;
  font-size: 13px;
  color: var(--muted);
}
.empty strong {
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface));
}

/* ---------- Dialog ---------- */
.dlg {
  border-radius: 14px;
  overflow: hidden;
}
.dlg-band {
  --tone: #2b5fa8;
  height: 5px;
  background: var(--tone);
}
.panel > .dlg-band {
  position: absolute;
  inset: 0 0 auto 0;
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
  gap: 16px;
}

@media (max-width: 600px) {
  .facts-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
