<template>
  <div class="px-4">
    <v-card class="rounded-xl elevation-3 overflow-hidden">
      <!-- PROFILE HEADER -->
      <div class="profile-header pa-6 text-center">
        <v-avatar size="160" class="profile-avatar">
          <v-img :src="!isSelecting ? data.profile_img : previewImg" />
          <v-btn
            v-if="!readonly"
            size="small"
            icon
            color="primary"
            class="avatar-edit-btn"
            @click="handleFileImport()"
          >
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </v-avatar>

        <div class="mt-4 font-weight-bold text-h6">
          {{
            data.mname
              ? data.suffix
                ? `${data.fname} ${data.mname[0]}. ${data.lname} ${data.suffix}`
                : `${data.fname} ${data.lname}`
              : `${data.fname} ${data.lname}`
          }}
        </div>
        <div class="text-caption text-grey">
          <!-- {{ $store.state.user.usertype.description }} -->
        </div>

        <v-file-input
          id="fileUpload"
          class="d-none"
          hide-input
          accept="image/png, image/jpeg"
          @change="onFileChanged()"
        />
      </div>

      <!-- TABS -->
      <v-tabs v-model="tab" grow color="primary" class="px-4">
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-divider />

      <!-- TAB CONTENT -->
      <v-tabs-items v-model="tab">
        <!-- PERSONAL INFO -->
        <v-tab-item>
          <v-container class="py-6">
            <v-form ref="personalInfo">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="First Name"
                    variant="outlined"
                    density="compact"
                    v-model="data.fname"
                    :readonly="readonly"
                    :rules="[formRules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Middle Name"
                    variant="outlined"
                    density="compact"
                    v-model="data.mname"
                    :readonly="readonly"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Last Name"
                    variant="outlined"
                    density="compact"
                    v-model="data.lname"
                    :readonly="readonly"
                    :rules="[formRules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Suffix"
                    variant="outlined"
                    density="compact"
                    v-model="data.suffix"
                    :readonly="readonly"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Sex"
                    variant="outlined"
                    density="compact"
                    v-model="data.sex"
                    :readonly="readonly"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Mobile Number"
                    variant="outlined"
                    density="compact"
                    v-model="data.mobile_no"
                    :readonly="readonly"
                    type="number"
                  />
                </v-col>

                <!-- <v-col cols="12">
                  <v-autocomplete
                    label="Education Position"
                    v-model="data.education"
                    :items="educationList"
                    :readonly="readonly"
                  />
                </v-col> -->
              </v-row>
            </v-form>

            <!-- ACTIONS -->
            <v-row class="mt-6" dense>
              <template v-if="readonly">
                <v-col v-if="userRole != 3" cols="12" sm="auto">
                  <v-btn
                    block
                    variant="tonal"
                    color="pink"
                    @click="
                      addGrade_Subject(data);
                      toAdd = 1;
                    "
                  >
                    Subjects
                  </v-btn>
                </v-col>

                <v-col v-if="userRole != 3" cols="12" sm="auto">
                  <v-btn
                    block
                    variant="tonal"
                    color="pink"
                    @click="
                      addGrade_Subject(data);
                      toAdd = 2;
                    "
                  >
                    Grade Level
                  </v-btn>
                </v-col>

                <v-col cols="12" sm="auto">
                  <v-btn block color="pink" @click="readonly = false">
                    Edit Profile
                  </v-btn>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" sm="auto">
                  <v-btn
                    block
                    variant="outlined"
                    color="error"
                    @click="
                      readonly = true;
                      isSelecting = false;
                      selectFile = null;
                    "
                  >
                    Cancel
                  </v-btn>
                </v-col>

                <v-col cols="12" sm="auto">
                  <v-btn block color="pink" @click="updateProfile">
                    Save Changes
                  </v-btn>
                </v-col>
              </template>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <TeacherSubjectAddingDialog
      :data="taggingData"
      :action="action"
      :filter="filter"
      :toAdd="toAdd"
    />
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import TeacherSubjectAddingDialog from "../../components/Dialogs/Forms/TeacherSubjectAddingDialog.vue";
export default {
  name: "ProfilePage",
  components: {
    TeacherSubjectAddingDialog,
  },
  data() {
    return {
      toAdd: null,
      action: null,
      taggingData: null,
      isSelecting: false,
      selectFile: null,
      previewImg: null,
      tagGrade: null,
      tab: null,
      // items: ["Personal Information", "Login Info"],
      items: ["Personal Information"],
      educationList: [
        "Teacher I",
        "Teacher II",
        "Teacher III",
        "Teacher IV",
        "Teacher V",
        "Teacher VI",
        "Teacher VII",
        "Master Teacher I",
        "Master Teacher II",
        "Master Teacher III",
        "Master Teacher IV",
        "Master Teacher V",
        "Principal I",
        "Principal II",
        "Principal III",
        "Principal IV",
      ],
      totalYears: null,
      filter: null,
      data: {
        id: null,
        name: null,
        fname: null,
        mname: null,
        lname: null,
        suffix: null,
        sex: null,
        mobile_no: null,
        profile_img: null,
        hired: null,
        education: null,
        status: null,
      },
      oldPass: null,
      password: null,
      confirmPassword: null,
      userRole: null,
      showOldPass: false,
      show1: false,
      show2: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "System Message!",
        message: "",
        top: 10,
      },
      readonly: true,
      credentialReadonly: true,
    };
  },
  mounted() {
    this.initialize();
    this.userRole = this.$store.state.user.user.user_roleID;
    console.log(this.userRole);
    eventBus.on("closedDataGradeSubjects", () => {
      this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off("closedDataGradeSubjects");
  },

  methods: {
    addGrade_Subject(item) {
      let filter = this.$store.getters.getFilterSelected;
      this.taggingData = item;
      this.action = "View";
      this.filter = filter;
      this.toAdd;
    },
    initialize() {
      this.axiosCall("/user-details/getPersonalInfo", "GET").then((res) => {
        if (res.data) {
          this.data.id = res.data.id;
          this.data.name = res.data.lname + ", " + res.data.fname;
          this.data.fname = res.data.fname;
          this.data.mname = res.data.mname;
          this.data.lname = res.data.lname;
          this.data.suffix = res.data.suffix;
          this.data.sex = res.data.sex;
          this.data.status = res.data.status;
          this.data.mobile_no = res.data.mobile_no;
          this.data.profile_img = res.data.profile_img
            ? process.env.VUE_APP_SERVER +
              "/user-details/getProfileImg/" +
              res.data.profile_img
            : process.env.VUE_APP_SERVER +
              "/user-details/getProfileImg/img_avatar.png";
        }
      });
    },

    updateCredential() {
      if (this.$refs.loginInfo.validate()) {
        let data = {
          old_password: this.oldPass,
          new_password: this.password,
        };
        this.axiosCall("/auth/changePass", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.password = null;
            this.confirmPassword = null;
            this.credentialReadonly = true;
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.show = true;
          }
        });
      }
    },

    updateProfile() {
      if (this.$refs.personalInfo.validate()) {
        const fd = new FormData();
        this.axiosCall("/user-details/updateUser", "POST", this.data).then(
          (res) => {
            if (res.data.status == 200) {
              if (this.selectFile) {
                fd.append("file", this.selectFile);
                this.axiosCall("/user-details/uploadimage", "POST", fd).then(
                  (resp) => {
                    if (resp.data.status == 200) {
                      this.initialize();
                      this.fadeAwayMessage.message = resp.data.msg;
                      this.fadeAwayMessage.show = true;
                      this.readonly = true;
                      this.$emit("reloadProfile");
                    } else if (resp.data.status == 400) {
                      this.initialize();
                      this.fadeAwayMessage.message = resp.data.msg;
                      this.fadeAwayMessage.show = true;
                      this.readonly = true;
                    }
                  },
                );
              } else {
                this.initialize();
                this.fadeAwayMessage.message = res.data.msg;
                this.fadeAwayMessage.show = true;
                this.readonly = true;
              }
            } else if (res.data.status == 400) {
              this.initialize();
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.show = true;
              this.readonly = true;
            }
          },
        );
      }
    },

    handleFileImport() {
      let fileUpload = document.getElementById("fileUpload");
      if (fileUpload != null) {
        fileUpload.click();
      }
    },
    onFileChanged() {
      const uploadedimg = document.getElementById("fileUpload").files[0];
      this.selectFile = uploadedimg;

      this.previewImg = URL.createObjectURL(uploadedimg);
      this.isSelecting = true;
    },
  },
  created() {
    this.initialize();
    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },
};
</script>
<style scoped>
.profile-header {
  background: linear-gradient(135deg, #dc0b70, #f06292);
  color: white;
}

.profile-avatar {
  position: relative;
  margin: auto;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 20px;
}
</style>
