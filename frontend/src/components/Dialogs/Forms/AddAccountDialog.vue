<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="600px">
      <v-form ref="AddAccount" @submit.prevent>
        <v-card
          prepend-icon="mdi-account"
          :title="action + ' User ' + step.name"
        >
          <v-divider class="mt-3"></v-divider>

          <v-card-text class="px-4" style="height: 300px">
            <v-container>
              <v-row
                v-if="step.id == 1"
                :class="
                  action == 'Add' ? '' : action == 'Update' ? '' : 'd-none'
                "
              >
                <v-col cols="12">
                  <v-text-field
                    v-model="fname"
                    label="First Name"
                    prepend-inner-icon="mdi-account"
                    :rules="[formRules.required]"
                    outlined
                    density="compact"
                    class="mb-3"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="mname"
                    label="Middle Name"
                    prepend-inner-icon="mdi-account"
                    density="compact"
                    outlined
                    class="mb-3"
                /></v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="lname"
                    label="Last Name"
                    prepend-inner-icon="mdi-account"
                    :rules="[formRules.required]"
                    outlined
                    density="compact"
                    class="mb-3"
                /></v-col>
              </v-row>
              <v-row
                v-if="step.id == 2"
                :class="
                  action == 'Add'
                    ? ''
                    : action == 'Update'
                    ? 'd-none'
                    : 'd-none'
                "
              >
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.usertypeID"
                    :rules="userId == 3 ? [formRules.required] : []"
                    :items="usertypeList"
                    item-value="id"
                    item-title="description"
                    label="User Type"
                    density="compact"
                    class="rounded-lg"
                    color="#93CB5B"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.user_roleID"
                    :rules="[formRules.required]"
                    density="compact"
                    class="rounded-lg"
                    item-value="id"
                    item-title="description"
                    label="User role"
                    color="#93CB5B"
                    :items="userRoleList"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.assignedModuleID"
                    :rules="userId == 3 ? [formRules.required] : []"
                    density="compact"
                    class="rounded-lg"
                    item-value="id"
                    item-title="description"
                    label="Modules to assign"
                    color="#93CB5B"
                    :items="assignedModulesList"
                  >
                  </v-autocomplete>
                </v-col>

                <!-- <v-col cols="12" v-if="userId == 3">
                  <v-autocomplete
                    v-model="verifyModel.newStatus"
                    :rules="userId == 3 ? [formRules.required] : []"
                    dense
                    class="rounded-lg"
                    item-title="description"
                    item-value="id"
                    label="School Level"
                    color="#93CB5B"
                    :items="statusList"
                  >
                  </v-autocomplete>
                </v-col> -->
              </v-row>
              <v-row
                v-if="step.id == 3"
                :class="action == 'Add' ? '' : action == 'Edit' ? '' : 'd-none'"
              >
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :readonly="action == 'Edit' ? true : false"
                    prepend-inner-icon="mdi-email"
                    :rules="[formRules.required, formRules.email]"
                    @change="checkEmail()"
                    :error-messages="emailError"
                    outlined
                    dense
                    class="mb-3" />

                  <v-text-field
                    v-model="password"
                    :label="action == 'Edit' ? 'New Password' : 'Password'"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="showPassword = !showPassword"
                    :rules="[formRules.required, formRules.password]"
                    prepend-inner-icon="mdi-lock"
                    outlined
                    dense
                    class="mb-5" />
                  <v-text-field
                    class="font-size-14"
                    :class="action == 'Edit' ? 'd-none' : ''"
                    outlined
                    color="#93CB5B"
                    dense
                    v-model="confirmPassword"
                    :rules="[
                      formRules.required,
                      formRules.confirmPassword(confirmPassword, password),
                    ]"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    :append-inner-icon="
                      showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="
                      showPasswordConfirm = !showPasswordConfirm
                    "
                    prepend-inner-icon="mdi-lock"
                    label="Confirm Password"
                  ></v-text-field
                ></v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text="Close" @click="closeD()"></v-btn>

            <v-spacer></v-spacer>

            <v-btn
              color="success"
              :text="
                step.id == 3
                  ? action == 'Add'
                    ? 'Save'
                    : 'Update'
                  : action == 'Update'
                  ? 'Update'
                  : action == 'Edit'
                  ? 'Update'
                  : 'Next'
              "
              variant="flat"
              @click="
                step.id == 3
                  ? action == 'Add'
                    ? AddAccount()
                    : UpdateCredentials()
                  : action == 'Update'
                  ? UpdateInfo()
                  : action == 'Edit'
                  ? UpdateCredentials()
                  : Next()
              "
            ></v-btn>
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
    data: Object,
    action: String,
  },
  data() {
    return {
      dialog: false,
      step: { id: 1, name: "Personal Information" },
      email: null,
      password: null,
      emailError: null,
      confirmPassword: null,
      showPassword: false,
      showPasswordConfirm: false,
      fname: null,
      lname: null,
      mname: null,
      verifyModel: {
        id: null,
        userID: null,
        name: null,
        empID: null,
        date_hired: null,
        usertypeID: null,
        assignedModuleID: null,
        user_roleID: null,
        newStatus: null,
      },
      userRoleList: [],
      usertypeList: [],
      assignedModulesList: [],
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
        this.$refs.AddAccount.resetValidation();
        if (data.id) {
          console.log("Love", data);
          this.verifyModel.id = data.id;
          this.verifyModel.userID = data.user_id;
          this.verifyModel.name = data.name;
          this.verifyModel.empID = data.emp_empID;
          this.verifyModel.usertypeID = data.user_usertypeID.toString();
          this.verifyModel.user_roleID = data.user_user_roleID;
          this.verifyModel.assignedModuleID = data.user_assignedModuleID;
          this.verifyModel.newStatus = data.status;
          this.fname = data.fname;
          this.lname = data.lname;
          this.mname = data.mname;
          this.email = data.email;
          if (this.action == "Update") {
            this.step = { id: 1, name: "Personal Information" };
          } else if (this.action == "Edit") {
            this.step = { id: 3, name: "Account Credentials" };
          }
        } else {
          (this.verifyModel.id = null), (this.verifyModel.userID = null);
          this.verifyModel.name = null;
          this.verifyModel.empID = null;
          this.verifyModel.usertypeID = null;
          this.verifyModel.user_roleID = null;
          this.verifyModel.assignedModuleID = null;
          this.verifyModel.newStatus = data.status;
        }
      },
      deep: true,
    },
  },
  methods: {
    checkEmail() {
      this.emailChecking = true;
      this.axiosCall("/auth/checkEmailIfExist/" + this.email, "GET").then(
        (res) => {
          console.log(res.data);
          if (res.data) {
            this.emailError = "Email Already Exist!";
          } else {
            this.emailError = "";
          }
          this.emailChecking = false;
        }
      );
    },
    initialize() {
      this.userId = this.$store.state.user.id;
      this.getUserType();
      this.getAssignedModules();
      this.getUseRoles();
    },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          console.log("UserList", res.data);
          let data = res.data;
          this.usertypeList = data;
        }
      });
    },
    AddAccount() {
      // registration logic here
      if (this.password != this.confirmPassword) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.message = "Password not mutch";
        this.fadeAwayMessage.header = "System Message";
      } else {
        if (this.$refs.AddAccount.validate()) {
          let data = {
            fname: this.fname,
            mname: this.mname,
            lname: this.lname,
            // user_roleID: this.userType == 0 ? 3 : 2,
            // isAdminApproved: this.userType == 0 ? 1 : 0,
            // suffix: this.suffix,
            email: this.email,
            password: this.password,
            usertypeID: this.verifyModel.usertypeID,
            assignedModuleID: this.verifyModel.assignedModuleID,
            isAdminApproved: 1,
            user_roleID: this.verifyModel.user_roleID,
          };
          console.log(data);
          this.axiosCall("/auth/registerUser", "POST", data).then((res) => {
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.message = res.data.message;
              this.fadeAwayMessage.header = "System Message";
              this.$store.dispatch("setEmail", this.email);

              this.closeD();
              this.refresh();
            } else {
              this.isLoading = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.message = res.data.message;
              this.fadeAwayMessage.header = "System Message";
              this.animated = true;
            }
          });
        }
      }
    },
    UpdateCredentials() {
      if (this.password == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.message = "Please fill-up required fields!";
        this.fadeAwayMessage.header = "System Message";
      } else {
        let data = {
          old_password: null,
          new_password: this.password,
        };
        this.axiosCall(
          "/auth/changePassIDCred/" + this.data.id,
          "POST",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.closeD();
            this.refresh();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
          }
        });
      }
    },
    UpdateInfo() {
      let data = {
        fname: this.fname,
        mname: this.mname,
        lname: this.lname,
      };
      this.axiosCall(
        "/user-details/updateUserInfo/" +
          this.data.id +
          "/" +
          JSON.stringify(data),
        "POST",
        data
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.message = res.data.message;
          this.fadeAwayMessage.header = "System Message";
          this.closeD();
          this.refresh();
        } else {
          this.isLoading = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.message = res.data.message;
          this.fadeAwayMessage.header = "System Message";
          this.animated = true;
        }
      });
    },
    closeD() {
      eventBus.emit("closeAddAccountDialog", true);
      this.step = { id: 1, name: "Personal Information" };
      this.dialog = false;
      this.refresh();
    },
    Next() {
      if (this.fname == null || this.lname == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.message =
          "Please fill-up required fields for users Information!";
        this.fadeAwayMessage.header = "System Message";
      } else if (this.step.id == 1) {
        this.step = { id: 2, name: "Accounts Modules" };
      } else if (this.step.id == 2) {
        if (
          this.verifyModel.user_roleID == null ||
          this.verifyModel.assignedModuleID == null ||
          this.verifyModel.usertypeID == null
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.message =
            "Please fill-up required fields for users Modules!";
          this.fadeAwayMessage.header = "System Message";
        } else {
          this.step = { id: 3, name: "Account Information" };
        }
      }

      //  else if (this.step.id == 3) {
      //   if (this.$refs.Step3Formref.validate()) {
      //     this.step = { id: 4, name: "Otp Confirmation" };
      //   }
      // }
    },

    getAssignedModules() {
      this.axiosCall("/assigned-modules", "GET").then((res) => {
        console.log("AssignedM", res.data);
        let data = res.data;
        this.assignedModulesList = data;
      });
    },
    getUseRoles() {
      this.axiosCall("/user-role", "GET").then((res) => {
        console.log("UserRole", res.data);
        this.userRoleList = res.data;
      });
    },
    refresh() {
      this.fname = null;
      this.lname = null;
      this.mname = null;
      this.email = null;
      this.password = null;
      this.confirmPassword = null;
      this.verifyModel.user_roleID = null;
      this.verifyModel.assignedModuleID = null;
      this.verifyModel.usertypeID = null;
    },
  },
};
</script>
