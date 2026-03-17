<template>
  <v-container fluid>
    <v-row>
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="5">
        <!-- Student Profile -->
        <v-card class="pa-4 rounded-xl mb-4 elevation-3">
          <div class="text-h6 font-weight-bold mb-4">Student Profile</div>

          <div class="d-flex align-center">
            <v-carousel
              height="150"
              v-model="activeIndex"
              hide-delimiter-background
              show-arrows
              v-if="studentList.length"
            >
              <template v-slot:prev="{ props }">
                <v-btn
                  color="white"
                  variant="text"
                  @click="
                    props.onClick();
                    studentData(studentList[activeIndex]);
                  "
                  ><v-icon size="30">mdi-arrow-left</v-icon>
                </v-btn>
              </template>
              <template v-slot:next="{ props }">
                <v-btn
                  color="white"
                  variant="text"
                  @click="
                    props.onClick();
                    studentData(studentList[activeIndex]);
                  "
                  ><v-icon size="30">mdi-arrow-right</v-icon>
                </v-btn>
              </template>
              <v-carousel-item v-for="(slide, i) in studentList" :key="i">
                <v-sheet :color="colors[i]" height="100%">
                  <div class="d-flex align-center">
                    <v-avatar
                      size="90"
                      class="ml-15 mr-2"
                      style="border: 1px solid white"
                    >
                      <!-- <v-img src="https://i.pravatar.cc/100" /> -->
                      <v-icon size="50">mdi-account</v-icon>
                    </v-avatar>

                    <div class="d-flex pa-4">
                      <div
                        class="mx-3 pa-2"
                        style="border: 1px solid white; border-radius: 10px"
                      >
                        <div class="font-weight-bold text-body-1">
                          Name:{{ slide.name }}
                        </div>
                        <div class="text-caption">LRN: {{ slide.lrnNo }}</div>
                        <div class="text-caption">
                          Grade: {{ slide.grade_level }}
                        </div>
                      </div>
                      <!-- <div
                        class="mx-3 pa-2"
                        style="border: 1px solid white; border-radius: 10px"
                      >
                        <div class="text-caption">Adviser: Mrs. Santos</div>
                        <div class="text-caption">School Year: 2023–2024</div>
                        <div class="text-caption">Quarter: Q3</div>
                      </div> -->
                    </div>
                  </div>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
          </div>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" md="7">
        <!-- Attendance Overview -->
        <v-card class="pa-6 rounded-xl mb-4 elevation-3">
          <div class="text-h6 font-weight-bold mb-4">Attendance Overview</div>

          <v-row align="center">
            <v-col cols="12" md="4" class="text-center">
              <v-progress-circular
                :model-value="percent"
                size="130"
                width="15"
                color="green"
              >
                {{ percent }}%
              </v-progress-circular>
            </v-col>

            <v-col cols="12" md="8">
              <v-chip color="green" class="me-2">{{ present }} Present</v-chip>
              <v-chip color="orange" class="me-2">{{ absent }} Absences</v-chip>
              <v-chip color="yellow-darken-2">{{ excuse }} Excuse</v-chip>

              <!-- <div class="mt-4">
                <v-alert type="error" density="compact" variant="tonal">
                  LARDO ALERT
                </v-alert>
              </div> -->
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Announcements -->
      <v-col cols="12" md="12">
        <div class="my-5 text-h4"><strong> Announcement</strong></div>
        <!-- POSTS -->
        <v-card v-for="(post, index) in posts" :key="index" class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-avatar size="40" class="mr-2">
              <!-- <v-img src="https://i.pravatar.cc/100" /> -->
              <v-icon>mdi-account</v-icon>
            </v-avatar>

            <div>
              <div class="font-weight-bold">{{ post.teacherName }}</div>

              <div class="text-caption text-grey">
                {{ formatDate(post.date) }}
              </div>
            </div>
          </v-card-title>

          <v-card-text>
            {{ post.text }}
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <!-- <v-btn variant="text" @click="likePost(index)">
              👍 Like {{ post.likes }}
            </v-btn> -->

            <v-btn variant="text" @click="post.showComment = !post.showComment">
              💬 Comment ({{ post.comments.length }})
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-if="post.showComment">
              <v-divider />
              <div class="d-flex pa-3">
                <v-text-field
                  v-model="post.newComment"
                  label="Write comment..."
                  density="compact"
                  @keyup.enter="addComment(index)"
                />
                <v-btn class="mx-2" variant="flat" @click="addComment(index)"
                  ><v-icon color="pink" size="24"
                    >mdi-arrow-right</v-icon
                  ></v-btn
                >
              </div>

              <v-list density="compact">
                <v-list-item v-for="(c, i) in post.comments" :key="i">
                  <v-row>
                    <v-col cols="2"
                      ><strong>{{ c.name }}</strong></v-col
                    >
                    <v-col
                      cols="10"
                      style="border: 1px solid grey; border-radius: 10px"
                    >
                      <span>{{ c.title }}</span></v-col
                    >
                  </v-row>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    studentList: [],
    activeIndex: 0,
    present: null,
    absent: null,
    posts: [],
    excuse: null,
    percent: null,
    colors: [
      'indigo',
      'warning',
      'pink darken-2',
      'red lighten-1',
      'deep-purple accent-4',
    ],
  }),
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
    getMyStudent() {
      this.axiosCall('/parent-records/getMyChildrenList', 'GET').then((res) => {
        if (res) {
          // console.log(res.data);
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
      console.log(student);
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/parent-records/getStudentAchievements/' + filter + '/' + student.id,
        'GET',
      ).then((res) => {
        if (res) {
          console.log(res.data);
          this.present = res.data.present;
          this.absent = res.data.absent;
          this.excuse = res.data.excuse;
          this.percent = res.data.percent;
        }
      });
    },
    getParentAnnouncements(student) {
      console.log(student);
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
      console.log(data);
      this.axiosCall('/announcement/addComment', 'POST', data).then((res) => {
        if (res.data.status == 201) {
          //   p.comments.push(p.newComment);
          //   p.newComment = '';
          //   this.confirmDialog = false;
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
.fill-height {
  min-height: 100vh;
}
</style>
