<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      max-width="1000"
      transition="dialog-bottom-transition"
    >
      <v-form ref="dataGradeSubjects">
        <v-card class="rounded-xl">
          <!-- HEADER -->
          <v-card-title class="dialog-header d-flex align-center">
            <span class="text-h6">
              {{
                toAdd == 1
                  ? action + " My Subject List"
                  : action + " My Grade Level List"
              }}
            </span>

            <v-spacer />

            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              @click="closeD()"
            />
          </v-card-title>

          <!-- CONTENT -->
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12">
                <!-- ADD BUTTON -->
                <div class="d-flex justify-end mb-3">
                  <v-btn
                    color="#147452"
                    prepend-icon="mdi-plus"
                    variant="tonal"
                    @click="subjectGradeDialog = true"
                  >
                    Add
                  </v-btn>
                </div>

                <!-- TABLE (SCROLLABLE ON MOBILE) -->
                <div class="table-wrapper">
                  <v-data-table
                    :headers="toAdd == 1 ? headers : headers1"
                    :items="subject_list"
                    :items-per-page="10"
                    hide-default-footer
                  >
                    <template v-slot:[`item.action`]="{ item, index }">
                      <v-btn
                        size="small"
                        color="error"
                        variant="outlined"
                        @click="deleteItem(item, index)"
                      >
                        <v-icon start size="16">mdi-trash-can</v-icon>
                        Delete
                      </v-btn>
                    </template>
                  </v-data-table>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <!-- ACTIONS (MOBILE FRIENDLY) -->
          <v-card-actions class="pa-4">
            <v-row dense class="w-100">
              <v-col cols="12" sm="auto">
                <v-btn block variant="outlined" color="error" @click="closeD()">
                  Cancel
                </v-btn>
              </v-col>

              <v-col cols="12" sm="auto">
                <v-btn block color="#147452" @click="save" variant="flat">
                  Save
                </v-btn>
              </v-col>

              <v-col cols="12" sm="auto" v-if="action === 'Update'">
                <v-btn block color="#1eb6a8" @click="update"> Delete </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="subjectGradeDialog"
      persistent
      scrollable
      max-width="600"
      transition="dialog-bottom-transition"
    >
      <v-form ref="subjectGradeDialogForm">
        <v-card class="rounded-xl">
          <v-card-title class="dialog-header d-flex align-center">
            <span class="text-h6">
              {{
                toAdd == 1
                  ? "Add Subjects To Teach"
                  : "Add Grade Level To Teach"
              }}
            </span>

            <v-spacer />

            <v-btn
              icon="mdi-close"
              variant="text"
              color="white"
              @click="subjectGradeDialog = false"
            />
          </v-card-title>

          <v-card-text class="pa-4">
            <v-autocomplete
              v-model="dataAddedList"
              multiple
              chips
              density="comfortable"
              variant="outlined"
              :label="toAdd == 1 ? 'Subjects' : 'Grade Level'"
              :items="dataListed"
              :item-title="toAdd == 1 ? 'subject_title' : 'description'"
              item-value="id"
            />
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4">
            <v-row dense class="w-100">
              <v-col cols="12" sm="auto">
                <v-btn
                  block
                  variant="outlined"
                  color="error"
                  @click="subjectGradeDialog = false"
                >
                  Cancel
                </v-btn>
              </v-col>

              <v-col cols="12" sm="auto">
                <v-btn
                  block
                  color="#147452"
                  @click="saveSubjectGradeLevel"
                  variant="flat"
                >
                  Save
                </v-btn>
              </v-col>
            </v-row>
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
  </div>
</template>

