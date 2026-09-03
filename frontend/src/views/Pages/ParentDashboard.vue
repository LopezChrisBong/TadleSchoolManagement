<template>
  <v-container fluid class="pa-6 parent-bg">
    <v-row>
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="5">
        <!-- Student Profile -->
        <v-card class="pa-4 rounded-xl mb-4 border" elevation="0">
          <div class="text-h6 font-weight-bold mb-4">Student Profile</div>

          <v-carousel
            v-if="studentList.length"
            height="170"
            v-model="activeIndex"
            hide-delimiter-background
            show-arrows
            class="profile-carousel"
          >
            <template v-slot:prev="{ props }">
              <v-btn
                color="white"
                icon
                variant="text"
                @click="
                  props.onClick();
                  studentData(studentList[activeIndex]);
                "
              >
                <v-icon size="28">mdi-chevron-left</v-icon>
              </v-btn>
            </template>
            <template v-slot:next="{ props }">
              <v-btn
                color="white"
                icon
                variant="text"
                @click="
                  props.onClick();
                  studentData(studentList[activeIndex]);
                "
              >
                <v-icon size="28">mdi-chevron-right</v-icon>
              </v-btn>
            </template>

            <v-carousel-item v-for="(slide, i) in studentList" :key="i">
              <v-sheet
                :color="colors[i % colors.length]"
                height="100%"
                class="carousel-sheet"
              >
                <v-avatar size="80" class="profile-avatar">
                  <v-icon size="44" color="white">mdi-account</v-icon>
                </v-avatar>

                <div class="profile-info">
                  <div class="font-weight-bold text-body-1 text-white">
                    {{ slide.name }}
                  </div>
                  <div class="text-caption text-white profile-meta">
                    LRN: {{ slide.lrnNo }}
                  </div>
                  <div class="text-caption text-white profile-meta">
                    Grade: {{ slide.grade_level }}
                  </div>
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>

          <div v-else class="empty-state py-8 text-center text-medium-emphasis">
            <v-icon icon="mdi-account-search-outline" size="32" class="mb-2" />
            <div>No students linked to this account.</div>
          </div>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" md="7">
        <!-- Attendance Overview -->
        <v-card class="pa-6 rounded-xl mb-4 border" elevation="0">
          <div class="text-h6 font-weight-bold mb-4">Attendance Overview</div>

          <v-row align="center">
            <v-col cols="12" sm="4" class="text-center">
              <v-progress-circular
                :model-value="percent || 0"
                size="130"
                width="14"
                :color="attendanceColor"
              >
                <span class="text-h6 font-weight-bold"
                  >{{ percent || 0 }}%</span
                >
              </v-progress-circular>
            </v-col>

            <v-col cols="12" sm="8">
              <div class="attendance-stat">
                <v-icon
                  icon="mdi-check-circle"
                  color="green"
                  size="20"
                  class="me-2"
                />
                <span class="font-weight-medium">{{ present ?? 0 }}</span>
                <span class="text-medium-emphasis ms-1">Present</span>
              </div>
              <div class="attendance-stat">
                <v-icon
                  icon="mdi-close-circle"
                  color="red"
                  size="20"
                  class="me-2"
                />
                <span class="font-weight-medium">{{ absent ?? 0 }}</span>
                <span class="text-medium-emphasis ms-1">Absences</span>
              </div>
              <div class="attendance-stat">
                <v-icon
                  icon="mdi-file-document-alert"
                  color="amber-darken-2"
                  size="20"
                  class="me-2"
                />
                <span class="font-weight-medium">{{ excuse ?? 0 }}</span>
                <span class="text-medium-emphasis ms-1">Excused</span>
              </div>

              <!-- <div class="mt-4">
                <v-alert type="error" density="compact" variant="tonal">
                  LARDO ALERT
                </v-alert>
              </div> -->
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- Alert & Discipline Status -->
    <v-row v-if="lardoAlert || disciplineCase">
      <v-col cols="12" md="6" v-if="lardoAlert">
        <v-card class="pa-4 rounded-xl mb-4 border" elevation="0">
          <div class="text-h6 font-weight-bold mb-4">Alert status</div>

          <v-alert
            type="error"
            variant="flat"
            density="comfortable"
            class="rounded-lg mb-4"
            icon="mdi-alert"
          >
            <div class="font-weight-bold">LARDO alert</div>
            <div class="text-caption">Learner at-risk of dropping out</div>
          </v-alert>

          <div class="d-flex flex-column ga-3">
            <div>
              <div class="text-caption text-medium-emphasis">Reason</div>
              <div class="text-body-2 font-weight-medium">
                {{ lardoAlert.remarks }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis">Teacher</div>
              <div class="text-body-2 font-weight-medium">
                {{ lardoAlert.teacher_name }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis">
                Recommendation
              </div>
              <div class="text-body-2 font-weight-medium">
                {{ lardoAlert.recommendation }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" v-if="disciplineCase">
        <v-card class="pa-4 rounded-xl mb-4 border" elevation="0">
          <div class="d-flex align-center mb-5">
            <div class="text-h6 font-weight-bold">Discipline case</div>
            <v-spacer />
            <v-chip
              size="small"
              variant="tonal"
              color="blue"
              prepend-icon="mdi-pin"
            >
              {{ disciplineCase.type }}
            </v-chip>
          </div>

          <div class="d-flex align-center px-1 mb-5">
            <template v-for="(step, i) in disciplineSteps" :key="step">
              <div
                class="d-flex flex-column align-center"
                style="min-width: 70px"
              >
                <v-avatar
                  size="26"
                  :color="
                    i <= currentDisciplineStep ? 'success' : 'grey-lighten-2'
                  "
                >
                  <v-icon
                    v-if="i <= currentDisciplineStep"
                    size="15"
                    color="white"
                  >
                    mdi-check
                  </v-icon>
                </v-avatar>
                <span class="text-caption text-center mt-1">{{ step }}</span>
              </div>
              <v-divider
                v-if="i < disciplineSteps.length - 1"
                class="flex-grow-1 mx-1 mb-4"
                :color="
                  i < currentDisciplineStep ? 'success' : 'grey-lighten-2'
                "
                thickness="2"
              />
            </template>
          </div>

          <v-alert
            :type="disciplineCase.status === 4 ? 'success' : 'warning'"
            variant="flat"
            density="comfortable"
            class="rounded-lg"
            :icon="
              disciplineCase.status === 4
                ? 'mdi-check-circle'
                : 'mdi-calendar-clock'
            "
          >
            {{ disciplineStatusLabel(disciplineCase.status) }}
          </v-alert>

          <v-btn
            class="mt-5"
            size="small"
            variant="tonal"
            prepend-icon="mdi-eye"
            block
            @click="disciplineDialog = true"
          >
            View details
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <!-- Announcements -->
      <v-col cols="12">
        <div class="my-5 text-h5 font-weight-bold">Announcements</div>

        <v-card
          v-for="(post, index) in posts"
          :key="index"
          class="mb-4 border"
          elevation="0"
        >
          <v-card-title class="d-flex align-center">
            <v-avatar size="40" color="primary" class="mr-3">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>

            <div>
              <div class="font-weight-bold text-body-1">
                <span style="text-transform: uppercase">{{
                  post.teacherName
                }}</span>
              </div>
              <div class="text-caption text-grey">
                {{ formatDate(post.date) }}
              </div>
            </div>
          </v-card-title>

          <v-card-text class="text-body-2">
            {{ post.text }}
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <!-- <v-btn variant="text" @click="likePost(index)">
              👍 Like {{ post.likes }}
            </v-btn> -->

            <v-btn
              variant="text"
              size="small"
              @click="post.showComment = !post.showComment"
            >
              <v-icon size="18" class="me-1">mdi-comment-outline</v-icon>
              Comment ({{ post.comments.length }})
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-if="post.showComment">
              <v-divider />
              <div class="d-flex align-center pa-3 ga-2">
                <v-text-field
                  v-model="post.newComment"
                  label="Write a comment..."
                  density="compact"
                  variant="outlined"
                  hide-details
                  @keyup.enter="addComment(index)"
                />
                <v-btn
                  icon
                  variant="flat"
                  color="primary"
                  size="small"
                  @click="addComment(index)"
                >
                  <v-icon size="20">mdi-send</v-icon>
                </v-btn>
              </div>

              <v-list density="compact" class="pb-2">
                <v-list-item
                  v-for="(c, i) in post.comments"
                  :key="i"
                  class="px-4"
                >
                  <template v-slot:prepend>
                    <v-avatar size="28" color="grey-lighten-1" class="me-2">
                      <v-icon size="16" color="white">mdi-account</v-icon>
                    </v-avatar>
                  </template>
                  <div class="comment-bubble">
                    <div class="font-weight-medium text-caption">
                      {{ c.name }}
                    </div>
                    <div class="text-body-2">{{ c.title }}</div>
                  </div>
                </v-list-item>

                <v-list-item v-if="!post.comments.length">
                  <div class="text-caption text-medium-emphasis py-1">
                    No comments yet.
                  </div>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
        </v-card>

        <div
          v-if="!posts.length"
          class="empty-state py-8 text-center text-medium-emphasis"
        >
          <v-icon icon="mdi-bulletin-board" size="32" class="mb-2" />
          <div>No announcements yet.</div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="disciplineDialog" max-width="640" scrollable>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-5">
          <v-avatar
            :color="reportTypeColor(disciplineCase.report_type)"
            variant="tonal"
            class="mr-3"
          >
            <v-icon :icon="reportTypeIcon(disciplineCase.report_type)" />
          </v-avatar>

          <div>
            <div class="text-h6 font-weight-bold">
              {{ reportTypeLabel(disciplineCase.report_type) }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Case #{{ disciplineCase.id }} ·
              {{ formatDateTime(disciplineCase.createdAt) }}
            </div>
          </div>

          <v-spacer />

          <v-chip
            size="small"
            :color="disciplineCase.status === 4 ? 'success' : 'warning'"
            variant="flat"
          >
            {{ disciplineStatusLabel(disciplineCase.status) }}
          </v-chip>

          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="ml-1"
            @click="disciplineDialog = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <!-- Context row: who, where, when -->
          <v-row dense>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Student</div>
              <div class="text-body-2 font-weight-medium">
                {{ disciplineCase.studentID }}
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Teacher</div>
              <div class="text-body-2 font-weight-medium">
                {{ disciplineCase.teacherID }}
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Room</div>
              <div class="text-body-2 font-weight-medium">
                {{ disciplineCase.roomID }}
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Grade level</div>
              <div class="text-body-2 font-weight-medium">
                {{ disciplineCase.grade_level }}
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Subject</div>
              <div class="text-body-2 font-weight-medium">
                {{ disciplineCase.subjectID }}
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">School year</div>
              <div class="text-body-2 font-weight-medium">
                {{ disciplineCase.school_yearID }}
              </div>
            </v-col>
            <v-col cols="6" sm="6">
              <div class="text-caption text-medium-emphasis">Reported</div>
              <div class="text-body-2 font-weight-medium">
                {{ disciplineCase.report_date }} ·
                {{ disciplineCase.report_time }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Tagged students -->
          <div class="mb-4">
            <div class="text-caption text-medium-emphasis mb-1">
              Tagged students
            </div>
            <div v-if="taggedStudentsList.length" class="d-flex flex-wrap ga-1">
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
            <div v-else class="text-body-2 text-medium-emphasis">
              None tagged
            </div>
          </div>

          <!-- Description -->
          <div>
            <div class="text-caption text-medium-emphasis mb-1">
              Report description
            </div>
            <v-card
              variant="tonal"
              class="pa-3 rounded-lg text-body-2"
              :color="disciplineCase.report_description ? undefined : 'grey'"
            >
              {{
                disciplineCase.report_description || 'No description provided.'
              }}
            </v-card>
          </div>

          <!-- Comments -->
          <div>
            <div class="text-caption text-medium-emphasis mb-1">Comments</div>
            <v-card
              variant="tonal"
              class="pa-3 rounded-lg text-body-2"
              :color="disciplineCase.comments ? undefined : 'grey'"
            >
              {{ disciplineCase.comments || 'No comments provided.' }}
            </v-card>
          </div>

          <div class="text-caption text-medium-emphasis mt-4">
            Last updated {{ formatDateTime(disciplineCase.updatedAt) }}
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="disciplineDialog = false">Close</v-btn>
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
    colors: [
      'indigo',
      'orange-darken-1',
      'pink-darken-2',
      'red-lighten-1',
      'deep-purple-accent-4',
    ],
  }),
  computed: {
    currentDisciplineStep() {
      return this.disciplineStatusStep(this.disciplineCase.status);
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
      return Array.isArray(raw) ? raw : JSON.parse(raw);
    },
  },
  mounted() {
    this.initialize();
  },
  watch: {
    activeIndex(newIndex) {
      this.studentData(this.studentList[newIndex]);
      this.getParentAnnouncements(this.studentList[newIndex]);
    },
    '$store.getters.getFilterSelected'() {
      this.initialize();
    },
  },
  methods: {
    initialize() {
      this.getMyStudent();
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
    // formatDateTime(dt) {
    //   // your existing implementation
    // },
    disciplineStatusStep(status) {
      // status 0 -> step 0, 1 -> step 1, 4 -> step 2 (2/3 unused)
      if (status === 0) return 0;
      if (status === 1) return 1;
      if (status === 4) return 2;
      return 0; // fallback
    },
    // disciplineStatusLabel(status) {
    //   return status === 0
    //     ? 'Under Adviser Review'
    //     : status === 1
    //     ? 'Referred to Prefect'
    //     : status === 4
    //     ? 'Resolved'
    //     : 'Unknown';
    // },
    riskLevelColor(level) {
      const l = (level || '').toLowerCase();
      if (l === 'high') return 'red';
      if (l === 'medium') return 'orange';
      return 'green';
    },
    getStudentAlerts(student) {
      let filter = this.$store.getters.getFilterSelected;
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
    // Was called in the template but never defined — added a plain
    // en-US date formatter. Swap the locale/options if you need something else.
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
    getMyStudent() {
      this.filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/parent-records/getMyChildrenList/' + this.filter,
        'GET',
      ).then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.studentData(data[0]);
          this.getParentAnnouncements(data[0]);
          this.studentList = data;
        }
      });
    },
    studentData(student) {
      let filter = this.$store.getters.getFilterSelected;
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
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/parent-records/getParentAnnouncements/' + filter + '/' + student.id,
        'GET',
      ).then((res) => {
        if (res) {
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            data[i].teacherName = this.toTitleCase(data[i].teacherName);
          }
          this.posts = data;
        }
      });
    },
    addComment(i) {
      let userID = this.$store.state.user.id;
      let filter = this.$store.getters.getFilterSelected;
      const p = this.posts[i];
      if (!p.newComment) return;

      let commentData = {
        userID: userID,
        title: p.newComment,
        school_yearID: filter,
        postID: p.postID,
      };
      let data = {
        data: JSON.stringify(commentData),
      };
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
.parent-bg {
  min-height: 100vh;
}

.v-card.border {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.profile-carousel {
  border-radius: 12px;
  overflow: hidden;
}

.carousel-sheet {
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
}

.profile-avatar {
  border: 2px solid rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-meta {
  opacity: 0.85;
}

.attendance-stat {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.attendance-stat:last-child {
  border-bottom: none;
}

.comment-bubble {
  background: #f5f6fa;
  border-radius: 10px;
  padding: 6px 12px;
  display: inline-block;
  max-width: 100%;
}

.empty-state {
  color: rgba(0, 0, 0, 0.4);
}
.alert-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
.alert-detail-row:last-child {
  border-bottom: none;
}
</style>
