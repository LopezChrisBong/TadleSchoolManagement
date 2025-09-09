<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable fullscreen>
      <v-form ref="AddSchoolYear" @submit.prevent>
        <v-card>
          <v-card-title dark class="d-flex dialog-header">
            <span v-if="data"
              >REPORT ON LEARNER'S OBSERVED VALUES OF
              {{ toUpperCaseData(data.name) }}</span
            >
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
                <v-col cols="12" md="3" class="d-flex">
                  <v-autocomplete
                    v-if="data"
                    v-model="quarter"
                    :items="
                      data.grade_level == 'Grade 11' ||
                      data.grade_level == 'Grade 12'
                        ? ['1st Quarter', '2nd Quarter']
                        : [
                            '1st Quarter',
                            '2nd Quarter',
                            '3rd Quarter',
                            '4th Quarter',
                          ]
                    "
                    chips
                    variant="outlined"
                    density="compact"
                    label="Quarter"
                    @update:modelValue="changeQuarter"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="d-flex">
                  <v-autocomplete
                    v-model="semester"
                    :label="
                      data &&
                      !['Grade 11', 'Grade 12'].includes(data.grade_level)
                        ? 'Grade Level'
                        : 'Semester'
                    "
                    :disabled="
                      data &&
                      !['Grade 11', 'Grade 12'].includes(data.grade_level)
                    "
                    :items="['1st Semester', '2nd Semester']"
                    chips
                    variant="outlined"
                    density="compact"
                    @update:modelValue="changeQuarter"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    color="pink"
                    block
                    outlined
                    @click="openDialogVlaues()"
                  >
                    <v-icon>mdi-eye-outline</v-icon>
                    View All
                  </v-btn>
                </v-col>
                <v-col cols="12" md="12">
                  <v-table
                    class="custom-table"
                    density="comfortable"
                    fixed-header
                  >
                    <thead>
                      <tr>
                        <th class="text-center" rowspan="2" style="width: 10%">
                          CORE VALUES
                        </th>
                        <th class="text-center" rowspan="2" style="width: 65%">
                          BEHAVIOR STATEMENT
                        </th>
                        <th class="text-center" colspan="2" style="width: 15%">
                          {{ semester }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-center">{{ quarter }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- 1. Maka-Diyos -->
                      <tr>
                        <td rowspan="2" class="text-center">1. Maka-Diyos</td>
                        <td>
                          Express one's spiritual beliefs while respecting the
                          spiritual belief of others.
                        </td>
                        <td class="text-center">
                          <v-autocomplete
                            v-model="md1_values"
                            variant="outlined"
                            density="compact"
                            class="rounded-lg mt-2"
                            item-value="value"
                            item-title="value"
                            label="Marking"
                            color="#93CB5B"
                            :items="markingList"
                          >
                          </v-autocomplete>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Show adherence to ethical principles by upholding
                          truth.
                        </td>
                        <td class="text-center">
                          <v-autocomplete
                            v-model="md2_values"
                            variant="outlined"
                            density="compact"
                            class="rounded-lg mt-2"
                            item-value="value"
                            item-title="value"
                            label="Marking"
                            color="#93CB5B"
                            :items="markingList"
                          >
                          </v-autocomplete>
                        </td>
                      </tr>

                      <!-- 2. Maka-tao -->
                      <tr>
                        <td rowspan="2" class="text-center">2. Maka-tao</td>
                        <td>
                          Is sensitive to individual, social and cultural
                          differences.
                        </td>
                        <td class="text-center">
                          <v-autocomplete
                            v-model="mt1_values"
                            variant="outlined"
                            density="compact"
                            class="rounded-lg mt-2"
                            item-value="value"
                            item-title="value"
                            label="Marking"
                            color="#93CB5B"
                            :items="markingList"
                          >
                          </v-autocomplete>
                        </td>
                      </tr>
                      <tr>
                        <td>Demonstrates contributions towards solidarity.</td>
                        <td class="text-center">
                          <v-autocomplete
                            v-model="mt2_values"
                            variant="outlined"
                            density="compact"
                            class="rounded-lg mt-2"
                            item-value="value"
                            item-title="value"
                            label="Marking"
                            color="#93CB5B"
                            :items="markingList"
                          >
                          </v-autocomplete>
                        </td>
                      </tr>

                      <!-- 3. Maka-kalikasan -->
                      <tr>
                        <td class="text-center">3. Maka-kalikasan</td>
                        <td>
                          Cares for the environment and utilizes resources
                          wisely, judiciously, economically.
                        </td>
                        <td class="text-center">
                          <v-autocomplete
                            v-model="mk1_values"
                            variant="outlined"
                            density="compact"
                            class="rounded-lg mt-2"
                            item-value="value"
                            item-title="value"
                            label="Marking"
                            color="#93CB5B"
                            :items="markingList"
                          >
                          </v-autocomplete>
                        </td>
                      </tr>

                      <!-- 4. Maka-bansa -->
                      <tr>
                        <td rowspan="2" class="text-center">4. Maka-bansa</td>
                        <td>
                          Demonstrate pride in being a Filipino; exercises the
                          rights and responsibilities of a Filipino citizen.
                        </td>
                        <td class="text-center">
                          <v-autocomplete
                            v-model="mb1_values"
                            variant="outlined"
                            density="compact"
                            class="rounded-lg mt-2"
                            item-value="value"
                            item-title="value"
                            label="Marking"
                            color="#93CB5B"
                            :items="markingList"
                          >
                          </v-autocomplete>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Demonstrates appropriate behavior in carrying out
                          activities in the school, community and country.
                        </td>
                        <td class="text-center">
                          <v-autocomplete
                            v-model="mb2_values"
                            variant="outlined"
                            density="compact"
                            class="rounded-lg mt-2"
                            item-value="value"
                            item-title="value"
                            label="Marking"
                            color="#93CB5B"
                            :items="markingList"
                          >
                          </v-autocomplete>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
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
              v-if="edit"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
            <v-btn
              color="#e35e93"
              class="white--text"
              v-if="!edit"
              @click="checkConflict('UPDATE')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="ViewAllValueDialog" fullscreen>
      <v-card>
        <!-- Header -->
        <v-toolbar color="pink" dark>
          <v-toolbar-title>REPORT ON LEARNER'S OBSERVED VALUES</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="ViewAllValueDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- Content -->
        <v-card-text>
          <!-- Main Table -->
          <v-table class="custom-table" density="comfortable" fixed-header>
            <thead>
              <tr>
                <th class="text-center" rowspan="2">CORE VALUES</th>
                <th class="text-center" rowspan="2">BEHAVIOR STATEMENT</th>
                <th
                  class="text-center"
                  v-if="data"
                  :colspan="
                    data.grade_level == 'Grade 11' ||
                    data.grade_level == 'Grade 12'
                      ? 2
                      : 4
                  "
                >
                  {{
                    data.grade_level == "Grade 11" ||
                    data.grade_level == "Grade 12"
                      ? "1st Semester"
                      : "Junior High"
                  }}
                </th>
                <th
                  class="text-center"
                  colspan="2"
                  v-if="
                    (data && data.grade_level == 'Grade 11') ||
                    data.grade_level == 'Grade 12'
                  "
                >
                  2nd Semester
                </th>
              </tr>
              <tr>
                <th class="text-center">1st Qtr.</th>
                <th class="text-center">2nd Qtr.</th>
                <th class="text-center">3rd Qtr.</th>
                <th class="text-center">4th Qtr.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="2" class="text-center">1. Maka-Diyos</td>
                <td>
                  Express one's spiritual beliefs while respecting the spiritual
                  belief of others.
                </td>
                <td class="text-center">
                  {{ firstQuarter ? firstQuarter.md1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ secondQuarter ? secondQuarter.md1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ thirdQuarter ? thirdQuarter.md1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ fourthQuarter ? fourthQuarter.md1_values : "None" }}
                </td>
              </tr>
              <tr>
                <td>
                  Show adherence to ethical principles by upholding truth.
                </td>
                <td class="text-center">
                  {{ firstQuarter ? firstQuarter.md2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ secondQuarter ? secondQuarter.md2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ thirdQuarter ? thirdQuarter.md2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ fourthQuarter ? fourthQuarter.md2_values : "None" }}
                </td>
              </tr>
              <tr>
                <td rowspan="2" class="text-center">2. Maka-tao</td>
                <td>
                  Is sensitive to individual, social and cultural differences.
                </td>
                <td class="text-center">
                  {{ firstQuarter ? firstQuarter.mt1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ secondQuarter ? secondQuarter.mt1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ thirdQuarter ? thirdQuarter.mt1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ fourthQuarter ? fourthQuarter.mt1_values : "None" }}
                </td>
              </tr>
              <tr>
                <td>Demonstrates contributions towards solidarity.</td>
                <td class="text-center">
                  {{ firstQuarter ? firstQuarter.mt2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ secondQuarter ? secondQuarter.mt2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ thirdQuarter ? thirdQuarter.mt2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ fourthQuarter ? fourthQuarter.mt2_values : "None" }}
                </td>
              </tr>
              <!-- 3. Maka-kalikasan -->
              <tr>
                <td class="text-center">3. Maka-kalikasan</td>
                <td>
                  Cares for the environment and utilizes resources wisely,
                  judiciously, economically.
                </td>
                <td class="text-center">
                  {{ firstQuarter ? firstQuarter.mk1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ secondQuarter ? secondQuarter.mk1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ thirdQuarter ? thirdQuarter.mk1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ fourthQuarter ? fourthQuarter.mk1_values : "None" }}
                </td>
              </tr>

              <!-- 4. Maka-bansa -->
              <tr>
                <td rowspan="2" class="text-center">4. Maka-bansa</td>
                <td>
                  Demonstrate pride in being a Filipino; exercises the rights
                  and responsibilities of a Filipino citizen.
                </td>
                <td class="text-center">
                  {{ firstQuarter ? firstQuarter.mb1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ secondQuarter ? secondQuarter.mb1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ thirdQuarter ? thirdQuarter.mb1_values : "None" }}
                </td>
                <td class="text-center">
                  {{ fourthQuarter ? fourthQuarter.mb1_values : "None" }}
                </td>
              </tr>
              <tr>
                <td>
                  Demonstrates appropriate behavior in carrying out activities
                  in the school, community and country.
                </td>
                <td class="text-center">
                  {{ firstQuarter ? firstQuarter.mb2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ secondQuarter ? secondQuarter.mb2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ thirdQuarter ? thirdQuarter.mb2_values : "None" }}
                </td>
                <td class="text-center">
                  {{ fourthQuarter ? fourthQuarter.mb2_values : "None" }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Legend Table -->
          <v-row>
            <v-col cols="12" md="6">
              <h4 class="mt-6 mb-2 text-center">Marking Legend</h4>
              <v-table class="custom-table" density="comfortable">
                <thead>
                  <tr>
                    <th class="text-center">MARKING</th>
                    <th class="text-center">NON - NUMERICAL RATING</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">AO</td>
                    <td>Always Observed</td>
                  </tr>
                  <tr>
                    <td class="text-center">SO</td>
                    <td>Sometimes Observed</td>
                  </tr>
                  <tr>
                    <td class="text-center">RO</td>
                    <td>Rarely Observed</td>
                  </tr>
                  <tr>
                    <td class="text-center">NO</td>
                    <td>Not Observed</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Footer -->
        <v-card-actions>
          <v-spacer />
          <v-btn variant="tonal" color="red" @click="ViewAllValueDialog = false"
            >Close</v-btn
          >
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
      updateID: null,
      md1_values: null,
      md2_values: null,
      mt1_values: null,
      mt2_values: null,
      mk1_values: null,
      mb1_values: null,
      mb2_values: null,
      ViewAllValueDialog: false,
      firstQuarter: [],
      secondQuarter: [],
      thirdQuarter: [],
      fourthQuarter: [],
      dialog: false,
      edit: true,
      quarter: "1st Quarter",
      semester: null,
      filter: null,
      userRoleID: null,
      markingList: [
        { value: "AO", description: "Always Observed" },
        { value: "SO", description: "Sometimes Observed" },
        { value: "RO", description: "Rarely Observed" },
        { value: "NO", description: "Not Observed" },
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

  computed: {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        if (data.id) {
          console.log("Data Moral", data);
          data.grade_level == "Grade 11" || data.grade_level == "Grade 12"
            ? (this.semester = "1st Semester")
            : (this.semester = "Junior High");
          this.initialize();
          // this.updateID = data.id;
        } else {
          this.initialize();
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.filter = this.$store.getters.getFilterSelected;
      this.userRoleID = this.$store.state.user.id;
      this.getValuesData();
    },
    getValuesData() {
      this.axiosCall(
        "/enroll-student/getValuesData/" +
          this.filter +
          "/" +
          this.data.id +
          "/" +
          this.data.roomId +
          "/" +
          this.quarter +
          "/" +
          this.semester,
        "GET"
      ).then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          console.log("Daaradawad", res.data[0].mb1_values);
          this.updateID = res.data[0].id;
          this.mb1_values = res.data[0].mb1_values;
          this.mb2_values = res.data[0].mb2_values;
          this.mk1_values = res.data[0].mk1_values;
          this.md1_values = res.data[0].md1_values;
          this.md2_values = res.data[0].md2_values;
          this.mt1_values = res.data[0].mt1_values;
          this.mt2_values = res.data[0].mt2_values;
          this.edit = false;
        }
      });
    },
    changeQuarter() {
      this.axiosCall(
        "/enroll-student/getValuesData/" +
          this.filter +
          "/" +
          this.data.id +
          "/" +
          this.data.roomId +
          "/" +
          this.quarter +
          "/" +
          this.semester,
        "GET"
      ).then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.updateID = res.data[0].id;
          this.mb1_values = res.data[0].mb1_values;
          this.mb2_values = res.data[0].mb2_values;
          this.mk1_values = res.data[0].mk1_values;
          this.md1_values = res.data[0].md1_values;
          this.md2_values = res.data[0].md2_values;
          this.mt1_values = res.data[0].mt1_values;
          this.mt2_values = res.data[0].mt2_values;
          this.edit = false;
        } else {
          this.mb1_values = null;
          this.mb2_values = null;
          this.mk1_values = null;
          this.md1_values = null;
          this.md2_values = null;
          this.mt1_values = null;
          this.mt2_values = null;
          this.edit = true;
        }
      });
    },

    closeD() {
      eventBus.emit("closeStudentBehaviorStatementDialog", false);
      this.dialog = false;
      this.edit = true;
      this.md1_values = null;
      this.md2_values = null;
      this.mb1_values = null;
      this.mb2_values = null;
      this.mk1_values = null;
      this.mt1_values = null;
      this.mt2_values = null;
    },

    checkConflict(type) {
      if (type == "ADD") {
        let data = {
          roomId: this.data.roomId,
          studentId: this.data.id,
          quarter: this.quarter,
          semester: this.semester,
          school_yearId: this.filter,
          md1_values: this.md1_values,
          md2_values: this.md2_values,
          mt1_values: this.mt1_values,
          mt2_values: this.mt2_values,
          mk1_values: this.mk1_values,
          mb1_values: this.mb1_values,
          mb2_values: this.mb2_values,
        };
        console.log(data);
        this.axiosCall("/enroll-student/studentValues", "POST", data).then(
          (res) => {
            console.log(res.data);
            // alert("Successfully Added");

            if (res.data.status == 201) {
              this.closeD();
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
          }
        );
      } else if (type == "UPDATE") {
        // alert("UPDATED");
        let data = {
          md1_values: this.md1_values,
          md2_values: this.md2_values,
          mt1_values: this.mt1_values,
          mt2_values: this.mt2_values,
          mk1_values: this.mk1_values,
          mb1_values: this.mb1_values,
          mb2_values: this.mb2_values,
        };
        console.log(data);
        this.axiosCall(
          "/enroll-student/updateStudentValues/" + this.updateID,
          "PATCH",
          data
        ).then((res) => {
          console.log(res.data);
          if (res.data.status == 200) {
            this.closeD();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Successfully updated subject!";
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    openDialogVlaues() {
      this.ViewAllValueDialog = true;
      this.axiosCall(
        "/enroll-student/getAllValuesData/" + this.filter + "/" + this.data.id,
        "GET"
      ).then((res) => {
        // if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        console.log(res.data);
        this.firstQuarter = res.data[0];
        this.secondQuarter = res.data[1];
        this.thirdQuarter = res.data[2];
        this.fourthQuarter = res.data[3];
        // }
      });
    },
  },
};
</script>

<style scoped>
.custom-table {
  border: 1px solid black;
}
.custom-table th,
.custom-table td {
  border: 1px solid black !important;
  vertical-align: middle;
  margin: 10px;
}
</style>
