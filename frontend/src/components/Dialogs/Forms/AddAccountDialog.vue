<template>
  <div>
    <v-dialog v-model="dialog" persistent scrollable max-width="600px">
      <v-card rounded="xl" elevation="2">
        <v-card-title
          class="d-flex align-center justify-space-between px-6 py-4 dialog-header"
        >
          <div>
            <div class="text-h6 font-weight-bold">{{ action }} User</div>
            <div class="text-caption dialog-header-subtitle">
              {{ step.name }}
            </div>
          </div>

          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="closeD"
          />
        </v-card-title>

        <!-- Step progress (only meaningful for the multi-step "Add" flow) -->
        <v-row>
          <v-col cols="12">
            <div v-if="action === 'Add'" class="step-progress px-6 py-3">
              <div v-for="s in 3" :key="s" class="step-dot-wrap">
                <div
                  class="step-dot"
                  :class="{
                    'step-dot--active': s === step.id,
                    'step-dot--done': s < step.id,
                  }"
                >
                  <v-icon v-if="s < step.id" size="14" color="white">
                    mdi-check
                  </v-icon>

                  <span v-else>{{ s }}</span>
                </div>

                <div
                  v-if="s < 3"
                  class="step-line"
                  :class="{ 'step-line--done': s < step.id }"
                />
              </div>
            </div>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-form ref="AddAccount" @submit.prevent>
          <v-card-text class="pa-6">
            <v-container fluid class="pa-0">
              <!-- Step 1: Name Fields -->
              <v-row v-if="step.id === 1">
                <v-col cols="12">
                  <v-text-field
                    v-model="fname"
                    label="First Name"
                    prepend-inner-icon="mdi-account"
                    :rules="[formRules.required]"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="mname"
                    label="Middle Name"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="lname"
                    label="Last Name"
                    prepend-inner-icon="mdi-account"
                    :rules="[formRules.required]"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                  />
                </v-col>
              </v-row>

              <!-- Step 2: Module & Access -->
              <v-row v-if="step.id === 2">
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.assignedModuleID"
                    :items="assignedModulesList"
                    item-value="id"
                    item-title="description"
                    label="Assign Module"
                    :rules="userId == 3 ? [formRules.required] : []"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    color="#E35E93"
                  />
                </v-col>

                <v-col cols="12">
                  <v-card
                    variant="outlined"
                    rounded="lg"
                    class="pa-3 d-flex justify-space-between align-center access-card"
                  >
                    <div>
                      <div class="font-weight-medium">
                        Multiple Roles Access
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Allow user to access multiple sub-modules
                      </div>
                    </div>
                    <v-switch
                      v-model="isValidated"
                      true-value="1"
                      false-value="0"
                      inset
                      color="#E35E93"
                      hide-details
                    />
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="isValidated == 1">
                  <v-autocomplete
                    v-model="subModules"
                    :items="filteredAccessModules"
                    item-value="id"
                    item-title="description"
                    label="Sub Modules"
                    variant="outlined"
                    multiple
                    chips
                    closable-chips
                    density="compact"
                    rounded="lg"
                    color="#E35E93"
                    :rules="[formRules.required]"
                  />
                </v-col>
              </v-row>

              <!-- Step 3: Email & Password -->
              <v-row v-if="step.id === 3">
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :readonly="action === 'Edit'"
                    prepend-inner-icon="mdi-email"
                    :rules="[formRules.required, formRules.email]"
                    @change="checkEmail()"
                    :error-messages="emailError"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                  />

                  <v-text-field
                    v-model="password"
                    :label="action === 'Edit' ? 'New Password' : 'Password'"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="showPassword = !showPassword"
                    prepend-inner-icon="mdi-lock"
                    :rules="[formRules.required, formRules.password]"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    class="mt-3"
                  />

                  <v-text-field
                    v-if="action !== 'Edit'"
                    v-model="confirmPassword"
                    label="Confirm Password"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    :append-inner-icon="
                      showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="
                      showPasswordConfirm = !showPasswordConfirm
                    "
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    :rules="[
                      formRules.required,
                      formRules.confirmPassword(confirmPassword, password),
                    ]"
                    class="mt-3"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="px-6 py-4">
            <v-btn color="red" variant="outlined" rounded="lg" @click="closeD()"
              >Close</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              @click="backForm()"
              color="#E35E93"
              variant="outlined"
              rounded="lg"
              v-if="step.id != 1 && action != 'Edit'"
              >Back</v-btn
            >
            <v-btn
              color="#6DB249"
              variant="flat"
              rounded="lg"
              @click="handleAction()"
              :loading="isLoading"
            >
              {{ getButtonText }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    />
  </div>
</template>

<script>
import eventBus from '@/eventBus';
export default {
  props: {
    data: Object,
    action: String,
  },
  data() {
    return {
      dialog: false,
      isValidated: false,
      isLoading: false,
      subModules: [],
      step: { id: 1, name: 'Personal Information' },
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
      assigneAccessModulesList: [],
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Added!',
        message: '',
        top: 10,
      },
    };
  },
  computed: {
    filteredAccessModules() {
      if (!this.verifyModel.assignedModuleID) {
        return this.assigneAccessModulesList;
      }

      return this.assigneAccessModulesList.filter(
        (item) => item.id !== this.verifyModel.assignedModuleID,
      );
    },
    getButtonText() {
      if (this.step.id === 3) {
        return this.action === 'Add' ? 'Save' : 'Update';
      } else {
        return this.action === 'Update' ? 'Update' : 'Next';
      }
    },
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        // this.$refs.AddAccount.resetValidation();
        if (data.id) {
          console.log('Love', data);
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
          if (this.action == 'Update') {
            this.step = { id: 1, name: 'Personal Information' };
          } else if (this.action == 'Edit') {
            this.step = { id: 3, name: 'Account Credentials' };
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
    handleAction() {
      // Step 3 logic
      if (this.step.id === 3) {
        this.action === 'Add' ? this.AddAccount() : this.UpdateCredentials();
        return;
      }

      // Other steps logic
      if (this.action === 'Update') {
        this.UpdateInfo();
      } else if (this.action === 'Edit') {
        this.UpdateCredentials();
      } else {
        this.Next();
      }
    },
    checkEmail() {
      this.emailChecking = true;
      this.axiosCall('/auth/checkEmailIfExist/' + this.email, 'GET').then(
        (res) => {
          console.log(res.data);
          if (res.data) {
            this.emailError = 'Email Already Exist!';
          } else {
            this.emailError = '';
          }
          this.emailChecking = false;
        },
      );
    },
    initialize() {
      this.userId = this.$store.state.user.id;
      this.getUserType();
      this.getAssignedModules();
      this.getUseRoles();
      this.getAccessControlAssignedModules();
    },
    getUserType() {
      this.axiosCall('/user-type/getAllUsertype', 'GET').then((res) => {
        if (res.data) {
          console.log('UserList', res.data);
          let data = res.data;
          this.usertypeList = data;
        }
      });
    },
    AddAccount() {
      // registration logic here
      if (this.password != this.confirmPassword) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = 'error';
        this.fadeAwayMessage.message = 'Password not mutch';
        this.fadeAwayMessage.header = 'System Message';
      } else {
        if (this.$refs.AddAccount.validate()) {
          this.isLoading = true;
          const selectedId = this.verifyModel.assignedModuleID;

          if (
            selectedId &&
            !this.subModules.some((item) => item.id === selectedId)
          ) {
            this.subModules.push(selectedId);
          }
          let data = {
            fname: this.fname,
            mname: this.mname,
            lname: this.lname,
            // user_roleID: this.userType == 0 ? 3 : 2,
            // isAdminApproved: this.userType == 0 ? 1 : 0,
            // suffix: this.suffix,
            isValidated: this.isValidated,
            subModules: JSON.stringify(this.subModules),
            email: this.email,
            password: this.password,
            usertypeID: 2,
            assignedModuleID: this.verifyModel.assignedModuleID,
            isAdminApproved: 1,
            user_roleID: 2,
          };
          console.log(data);
          this.axiosCall('/auth/addUserByAdmin', 'POST', data).then((res) => {
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'success';
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.header = 'System Message';
              this.$store.dispatch('setEmail', this.email);
              this.isLoading = false;
              this.closeD();
              this.refresh();
            } else {
              this.isLoading = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'error';
              this.fadeAwayMessage.message = res.data.message;
              this.fadeAwayMessage.header = 'System Message';
              this.animated = true;
            }
          });
        }
      }
    },
    UpdateCredentials() {
      if (this.password == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = 'error';
        this.fadeAwayMessage.message = 'Please fill-up required fields!';
        this.fadeAwayMessage.header = 'System Message';
      } else {
        this.isLoading = true;
        let data = {
          old_password: null,
          new_password: this.password,
        };
        this.axiosCall(
          '/auth/changePassIDCred/' + this.data.id,
          'POST',
          data,
        ).then((res) => {
          if (res.data.status == 200) {
            this.isLoading = false;
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.closeD();
            this.refresh();
          } else if (res.data.status == 400) {
            this.isLoading = false;
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'error';
            this.fadeAwayMessage.header = 'System Message';
          }
        });
      }
    },
    UpdateInfo() {
      this.isLoading = true;
      let data = {
        fname: this.fname,
        mname: this.mname,
        lname: this.lname,
      };
      this.axiosCall(
        '/user-details/updateUserInfo/' +
          this.data.id +
          '/' +
          JSON.stringify(data),
        'POST',
        data,
      ).then((res) => {
        if (res.data.status == 200) {
          this.isLoading = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.message = res.data.message;
          this.fadeAwayMessage.header = 'System Message';
          this.closeD();
          this.refresh();
        } else {
          this.isLoading = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.message = res.data.message;
          this.fadeAwayMessage.header = 'System Message';
          this.animated = true;
        }
      });
    },
    closeD() {
      eventBus.emit('closeAddAccountDialog', true);
      this.step = { id: 1, name: 'Personal Information' };
      this.dialog = false;
      this.refresh();
    },
    Next() {
      if (this.fname == null || this.lname == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = 'error';
        this.fadeAwayMessage.message =
          'Please fill-up required fields for users Information!';
        this.fadeAwayMessage.header = 'System Message';
      } else if (this.step.id == 1) {
        this.step = { id: 2, name: 'Accounts Modules' };
      } else if (this.step.id == 2) {
        if (
          this.verifyModel.assignedModuleID == null ||
          this.subModules == []
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.message =
            'Please fill-up required fields for users Modules!';
          this.fadeAwayMessage.header = 'System Message';
        } else {
          this.step = { id: 3, name: 'Account Information' };
        }
      }

      //  else if (this.step.id == 3) {
      //   if (this.$refs.Step3Formref.validate()) {
      //     this.step = { id: 4, name: "Otp Confirmation" };
      //   }
      // }
    },
    backForm() {
      if (this.step.id == 3) {
        this.step = { id: 2, name: 'Accounts Modules' };
      } else if (this.step.id == 2) {
        this.step = { id: 1, name: 'Personal Information' };
      }
    },

    getAssignedModules() {
      this.axiosCall('/assigned-modules', 'GET').then((res) => {
        console.log('AssignedM', res.data);
        let data = res.data;
        this.assignedModulesList = data;
      });
    },
    getUseRoles() {
      this.axiosCall('/user-role', 'GET').then((res) => {
        console.log('UserRole', res.data);
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
    getAccessControlAssignedModules() {
      this.axiosCall('/assigned-modules/getSpecificModules', 'GET').then(
        (res) => {
          // console.log("AssignedM", res.data);
          let data = res.data;
          this.assigneAccessModulesList = data;
        },
      );
    },
  },
};
</script>

<style scoped>
.dialog-header-subtitle {
  color: rgba(255, 255, 255, 0.85);
}

.access-card {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

/* Step progress indicator */
.step-progress {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #fafafa;
}

.step-dot-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
}

.step-dot {
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background-color: #e5e7eb;
  color: #6b7280;
  position: relative;
  z-index: 2;
}

.step-dot--active {
  background-color: #e35e93;
  color: #ffffff;
}

.step-dot--done {
  background-color: #6db249;
  color: #ffffff;
}

.step-line {
  position: absolute;
  height: 2px;
  background-color: #e5e7eb;

  left: calc(50% + 13px);
  right: calc(-50% + 13px);

  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.step-line--done {
  background-color: #6db249;
}
</style>
