<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="400px">
      <v-form ref="TransmutedGradeDialog" @submit.prevent>
        <v-card rounded="xl">
          <v-card-title class="d-flex justif-center align-center">
            <span>{{ action }} Transmuted Grade</span>
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
          <v-card-text style="max-height: 700px">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  label="Transmuted Grade"
                  v-model="transmuted_grade"
                  variant="outlined"
                  color="pink"
                  density="compact"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Start Range"
                  color="pink"
                  v-model="start_range"
                  density="compact"
                  variant="outlined"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="End Range"
                  color="pink"
                  v-model="end_range"
                  density="compact"
                  variant="outlined"
                  type="number"
                ></v-text-field>
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
  },
  data() {
    return {
      updateID: null,
      dialog: false,
      transmuted_grade: null,
      start_range: null,
      end_range: null,
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
          this.transmuted_grade = data.transmuted_grade;
          this.start_range = data.start_range;
          this.end_range = data.end_range;
        } else {
          this.$refs.TransmutedGradeDialog.reset();
          this.initialize();
          this.updateID = null;
          this.transmuted_grade = null;
          this.start_range = null;
          this.end_range = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {},

    closeD() {
      eventBus.emit("closeTransmutedGradeDialog", false);
      this.dialog = false;
    },

    checkConflict(type) {
      if (type == "ADD") {
        if (
          this.transmuted_grade == null ||
          this.start_range == null ||
          this.end_range == null
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill all fields";
        } else {
          let data = {
            transmuted_grade: this.transmuted_grade,
            start_range: this.start_range.toString(),
            end_range: this.end_range.toString(),
          };
          console.log(data);
          this.axiosCall("/rooms-section/transmutedGrade", "POST", data).then(
            (res) => {
              console.log(res.data);
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
        }
      } else if (type == "UPDATE") {
        if (
          this.transmuted_grade == null ||
          this.start_range == null ||
          this.end_range == null
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill all fields";
        } else {
          let data = {
            transmuted_grade: this.transmuted_grade,
            start_range: this.start_range.toString(),
            end_range: this.end_range.toString(),
          };
          console.log(data);
          this.axiosCall(
            "/rooms-section/updateTransmutedGrade/" + this.updateID,
            "PATCH",
            data,
          ).then((res) => {
            console.log(res.data);
            if (res.data.status == 201) {
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
          });
        }
      }
    },
  },
};
</script>
