<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="d-flex dialog-header pt-5 pb-5 pl-6">
            <span>{{ action == "Verify" ? "Enroll" : action }} Student</span>
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
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-btn
                    color="#dc0b70"
                    block
                    @click="viewPicture()"
                    :class="edit ? 'd-none' : ''"
                  >
                    picture
                  </v-btn>
                  <v-file-input
                    outlined
                    v-model="picture"
                    dense
                    class="rounded-lg"
                    :class="edit ? '' : 'd-none'"
                    label="2x2 Picture"
                    color="#6DB249"
                    accept=".png, .jpeg, .jpg"
                    :clearable="false"
                  >
                  </v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    color="#dc0b70"
                    block
                    @click="viewSchoolCard()"
                    :class="edit ? 'd-none' : ''"
                  >
                    Student Card
                  </v-btn>
                  <v-file-input
                    outlined
                    v-model="schoolCard"
                    dense
                    class="rounded-lg"
                    :class="edit ? '' : 'd-none'"
                    label="Student Card"
                    color="#6DB249"
                    accept=".pdf"
                    :clearable="false"
                  >
                  </v-file-input>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    color="#dc0b70"
                    block
                    @click="viewPSA()"
                    :class="edit ? 'd-none' : ''"
                  >
                    Birth Certificate / PSA
                  </v-btn>
                  <v-file-input
                    outlined
                    v-model="birthPSA"
                    dense
                    class="rounded-lg"
                    :class="edit ? '' : 'd-none'"
                    label="Birth Certificate / PSA"
                    color="#6DB249"
                    accept=".pdf"
                    :clearable="false"
                  >
                  </v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    color="#dc0b70"
                    block
                    @click="viewGoodMoral()"
                    :class="edit ? 'd-none' : ''"
                  >
                    Good Moral
                  </v-btn>
                  <v-file-input
                    outlined
                    v-model="goodMoral"
                    dense
                    class="rounded-lg"
                    :class="edit ? '' : 'd-none'"
                    label="Good Moral"
                    color="#6DB249"
                    accept=".pdf"
                    :clearable="false"
                  >
                  </v-file-input>
                </v-col>

                <v-col cols="12" v-if="action == 'Update'">
                  <v-autocomplete
                    v-model="verifyModel.schoo_yearId"
                    :rules="action == 'Update' ? [formRules.required] : []"
                    dense
                    class="rounded-lg"
                    item-title="school_year"
                    item-value="id"
                    label="School Year"
                    :class="edit ? 'd-none' : ''"
                    color="#93CB5B"
                    :items="year_fromList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" v-if="action == 'Update'">
                  <v-autocomplete
                    v-model="seniorJunior"
                    :rules="action == 'Update' ? [formRules.required] : []"
                    dense
                    class="rounded-lg"
                    label="School Year"
                    color="#93CB5B"
                    :class="edit ? 'd-none' : ''"
                    :items="seniorJuniorList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" v-if="action == 'Update'">
                  <v-autocomplete
                    v-model="verifyModel.grade_level"
                    :rules="action == 'Update' ? [formRules.required] : []"
                    dense
                    class="rounded-lg"
                    :class="edit ? 'd-none' : ''"
                    item-title="description"
                    item-value="id"
                    label="Grade Level:"
                    color="#93CB5B"
                    :items="
                      seniorJunior == 'Junior High'
                        ? juniorList
                        : seniorJunior == 'Senior High'
                        ? seniorList
                        : seniorJunior == 'Primary'
                        ? primaryList
                        : elementaryList
                    "
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              outlined
              @click="closeD()"
              :class="edit ? 'd-none' : ''"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="red"
              outlined
              @click="edit = false"
              :class="edit ? '' : 'd-none'"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              v-if="action == 'Update'"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="edit = true"
              :class="edit ? 'd-none' : ''"
            >
              <v-icon>mdi-check-circle</v-icon>
              Edit Files
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              :class="edit ? 'd-none' : ''"
              @click="accept()"
            >
              <v-icon>mdi-check-circle</v-icon>
              {{ action == "Verify" ? "Enroll" : "Update" }}
            </v-btn>

            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              :class="edit ? '' : 'd-none'"
              class="white--text"
              @click="updateWithFile()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update Files
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
    ></fade-away-message-component>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
