<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        v-if="$store.state.user.user.assignedModuleID != 22"
        class="d-flex justify-end"
      >
        <v-btn
          @click="confirmDialog = true"
          color="#d6357e"
          variant="flat"
          rounded="lg"
          append-icon="mdi-plus"
          class="text-white font-weight-bold"
          >Add
        </v-btn>
      </v-col>
      <v-col cols="12">
        <!-- POSTS -->
        <v-card
          v-for="(post, index) in posts"
          :key="index"
          class="mb-4"
          elevation="2"
          rounded="lg"
        >
          <v-card-title class="d-flex align-center pa-4">
            <v-avatar size="42" color="#fce4ec" class="mr-3">
              <v-icon color="#d6357e">mdi-account</v-icon>
            </v-avatar>

            <div>
              <div class="font-weight-bold">{{ post.teacherName }}</div>
              <div
                class="text-caption text-medium-emphasis d-flex align-center"
              >
                <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
                {{ formatDate(post.date) }}
              </div>
            </div>
          </v-card-title>

          <v-card-text class="pb-2">
            {{ post.text }}
          </v-card-text>

          <v-divider />

          <v-card-actions class="px-4">
            <v-btn
              variant="text"
              size="small"
              color="#d6357e"
              @click="post.showComment = !post.showComment"
            >
              <v-icon start size="18">mdi-comment-outline</v-icon>
              Comment ({{ post.comments.length }})
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-if="post.showComment">
              <v-divider />
              <div class="d-flex align-center pa-3">
                <v-text-field
                  v-model="post.newComment"
                  label="Write a comment..."
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details
                  color="#d6357e"
                  @keyup.enter="addComment(index)"
                />
                <v-btn
                  class="mx-2"
                  variant="flat"
                  color="#d6357e"
                  icon
                  size="40"
                  @click="addComment(index)"
                >
                  <v-icon color="white" size="20">mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <v-list density="compact" class="pb-3">
                <v-list-item
                  v-for="(c, i) in post.comments"
                  :key="i"
                  class="px-3"
                >
                  <div class="d-flex align-start">
                    <v-avatar size="26" color="#fce4ec" class="mr-2 mt-1">
                      <v-icon size="14" color="#d6357e">mdi-account</v-icon>
                    </v-avatar>
                    <div
                      class="flex-grow-1 pa-2"
                      style="background: #f5f5f7; border-radius: 12px"
                    >
                      <div class="text-caption font-weight-bold">
                        {{ c.name }}
                      </div>
                      <div class="text-body-2">{{ c.title }}</div>
                    </div>
                  </div>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
        </v-card>

        <v-alert
          v-if="!posts.length"
          type="info"
          variant="tonal"
          border="start"
          class="mt-2"
        >
          No announcements yet.
        </v-alert>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmDialog" persistent max-width="550">
      <v-card color="white" rounded="lg">
        <v-card-title
          class="d-flex align-center px-5 py-4"
          style="background: #d6357e; color: #fff"
        >
          <v-icon start color="white">mdi-bullhorn-outline</v-icon>
          Announcement
        </v-card-title>
        <v-card-text class="pa-5">
          <v-textarea
            v-model="newPost"
            label="What's on your mind?"
            variant="outlined"
            rows="3"
            rounded="lg"
            color="#d6357e"
            auto-grow
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-3">
          <v-btn
            color="red"
            variant="outlined"
            rounded="lg"
            @click="confirmDialog = false"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            color="#d6357e"
            variant="flat"
            rounded="lg"
            class="text-white font-weight-bold"
            @click="addPost"
          >
            <v-icon start size="18">mdi-send-outline</v-icon>
            Post
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
      :timeout="5000"
    ></fade-away-message-component>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      newPost: '',
      posts: [],
      confirmDialog: false,
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Deleted!',
        message: '',
        top: 10,
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
  methods: {
    initialize() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall('/announcement/getMyAnnouncement/' + filter, 'GET').then(
        (res) => {
          if (res) {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              data[i].teacherName = this.toTitleCase(data[i].teacherName);
            }
            this.posts = data;
          }
        },
      );
    },
    addPost() {
      let userID = this.$store.state.user.id;
      let filter = this.$store.getters.getFilterSelected;
      let toAdd = {
        title: this.newPost,
        teacherID: userID,
        school_yearID: filter,
      };
      let data = {
        data: JSON.stringify(toAdd),
      };
      this.axiosCall('/announcement/', 'POST', data).then((res) => {
        if (res.data.status == 201) {
          this.initialize();
          this.confirmDialog = false;
          this.newPost = '';
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    likePost(i) {
      this.posts[i].likes++;
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
