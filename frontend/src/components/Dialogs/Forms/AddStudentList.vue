<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable fullscreen>
      <v-form ref="StudentDataList" @submit.prevent>
        <v-card>
          <v-card-title
            class="d-flex dialog-header justify-center align-center"
          >
            <span>{{ action }} Student List</span>
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
            <v-row>
              <v-col cols="4">
                <v-file-input
                  @change="parseCSV()"
                  clearable
                  variant="outlined"
                  density="compact"
                  label="Upload File"
                  accept=".csv"
                  class="rounded-lg"
                  v-model="csv_file"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-card
                  class="my-5 dt-container"
                  elevation="1"
                  variant="outlined"
                  color="grey"
                >
                  <v-data-table
                    :headers="headers"
                    :items="csv_results.data"
                    :items-per-page="10"
                  >
                    <template v-slot:[`item.Transferred`]="{ item }">
                      {{ item.Transferred == 0 ? "No" : "Yes" }}
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="outlined" @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="#e35e93"
              variant="flat"
              class="white--text"
              :loading="isLoading"
              @click="save()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
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
import Papa from "papaparse";
import eventBus from "@/eventBus";
export default {
  components: {},
  props: {
    data: null,
    action: null,
    filter: null,
  },
  data() {
    return {
      updateID: null,
      dialog: false,
      semester: null,
      csv_file: null,
      csv_results: [],
      isLoading: false,
      students: [],
      parsed: false,
      headers: [
        {
          title: "First Name",
          value: "First Name",
          align: "start",
          valign: "start",
        },
        {
          title: "Middle Name",
          value: "Middle Name",
          align: "start",
          valign: "start",
        },
        {
          title: "Last Name",
          value: "Last Name",
          align: "start",
          valign: "start",
        },
        {
          title: "Suffix",
          value: "Suffix",
          align: "start",
          valign: "start",
        },
        {
          title: "Birth Date",
          value: "Birthdate",
          align: "center",
          valign: "cener",
        },
        {
          title: "Sex",
          value: "Sex",
          align: "center",
          valign: "cener",
        },
        {
          title: "Level",
          value: "Level",
          align: "center",
          valign: "cener",
        },
        {
          title: "Transferred",
          value: "Transferred",
          align: "center",
          valign: "cener",
        },
        {
          title: "Nationality",
          value: "Nationality",
          align: "center",
          valign: "cener",
        },

        {
          title: "Grade",
          value: "Grade",
          align: "end",
          valign: "end",
        },
        {
          title: "Mobile Number",
          value: "Mobile Number",
          align: "end",
          valign: "end",
        },

        {
          title: "LRN No.",
          value: "LRN No.",
          align: "end",
          valign: "end",
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

  computed: {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("View Data", data);
        if (data.id) {
          this.initialize();
        } else {
          this.initialize();
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {},
    parseCSV() {
      Papa.parse(this.csv_file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // console.log("results", results);
          this.csv_results = results;
          this.parsed = true;
        }.bind(this),
      });
    },
    save() {
      this.isLoading = true;
      const headerMap = {
        "First Name": "fname",
        "Last Name": "lname",
        "Middle Name": "mname",
        Suffix: "suffix",
        Birthdate: "bdate",
        Sex: "sex",
        Level: "seniorJunior",
        Transferred: "transfered",
        Nationality: "isFilipino",
        Grade: "grade_level",
        "Mobile Number": "mobile_no",
        "LRN No.": "lrnNo",
      };

      const formattedData = this.csv_results.data.map((row) => {
        const formattedRow = {};

        Object.keys(headerMap).forEach((csvHeader) => {
          formattedRow[headerMap[csvHeader]] = row[csvHeader] ?? null;
        });

        // defaults for missing DB fields
        return {
          email: null,
          birth_place: null,
          civil_status: null,
          is_IP: 0,
          ip_Name: null,
          track: null,
          semester: null,
          strand: null,
          fourPs: 0,
          fourpis: null,
          blood_type: null,
          residential_zip: null,
          residential_house_no: null,
          residential_street: null,
          residential_subd: null,
          residential_brgy: null,
          residential_city: null,
          residential_prov: null,
          permanent_zip: null,
          permanent_house_no: null,
          permanent_street: null,
          permanent_subd: null,
          permanent_brgy: null,
          permanent_city: null,
          permanent_prov: null,
          father_fname: null,
          father_mname: null,
          father_lname: null,
          father_number: null,
          mother_fname: null,
          mother_mname: null,
          mother_lname: null,
          mother_number: null,
          guardian_fname: null,
          guardian_mname: null,
          guardian_lname: null,
          guardian_number: null,
          last_grade_completed: null,
          last_year_completed: null,
          last_school_attended: null,
          last_school_ID: null,
          disability: 0,
          disability_desc: null,
          statusEnrolled: 0,
          picture: null,
          goodMoral: 0,
          birthPSA: 0,
          schoolCard: 0,
          height: null,
          weight: null,
          school_yearId: this.filter,
          roomID: this.data[0].roomID,
          grade_level: this.data[0].grade_level,

          // mapped CSV values override defaults
          ...formattedRow,
        };
      });
      console.log(formattedData);
      let data = {
        data: JSON.stringify(formattedData),
      };
      // console.log("FINAL PAYLOAD:", data);
      this.axiosCall("/enroll-student/importStudent", "POST", data).then(
        (res) => {
          if (res.data.status == 201 || res.data.status == 200) {
            this.isLoading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message Enrollment";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else {
            this.isLoading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        },
      );
    },
    closeD() {
      eventBus.emit("closeStudentDataList", false);
      this.csv_file = null;
      this.csv_results = [];
      this.dialog = false;
    },
  },
};
</script>