export default {
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      edit: false,
      dialog: false,
      verifyModel: {
        id: null,
        grade_level: null,
        schoo_yearId: null,
      },
      seniorJunior: null,
      passedList: ["Yes", "No"],
      userRoleList: [],
      usertypeList: [],
      year_fromList: [],
      seniorJuniorList: ["Junior High", "Senior High"],
      juniorList: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
      elementaryList: [
        "Kinder 1",
        "Kinder 2",
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6",
      ],
      seniorList: ["Grade 11", "Grade 12"],
      assignedModulesList: [],
      changepicture: null,
      changeGoodMoral: null,
      changebirthPSA: null,
      changeschoolCard: null,
      updatepicture: null,
      picture: null,
      pictureOldValue: null,
      updategoodMoral: null,
      goodMoral: null,
      goodMoralOldValue: null,
      birthPSA: null,
      updatebirthPSA: null,
      birthPSAOldValue: null,
      updateschoolCard: null,
      schoolCard: null,
      schoolCardOldValue: null,
      arrayFileIndex: new Array(4).fill(),
      deleteFileArray: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        this.$refs.UserVerifyFormref.resetValidation();
        if (data.id) {
          console.log("Love", data);
          this.verifyModel.id = data.id;
          this.seniorJunior = data.seniorJunior;
          this.picture = data.picture;
          this.goodMoral = data.goodMoral;
          this.birthPSA = data.birthPSA;
          this.schoolCard = data.schoolCard;
          this.verifyModel.grade_level = data.grade_level;
          this.verifyModel.schoo_yearId = data.schoo_yearId;
          // this.verifyModel.date_hired = data.emp_date_hired;
        }
      },
      deep: true,
    },

    goodMoral(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.goodMoralOldValue) {
            this.deleteFileArray.push(oldValue);
            this.arrayFileIndex[3] = newValue;
            console.log("Update goodMoral", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.goodMoralOldValue = oldValue;
            this.changeGoodMoral = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changeGoodMoral = newValue;
                this.arrayFileIndex[3] = newValue;
                this.deleteFileArray.indexOf(this.goodMoralOldValue) === -1
                  ? this.deleteFileArray.push(this.goodMoralOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);

                console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changeGoodMoral),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.goodMoralOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },

    picture(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.pictureOldValue) {
            this.deleteFileArray.push(oldValue);
            this.arrayFileIndex[0] = newValue;
            console.log("Update goodMoral", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.pictureOldValue = oldValue;
            this.changepicture = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changepicture = newValue;
                this.arrayFileIndex[0] = newValue;
                this.deleteFileArray.indexOf(this.pictureOldValue) === -1
                  ? this.deleteFileArray.push(this.pictureOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);

                console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changepicture),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.pictureOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },

    schoolCard(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.schoolCardOldValue) {
            this.deleteFileArray.push(oldValue);
            this.arrayFileIndex[1] = newValue;
            console.log("Update goodMoral", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.schoolCardOldValue = oldValue;
            this.changeschoolCard = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changeschoolCard = newValue;
                this.arrayFileIndex[1] = newValue;
                this.deleteFileArray.indexOf(this.schoolCardOldValue) === -1
                  ? this.deleteFileArray.push(this.schoolCardOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);

                console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changeschoolCard),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.schoolCardOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },

    birthPSA(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.birthPSAOldValue) {
            this.deleteFileArray.push(oldValue);
            this.arrayFileIndex[2] = newValue;
            console.log("Update goodMoral", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.birthPSAOldValue = oldValue;
            this.changebirthPSA = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changebirthPSA = newValue;
                this.arrayFileIndex[2] = newValue;
                this.deleteFileArray.indexOf(this.birthPSAOldValue) === -1
                  ? this.deleteFileArray.push(this.birthPSAOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);

                console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changebirthPSA),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.birthPSAOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },
  },
  methods: {
    initialize() {
      this.getUserType();
      this.getAssignedModules();
      this.getUseRoles();
      // this.loadYearFrom();
      this.getSchoolYear();
    },

    // loadYearFrom() {
    //   let d = new Date();

    //   let yr = d.getFullYear();

    //   for (let i = yr; i < yr + 10; i++) {
    //     this.year_fromList.push(i);
    //   }
    // },
    // onChangeDateFrom(data) {
    //   this.verifyModel.year_to = data + 1;
    // },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          console.log("UserList", res.data);
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      eventBus.emit("closeAccountsVerificationDialog", true);
      this.dialog = false;
      this.edit = false;
    },
    accept() {
      if (this.$refs.UserVerifyFormref.validate()) {
        let data = {
          id: this.verifyModel.id,
          grade_level: this.verifyModel.grade_level,
          goodMoral: this.verifyModel.goodMoral,
          birthPSA: this.verifyModel.birthPSA,
          schoolCard: this.verifyModel.schoolCard,
          picture: this.verifyModel.picture,
          seniorJunior: this.seniorJunior,
          schoo_yearId: this.verifyModel.schoo_yearId,
          update_type: this.action == "Verify" ? 1 : 2,
          statusEnrolled: true,
        };

        this.axiosCall(
          "/enroll-student/updateEnrolledStudent",
          "POST",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.PositionFormref.reset();
            this.closeD();
          }
        });
      }
    },

    updateWithFile() {
      this.$emit("input", this.picture);
      this.$emit("input", this.schoolCard);
      this.$emit("input", this.birthPSA);
      this.$emit("input", this.goodMoral);

      console.log("Delete File Array", this.deleteFileArray);
      // console.log("New File Array", this.newUploadFileArray)
      if (this.arrayFileIndex[0]) {
        this.updatepicture = this.arrayFileIndex[0].name;
        console.log("naay data", this.arrayFileIndex[0].name);
      } else if (this.pictureOldValue) {
        this.updatepicture = this.pictureOldValue;
      } else {
        this.updateApplicationLetter = this.picture;
      }

      if (this.arrayFileIndex[1]) {
        this.updateschoolCard = this.arrayFileIndex[1].name;
        console.log("naay data", this.arrayFileIndex[1].name);
      } else if (this.schoolCardOldValue) {
        this.updateschoolCard = this.schoolCardOldValue;
      } else {
        this.updateschoolCard = this.schoolCard;
      }

      if (this.arrayFileIndex[2]) {
        this.updatebirthPSA = this.arrayFileIndex[2].name;
        console.log("naay data", this.arrayFileIndex[2].name);
      } else if (this.birthPSAOldValue) {
        this.updatebirthPSA = this.birthPSAOldValue;
      } else {
        this.updatebirthPSA = this.birthPSA;
      }

      if (this.arrayFileIndex[3]) {
        this.updategoodMoral = this.arrayFileIndex[3].name;
        console.log("naay data", this.arrayFileIndex[3].name);
      } else if (this.goodMoralOldValue) {
        this.updategoodMoral = this.goodMoralOldValue;
      } else {
        this.updategoodMoral = this.goodMoral;
      }

      // console.log(this.arrayFileIndex[0]);
      const fd = new FormData();
      for (let i = 0; i < this.arrayFileIndex.length; i++) {
        const element = this.arrayFileIndex[i];
        fd.append("file", element);
      }

      let data = {
        id: this.data.id,
        picture: this.updatepicture,
        schoolCard: this.updateschoolCard,
        birthPSA: this.updatebirthPSA,
        goodMoral: this.updategoodMoral,
      };

      fd.append("body", JSON.stringify(data));

      this.axiosCall("/enroll-student/update-student-file/", "POST", fd).then(
        (res) => {
          console.log("Uploaded File", res.data);
          if (res.data.status == 201) {
            try {
              if (this.deleteFileArray) {
                const items = this.deleteFileArray;
                console.log(items);
                try {
                  this.axiosCall(
                    "/enroll-student/getArrayFile/",
                    "POST",
                    items
                  ).then((res) => {
                    console.log(res.data);
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = "Successfully Updated!";
                    this.closeD();
                  });
                } catch (error) {
                  console.error("Error sending data:", error);
                }
              }
            } catch (error) {
              console.error("Error sending data:", error);
            }
          } else if (res.data.status == 401) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },

    getAssignedModules() {
      this.axiosCall("/assigned-modules", "GET").then((res) => {
        this.assignedModulesList = res.data;
      });
    },
    getUseRoles() {
      this.axiosCall("/user-role", "GET").then((res) => {
        this.userRoleList = res.data;
      });
    },

    getSchoolYear() {
      this.axiosCall("/enroll-student/getSchoolYear", "GET").then((res) => {
        if (res) {
          this.year_fromList = res.data;
          const currentDate = new Date();
          // Filter rows where the current date is between start_date and end_date
          const filteredData = res.data.filter((item) => {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            return currentDate >= startDate && currentDate <= endDate;
          });
          console.log("Filtered", filteredData[0].id);
          this.verifyModel.schoo_yearId = filteredData[0].id;
        }
      });
    },

    viewPicture() {
      let datastring = this.picture.substring(7, 0);
      // alert(this.verifyModel.picture);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        window.open(
          process.env.VUE_APP_SERVER +
            "/enroll-student/view/studentFile/" +
            this.picture +
            "",
          "_blank" // <- This is what makes it open in a new window.
        );
      }
    },

    viewGoodMoral() {
      let datastring = this.goodMoral.substring(7, 0);
      // alert(this.verifyModel.picture);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        window.open(
          process.env.VUE_APP_SERVER +
            "/enroll-student/view/studentFile/" +
            this.goodMoral +
            "",
          "_blank" // <- This is what makes it open in a new window.
        );
      }
    },

    viewSchoolCard() {
      let datastring = this.schoolCard.substring(7, 0);
      // alert(this.picture);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        window.open(
          process.env.VUE_APP_SERVER +
            "/enroll-student/view/studentFile/" +
            this.schoolCard +
            "",
          "_blank" // <- This is what makes it open in a new window.
        );
      }
    },
    viewPSA() {
      let datastring = this.birthPSA.substring(7, 0);
      // alert(this.picture);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        window.open(
          process.env.VUE_APP_SERVER +
            "/enroll-student/view/studentFile/" +
            this.birthPSA +
            "",
          "_blank" // <- This is what makes it open in a new window.
        );
      }
    },
  },
};
</script>
