<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="900px">
      <v-form ref="AddSubjectDialog" @submit.prevent>
        <v-card>
          <v-card-title class="d-flex dialog-header">
            <span>{{ action }} Track</span>
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
                <v-col cols="12" md="12">
                  <v-text-field
                    style="border: 1px solid gray; border-radius: 4px"
                    class="px-2"
                    v-model="track_name"
                    label="Track Name"
                    hide-details
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="#e35e93"
              class="white--text"
              v-if="action == 'Add'"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#e35e93"
              class="white--text"
              v-if="action == 'Update'"
              @click="checkConflict('UPDATE')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
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
      applicantNumber: null,
      seniorJunior: null,
      grade_level: null,
      subject_title: null,

      dateFrom: null,
      dateTo: null,
      room_section: null,
      updateID: null,
      track_name: null,
      departmentData: null,
      officeData: null,
      menu: false,
      menu2: false,
      remarksData: [],
      confirmSubmissionDialog: false,
      submitBtnLoading: false,
      schedTimeDialog: false,
      schedDialog: false,
      schedList: [],
      schedTimeList: [],
      tempSelectedDays: [],
      dialog: false,
      timePicker1: null,
      timePicker2: null,
      yearSelection: [],
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
        console.log("View Data", data.subject_title);
        if (data.id) {
          this.initialize();
          this.updateID = data.id;
          this.track_name = data.tracks_name;
        } else {
          this.$refs.AddSubjectDialog.reset();
          this.initialize();
          this.updateID = data.id;
          this.track_name = data.tracks_name;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.loadYearSelection();

      //   this.getEmpStatus();
      //   this.getInstitutes();
      //   this.getUserType();
    },

    loadYearSelection() {
      let d = new Date();

      for (let i = parseInt(d.getFullYear()); i >= 2021; i--) {
        this.yearSelection.push(i);
      }
    },

    closeD() {
      eventBus.emit("closeAddTrackDialog", false);
      this.dialog = false;
      this.confirmSubmissionDialog = false;
      this.confirmSubmit.type = null;
      this.confirmSubmit.error = false;
      this.confirmSubmit.msg = null;
    },

    checkConflict(type) {
      if (type == "ADD") {
        if (this.track_name == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill all fields";
        } else {
          let data = {
            tracks_name: this.track_name,
          };
          // console.log(data);
          this.axiosCall("/rooms-section/addTrack", "POST", data).then(
            (res) => {
              console.log(res.data);
              // alert("Successfully Added");
              this.closeD();
              if (res.data.status == 201) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = "Successfully Added Subject!";

                // location.reload();
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          );
        }
      } else if (type == "UPDATE") {
        // alert("UPDATED");
        if (this.track_name == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill all fields";
        } else {
          let data = {
            tracks_name: this.track_name,
          };
          console.log(data);
          this.axiosCall(
            "/rooms-section/updateTrack/" + this.updateID,
            "PATCH",
            data
          ).then((res) => {
            console.log(res.data);
            if (res.data.status == 201) {
              this.closeD();
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = "Successfully updated subject!";

              // location.reload();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        }
      }
    },
  },
};
</script>
