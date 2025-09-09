<template>
  <div>
    <v-dialog
      fullscreen
      v-model="dialog"
      persistent
      eager
      scrollable
      max-width="900px"
    >
      <v-form ref="dataGradeSubjects" @submit.prevent>
        <v-card>
          <v-card-title dark class="d-flex dialog-header pt-5 pb-5 pl-6">
            <span v-if="toAdd == 1">{{ action }} My Subject List</span>
            <span v-else>{{ action }} My Grade Level List</span>
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
                <v-col cols="12" class="elevation-1 mt-4">
                  <div class="d-flex flex-row-reverse">
                    <v-btn
                      color="#147452"
                      medium
                      class="mb-2 ma-2 pa-2"
                      outlined
                      @click="subjectGradeDialog = true"
                    >
                      <v-icon size="14">mdi-plus</v-icon>Add
                    </v-btn>
                  </div>
                  <v-data-table
                    :headers="toAdd == 1 ? headers : headers1"
                    :items="subject_list"
                    :items-per-page="10"
                    hide-default-footer
                  >
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="text-no-wrap">
                        <v-btn
                          x-small
                          color="red"
                          class="mx-1"
                          outlined
                          @click="deleteItem(item, index)"
                        >
                          <v-icon size="14">mdi-trash-can</v-icon>Delete
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
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

            <v-btn color="#147452" class="white--text" @click="save()">
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
            <v-btn
              color="#1eb6a8"
              class="white--text"
              v-if="action == 'Update'"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog
      v-model="subjectGradeDialog"
      persistent
      eager
      scrollable
      max-width="700px"
    >
      <v-form ref="subjectGradeDialogForm" @submit.prevent>
        <v-card>
          <v-card-title dark class="d-flex dialog-header pt-5 pb-5 pl-6">
            <span v-if="toAdd == 1">Add Subjects To Teach</span>
            <span v-else>Add Grade Level To Teach</span>
            <v-spacer></v-spacer>

            <v-btn
              icon="mdi-close"
              variant="text"
              color="red"
              @click="subjectGradeDialog = false"
            >
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="dataAddedList"
                    multiple
                    chips
                    dense
                    outlined
                    required
                    :label="toAdd == 1 ? 'Subjects' : 'Grade Level'"
                    :items="dataListed"
                    :item-title="toAdd == 1 ? 'subject_title' : 'description'"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn color="red" outlined @click="subjectGradeDialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="#147452"
              class="white--text"
              @click="saveSubjectGradeLevel()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
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
                data[i].subject_title + " (" + data[i].grade_level + ")"
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
                  data[i].subject_title + " (" + data[i].grade_level + ")"
                );
                this.dataAddedList.push(data[i].id);
              }
              this.subject_list = data;
            }
          }
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
          }
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
          }
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
