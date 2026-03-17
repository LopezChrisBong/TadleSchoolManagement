<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="$store.state.user.user.assignedModuleID != 22">
        <v-btn
          @click="confirmDialog = true"
          color="primary"
          variant="flat"
          append-icon="mdi-plus"
          >Add
        </v-btn>
      </v-col>
      <v-col cols="12">
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
                      >{{ c.title }}</v-col
                    >
                  </v-row>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmDialog" persistent max-width="550">
      <v-card color="white">
        <v-card-title> Announcement </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div>
            <v-textarea
              v-model="newPost"
              label="What's on your mind?"
              variant="outlined"
              rows="2"
            />
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red" variant="outlined" @click="confirmDialog = false">
            Close
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn color="primary" variant="flat" class="mt-2" @click="addPost">
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
          //   this.fadeAwayMessage.show = true;
          //   this.fadeAwayMessage.type = 'success';
          //   this.fadeAwayMessage.header = 'System Message';
          //   this.fadeAwayMessage.message = 'Successfully Added!';
          this.initialize();
          this.confirmDialog = false;
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
