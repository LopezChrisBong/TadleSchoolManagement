<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="500px">
      <v-form ref="AddSchoolYear" @submit.prevent>
        <v-card rounded="xl">
          <v-card-title dark class="d-flex pt-5 pb-2 pl-6">
            <span>{{ action }} School Year</span>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              @click="closeD()"
            >
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="max-height: 700px" class="my-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="school_year_from"
                  :rules="[formRules.required]"
                  variant="outlined"
                  density="compact"
                  :readonly="action == 'Update' ? true : false"
                  class="rounded-lg"
                  item-title="description"
                  item-value="id"
                  label="Year From"
                  color="#93CB5B"
                  :items="year_fromList"
                  @update:modelValue="onChangeDateFrom"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="school_year_to"
                  variant="outlined"
                  density="compact"
                  readonly
                  label="School Year To:"
                  class="rounded-lg"
                  item-title="description"
                  item-value="id"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="12" v-if="action == 'Update'">
                <v-autocomplete
                  v-model="status"
                  :rules="[formRules.required]"
                  variant="outlined"
                  density="compact"
                  class="rounded-lg"
                  item-title="name"
                  item-value="id"
                  label="Status"
                  color="#93CB5B"
                  :items="[
                    { id: 1, name: 'Activate' },
                    { id: 0, name: 'Inactive' },
                  ]"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" variant="outlined" @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="pink"
              variant="flat"
              class="white--text"
              v-if="action == 'Add'"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="pink"
              variant="flat"
              class="white--text"
              v-if="action == 'Update'"
              @click="confirmDialog = true"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="360">
      <v-card rounded="lg">
        <!-- Header -->
        <v-card-title class="d-flex align-center">
          <!-- <v-icon class="mr-2">mdi-alert-circle</v-icon> -->
          <span class="text-h6 font-weight-bold">Update Confirmation</span>
        </v-card-title>

        <v-divider />

        <!-- Content -->
        <v-card-text class="pt-4" v-if="status == 1">
          <p class="text-body-1 text-justify mb-2">
            Are you sure you want to activate this school year?
          </p>

          <v-alert type="info" variant="tonal" density="compact" class="mt-2">
            This action is <strong>irreversible</strong> all students that are
            enrolled on the last school year will automatically set to
            unenrolled.
          </v-alert>
        </v-card-text>

        <v-card-text class="pt-4" v-else>
          <p class="text-body-1 text-justify mb-2">
            Updates are only allowed when changing the status from inactive to
            active.
          </p>

          <v-alert type="info" variant="tonal" density="compact" class="mt-2">
            This school year has been set to inactive. No updates are allowed.
          </v-alert>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="px-4 pb-4">
          <v-spacer />

          <v-btn variant="outlined" color="grey" @click="confirmDialog = false">
            Cancel
          </v-btn>

          <v-btn
            color="info"
            v-if="status == 1"
            variant="flat"
            class="ml-2"
            @click="checkConflict('UPDATE')"
          >
            Yes, Update
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
      :timeout="3000"
    ></fade-away-message-component>
    <!-- schedule day of week  -->
  </div>
</template>

<script>
import eventBus from "@/eventBus";
export default {
  components: {},
  props: {
    data: null,
    action: null,
    grade: null,
  },
  data() {
    return {
      status: null,
      year_fromList: [],
      confirmDialog: false,
      updateID: null,
      school_year_to: null,
      school_year_from: null,
      dialog: false,
      confirmSubmit: {
        error: false,
        msg: null,
        type: null,
        show: false,
      },

      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },

  computed: {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        if (data.id) {
          console.log("School Year", data);
          this.initialize();
          this.updateID = data.id;
          this.school_year_from = data.school_year_from;
          this.school_year_to = data.school_year_to;
          this.status = data.status;
        } else {
          this.$refs.AddSchoolYear.reset();
          this.initialize();
          this.school_year_from = data.school_year_from;
          this.school_year_to = data.school_year_to;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.loadYearFrom();
    },

    closeD() {
      eventBus.emit("closeAddSchoolYearDialog", false);
      this.dialog = false;
      this.confirmSubmit.type = null;
      this.confirmSubmit.error = false;
      this.confirmSubmit.msg = null;
    },
    loadYearFrom() {
      let d = new Date();

      let yr = d.getFullYear();

      for (let i = yr; i < yr + 10; i++) {
        this.year_fromList.push(i);
      }
    },
    onChangeDateFrom(data) {
      this.school_year_to = data + 1;
    },

    checkConflict(type) {
      if (type == "ADD") {
        let data = {
          school_year_from: this.school_year_from,
          school_year_to: this.school_year_to,
        };
        // console.log(data);
        this.axiosCall("/enroll-student/addSchoolYear", "POST", data).then(
          (res) => {
            console.log(res.data);
            // alert("Successfully Added");
            this.closeD();
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = "Successfully Added Subject!";
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          },
        );
      } else if (type == "UPDATE") {
        // alert("UPDATED");

        let data = {
          school_year_from: this.school_year_from,
          school_year_to: this.school_year_to,
          status: this.status,
        };
        console.log(data);
        this.axiosCall(
          "/enroll-student/updateSchoolYear/" + this.updateID,
          "PATCH",
          data,
        ).then((res) => {
          console.log(res.data);
          if (res.data.status == 200) {
            this.closeD();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Successfully updated!!";
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
          location.reload();
        });
      }
    },
  },
};
</script>
