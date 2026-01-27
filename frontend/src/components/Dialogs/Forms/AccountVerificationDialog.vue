<template>
  <div>
    <v-dialog v-model="dialog" max-width="620" persistent scrollable>
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card rounded="xl" elevation="2">
          <!-- Header -->
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 font-weight-bold">{{ action }} User</div>
              <div class="text-caption text-grey">
                Assign modules and permissions
              </div>
            </div>

            <v-btn
              icon="mdi-close"
              variant="text"
              color="grey"
              @click="closeD"
            />
          </v-card-title>

          <v-divider />

          <!-- Content -->
          <v-card-text class="pa-6" style="max-height: 65vh">
            <v-row dense>
              <!-- Main Module -->
              <v-col cols="12">
                <v-autocomplete
                  v-model="verifyModel.assignedModuleID"
                  :rules="userId === 3 ? [formRules.required] : []"
                  :items="assignedModulesList"
                  item-value="id"
                  item-title="description"
                  label="Main Module"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Approval switch -->
              <v-col cols="12">
                <v-card
                  variant="outlined"
                  rounded="lg"
                  class="pa-4 d-flex justify-space-between align-center"
                >
                  <div>
                    <div class="font-weight-medium">Multiple Roles Access</div>
                    <div class="text-caption text-grey">
                      Allow user to access multiple sub-modules
                    </div>
                  </div>

                  <v-switch
                    v-model="isValidated"
                    true-value="1"
                    false-value="0"
                    inset
                    color="primary"
                    hide-details
                  />
                </v-card>
              </v-col>

              <!-- Sub Modules -->
              <v-col cols="12" v-if="isValidated == 1">
                <v-autocomplete
                  v-model="subModules"
                  :rules="[formRules.required]"
                  :items="filteredAccessModules"
                  item-value="id"
                  item-title="description"
                  label="Sub Modules"
                  variant="outlined"
                  density="comfortable"
                  multiple
                  chips
                  closable-chips
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <!-- Actions -->
          <v-card-actions class="px-6 py-4">
            <v-spacer />

            <v-btn variant="outlined" color="grey" @click="closeD">
              Cancel
            </v-btn>

            <v-btn color="primary" variant="flat" @click="accept">
              <v-icon start>
                {{
                  action === "Verify" ? "mdi-check-circle" : "mdi-content-save"
                }}
              </v-icon>
              {{ action === "Verify" ? "Accept" : "Update" }}
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
    data: Object,
    action: String,
  },
  data() {
    return {
      dialog: false,
      isValidated: false,
      subModules: [],
      statusList: [
        { id: 1, description: "Elementary" },
        { id: 2, description: "High School" },
      ],
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
        type: "success",
        header: "Successfully Added!",
        message: "",
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
  },

  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        // this.$refs.UserVerifyFormref.resetValidation();
        if (data.id) {
          console.log("Love", data);
          this.verifyModel.id = data.id;
          this.verifyModel.userID = data.user_id;
          this.verifyModel.name = data.name;
          this.verifyModel.empID = data.emp_empID;
          this.verifyModel.usertypeID = data.user_usertypeID.toString();
          this.verifyModel.user_roleID = data.user_user_roleID;
          this.verifyModel.assignedModuleID = data.user_assignedModuleID;
          this.isValidated = data.user_isValidated.toString();
          this.subModules = data.user_subModules
            ? JSON.parse(data.user_subModules)
            : [];

          // Remove the main module if present
          this.subModules = this.subModules.filter(
            (item) => item !== data.user_assignedModuleID,
          );

          console.log("this.subModules", this.subModules);

          this.verifyModel.newStatus = data.status;
          // this.verifyModel.date_hired = data.emp_date_hired;
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.userId = this.$store.state.user.id;
      this.getUserType();
      this.getAccessControlAssignedModules();
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
    closeD() {
      eventBus.emit("closeAccountsVerificationDialog", true);
      this.dialog = false;
    },
    accept() {
      // if (this.$refs.UserVerifyFormref.validate()) {
      const selectedId = this.verifyModel.assignedModuleID;

      if (
        selectedId &&
        !this.subModules.some((item) => item.id === selectedId)
      ) {
        this.subModules.push(selectedId);
      }
      let data = {
        id: this.verifyModel.id,
        userID: this.verifyModel.userID,
        usertypeID: this.verifyModel.usertypeID,
        user_roleID: this.verifyModel.user_roleID,
        assignedModuleID: this.verifyModel.assignedModuleID,
        isValidated: this.isValidated,
        subModules: JSON.stringify(this.subModules),
        status: this.verifyModel.newStatus,
        update_type: this.action == "Verify" ? 1 : 2,
      };
      console.log(this.subModules);
      this.axiosCall("/user-details/updateVerifiedUser", "POST", data).then(
        (res) => {
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
            // this.$refs.PositionFormref.reset();
            this.closeD();
          }
        },
      );
      // }
    },

    getAssignedModules() {
      this.axiosCall("/assigned-modules/", "GET").then((res) => {
        // console.log("AssignedM", res.data);
        let data = res.data;
        this.assignedModulesList = data;
      });
    },
    getAccessControlAssignedModules() {
      this.axiosCall("/assigned-modules/getSpecificModules", "GET").then(
        (res) => {
          // console.log("AssignedM", res.data);
          let data = res.data;
          this.assigneAccessModulesList = data;
        },
      );
    },
    getUseRoles() {
      this.axiosCall("/user-role", "GET").then((res) => {
        console.log("UserRole", res.data);
        this.userRoleList = res.data;
      });
    },
  },
};
</script>