<script>
import eventBus from "@/eventBus";
export default {
  props: {
    data: null,
    action: null,
    filter: null,
    toAdd: null,
  },

  data() {
    return {
      subjectGradeDialog: false,
      effective_date: null,
      id: null,
      dialog: false,
      resolution_list: [],
      subject_list: [],
      dataAddedList: [],
      dataListed: [],
      remove_item: [],
      room_section: null,
      headers: [
        {
          title: "Subject Name",
          value: "subject_title",
          align: "start",
          valign: "center",
          sortable: false,
        },

        {
          title: "Action",
          value: "action",
          align: "end",
          valign: "center",
          sortable: false,
        },
      ],
      headers1: [
        {
          title: "Grade Level",
          value: "description",
          align: "start",
          valign: "center",
          sortable: false,
        },

        {
          title: "Action",
          value: "action",
          align: "end",
          valign: "center",
          sortable: false,
        },
      ],
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
        this.initialize();
        this.dialog = true;
        if (data.id) {
          console.log("Data Title", data);
          this.getTaggedSubjects(data.id);
          this.dataAddedList = [];
          this.room_section = data.room_section;
        }
      },

      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getAllDataNeeded();
    },

    getAllDataNeeded() {
      if (this.toAdd == 1) {
        this.axiosCall("/subjects/getAllSubject/active", "GET").then((res) => {
          if (res.data) {
            let data = res.data;
            console.log("LISTED DATA", data);
            for (let i = 0; i < data.length; i++) {
              data[i].subject_title = this.toTitleCase(
                data[i].subject_title + " (" + data[i].grade_level + ")",
              );
            }
            this.dataListed = data;
          }
        });
      } else {
        // if (this.data.status == 1) {
        //   for (let index = 1; index < 7; index++) {
        //     const data = { id: index, description: "Grade " + [index] };

        //     this.dataListed.push(data);
        //   }
        // } else {
        for (let index = 7; index < 13; index++) {
          const data = { id: index, description: "Grade " + [index] };

          this.dataListed.push(data);
        }
        // }
      }
    },

    getTaggedSubjects(id) {
      if (this.toAdd == 1) {
        this.axiosCall("/subjects/getSubjectTaagged/" + id, "GET").then(
          (res) => {
            if (res.data) {
              let data = res.data;

              for (let i = 0; i < data.length; i++) {
                data[i].subject_title = this.toTitleCase(
                  data[i].subject_title + " (" + data[i].grade_level + ")",
                );
                this.dataAddedList.push(data[i].id);
              }
              this.subject_list = data;
            }
          },
        );
      } else {
        this.axiosCall("/subjects/getGradeTaagged/" + id, "GET").then((res) => {
          if (res.data) {
            let data = res.data;
            console.log("Grade Level", data);
            for (let i = 0; i < data.length; i++) {
              data[i].grade_level = this.toTitleCase(data[i].grade_level);
              this.dataAddedList.push(data[i].id);
            }
            this.subject_list = data;
          }
        });
      }
    },

    saveSubjectGradeLevel() {
      if (this.toAdd == 1) {
        for (let i = 0; i < this.dataListed.length; i++) {
          for (let j = 0; j < this.dataAddedList.length; j++) {
            if (this.dataListed[i].id == this.dataAddedList[j]) {
              if (
                this.subject_list.filter((e) => e.id == this.dataAddedList[j])
                  .length == 0
              ) {
                this.subject_list.push(this.dataListed[i]);
              }
            }
          }
        }

        this.subjectGradeDialog = false;
      } else {
        for (let i = 0; i < this.dataListed.length; i++) {
          for (let j = 0; j < this.dataAddedList.length; j++) {
            if (this.dataListed[i].id == this.dataAddedList[j]) {
              if (
                this.subject_list.filter((e) => e.id == this.dataAddedList[j])
                  .length == 0
              ) {
                this.subject_list.push(this.dataListed[i]);
              }
            }
          }
        }

        this.subjectGradeDialog = false;
      }
    },
    deleteItem(item, index) {
      console.log(item.id, index);

      if (item.id) {
        this.remove_item.push(this.subject_list[index]);
        this.subject_list.splice(index, 1);
        this.dataAddedList.splice(index, 1);
      } else {
        this.subject_list.splice(index, 1);
        this.dataAddedList.splice(index, 1);
      }
    },

    closeD() {
      eventBus.emit("closedDataGradeSubjects", false);
      this.initialize();
      this.$router.go(0);
      this.dialog = false;
    },

    save() {
      // if (this.subject_list.length > 0) {
      if (this.toAdd == 1) {
        let data = {
          userID: this.data.id,
          subject_list: JSON.stringify(this.subject_list),
          removed_subjects: JSON.stringify(this.remove_item),
        };
        this.axiosCall("/subjects/addTeachersSubject", "POST", data).then(
          (res) => {
            console.log(res);
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.closeD();
            } else {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          },
        );
      } else {
        let data = {
          userID: this.data.id,
          gradeLevel_list: JSON.stringify(this.subject_list),
          removed_gradeLevel: JSON.stringify(this.remove_item),
        };
        this.axiosCall("/subjects/addTeachers/Grade-Level", "POST", data).then(
          (res) => {
            console.log(res);
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.closeD();
            } else {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          },
        );
      }
    },

    // update() {
    //   console.log("Update Data");
    //   if (this.$refs.ShortListAccess.validate()) {
    //     const fd = new FormData();
    //     console.log(fd);
    //     let data = {
    //       resolution: this.resolution,
    //       effective_date: this.effective_date,
    //     };
    //     if (this.fileNewValue == true) {
    //       console.log("File naa", this.fileNewValue);
    //       fd.append("file", this.file_selected);
    //       fd.append("body", JSON.stringify(data));
    //       this.axiosCall("/resolution/" + this.id, "PATCH", fd).then((res) => {
    //         if (res.data.status == 200) {
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "success";
    //           this.fadeAwayMessage.header = "System Message";
    //           this.fadeAwayMessage.message = res.data.msg;
    //           this.closeD();
    //         } else {
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "error";
    //           this.fadeAwayMessage.header = "System Message";
    //           this.fadeAwayMessage.message = res.data.msg;
    //         }
    //       });
    //     } else {
    //       console.log("File", this.fileNewValue);
    //       this.axiosCall(
    //         "/resolution/noFileUploaded/" + this.id,
    //         "PATCH",
    //         data
    //       ).then((res) => {
    //         if (res.data.status == 200) {
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "success";
    //           this.fadeAwayMessage.header = "System Message";
    //           this.fadeAwayMessage.message = res.data.msg;
    //           this.closeD();
    //         } else {
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "error";
    //           this.fadeAwayMessage.header = "System Message";
    //           this.fadeAwayMessage.message = res.data.msg;
    //         }
    //       });
    //     }
    //   }
    // },

    getSchoolYear() {
      this.axiosCall("/school-year", "GET").then((res) => {
        console.log(res.data);
        this.syList = res.data;
      });
    },

    getEmpDetails() {
      this.axiosCall("/employee/my-details", "GET").then((res) => {
        console.log(res.data);
        this.assigned_office = res.data.officeID;
      });
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },

    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
  },
};
</script>

<style scoped>
.dialog-header {
  background: linear-gradient(135deg, #dc0b70, #f06292);
  color: white;
}

.table-wrapper {
  overflow-x: auto;
}
</style>
