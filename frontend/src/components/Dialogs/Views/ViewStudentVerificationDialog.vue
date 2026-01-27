<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      eager
      scrollable
      max-width="1200px"
    >
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card elevation="2">
          <!-- Header -->
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 font-weight-bold">{{ action }} Student</div>
              <div class="text-caption text-grey">
                Update student personal information
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

          <v-card-text style="max-height: 700px" class="my-5">
            <v-row class="ma-5">
              <v-col cols="12">
                <div>
                  <h3>
                    <strong>{{ name }} Personal Information</strong>
                  </h3>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="fname"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Firstname"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="mname"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Middle Name"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="lname"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Last Name"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="suffix"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Suffix"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="bdate"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Birth Date"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="birth_place"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Birth Place"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="sex"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Sex"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="civil_status"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Civil Status"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="height"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Height(m)"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="weight"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Weight(kg)"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="blood_type"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Blood Type"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="isFilipino"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Citizenship"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="ip_Name"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="IP's Member"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="fourpis"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="4P's Member"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="mobile_no"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Mobile No."
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="email"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Email Address"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="disability_desc"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Disability"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <!--Address-->
              <v-col cols="12">
                <div>
                  <h3>
                    <strong>{{ name }} Personal Address</strong>
                  </h3>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="residential_house_no"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="House Number"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="residential_street"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Street"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="residential_subd"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Subdivision / Village"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="residential_brgy"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Barangay"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="residential_city"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Municipality / City"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="residential_prov"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Province"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="residential_zip"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Zip Code"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <!--Family-->
              <v-col cols="12">
                <div>
                  <h3>
                    <strong>{{ name }} Family Background</strong>
                  </h3>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="father_fname"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Fathers Firstname"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="father_mname"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Fathers Middlename"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="father_lname"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Fathers Lastname"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="father_number"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Fathers Contact Number"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="mother_fname"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Mothers Firtsname "
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="mother_mname"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Mothers Middlename "
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="mother_lname"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Mothers Lastname "
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="mother_number"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Mothers Contact Number "
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="guardian_fname"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Guardians Firstname"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="guardian_mname"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Guardians Middlename"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="guardian_lname"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Guardians Lastname"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="guardian_number"
                  :rules="action == 'View' ? [] : [formRules.required]"
                  chips
                  :readonly="readonly"
                  small-chips
                  label="Guardians Contact Number"
                  color="#6DB249"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </v-col>
            </v-row>
            <AccountVerificationDialog
              :data="updateData"
              :action="action"
              v-on:reloadTable="initialize"
            />
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5" v-if="action == 'View'">
            <v-spacer></v-spacer>
            <v-btn color="red" variant="outlined" @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>
            <!-- <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              variant="flat"
              @click="verifyStudent(data)"
            >
              <v-icon>mdi-check-circle</v-icon>
              Enroll
            </v-btn> -->
          </v-card-actions>
          <v-card-actions class="pa-5" v-if="action == 'Update'">
            <v-spacer></v-spacer>
            <v-btn color="red" variant="outlined" @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>
            <v-btn
              v-if="readonly == true"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              variant="flat"
              @click="readonly = false"
            >
              <v-icon>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-btn
              v-if="readonly == false"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              variant="flat"
              @click="accept()"
            >
              <v-icon>mdi-pencil </v-icon>
              update
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
import AccountVerificationDialog from "../Forms/student_verifyDialog.vue";
export default {
  props: {
    data: Object,
    action: String,
  },
  components: {
    AccountVerificationDialog,
  },
  data() {
    return {
      readonly: true,
      dialog: false,
      updateData: null,
      bdate: null,
      birth_place: null,
      blood_type: null,
      civil_status: null,
      disability: null,
      disability_desc: null,
      email: null,
      father_fname: null,
      father_lname: null,
      father_mname: null,
      father_number: null,
      fname: null,
      fourPs: null,
      fourpis: null,
      guardian_fname: null,
      guardian_lname: null,
      guardian_mname: null,
      guardian_number: null,
      height: null,
      id: null,
      ip_Name: null,
      isFilipino: null,
      is_IP: null,
      last_grade_completed: null,
      last_school_ID: null,
      last_school_attended: null,
      last_year_completed: null,
      lname: null,
      mname: null,
      mobile_no: null,
      mother_fname: null,
      mother_lname: null,
      mother_mname: null,
      mother_number: null,
      name: null,
      permanent_brgy: null,
      permanent_city: null,
      permanent_house_no: null,
      permanent_prov: null,
      permanent_street: null,
      permanent_subd: null,
      permanent_zip: null,
      residential_brgy: null,
      residential_city: null,
      residential_house_no: null,
      residential_prov: null,
      residential_street: null,
      residential_subd: null,
      residential_zip: null,
      seniorJunior: null,
      sex: null,
      suffix: null,
      track: null,
      transfered: null,
      weight: null,
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
        this.$refs.UserVerifyFormref.resetValidation();
        if (data.id) {
          console.log("Love", data);
          this.bdate = data.bdate;
          this.birth_place = data.birth_place;
          this.blood_type = data.blood_type;
          this.civil_status = data.civil_status;
          this.disability = data.disability;
          this.disability_desc = data.disability_desc;
          this.email = data.email;
          this.father_fname = data.father_fname;
          this.father_lname = data.father_lname;
          this.father_mname = data.father_mname;
          this.father_number = data.father_number;
          this.fname = data.fname;
          this.fourPs = data.fourPs;
          this.fourpis = data.fourpis;
          this.guardian_fname = data.guardian_fname;
          this.guardian_lname = data.guardian_lname;
          this.guardian_mname = data.guardian_mname;
          this.guardian_number = data.guardian_number;
          this.height = data.height;
          this.id = data.id;
          this.ip_Name = data.ip_Name;
          this.isFilipino = data.isFilipino;
          this.is_IP = data.is_IP;
          this.last_grade_completed = data.last_grade_completed;
          this.last_school_ID = data.last_school_ID;
          this.last_school_attended = data.last_school_attended;
          this.last_year_completed = data.last_year_completed;
          this.lname = data.lname;
          this.mname = data.mname;
          this.mobile_no = data.mobile_no;
          this.mother_fname = data.mother_fname;
          this.mother_lname = data.mother_lname;
          this.mother_mname = data.mother_mname;
          this.mother_number = data.mother_number;
          this.name = data.name;
          this.permanent_brgy = data.permanent_brgy;
          this.permanent_city = data.permanent_city;
          this.permanent_house_no = data.permanent_house_no;
          this.permanent_prov = data.permanent_prov;
          this.permanent_street = data.permanent_street;
          this.permanent_subd = data.permanent_subd;
          this.permanent_zip = data.permanent_zip;
          this.residential_brgy = data.residential_brgy;
          this.residential_city = data.residential_city;
          this.residential_house_no = data.residential_house_no;
          this.residential_prov = data.residential_prov;
          this.residential_street = data.residential_street;
          this.residential_subd = data.residential_subd;
          this.residential_zip = data.residential_zip;
          this.seniorJunior = data.seniorJunior;
          this.sex = data.sex;
          this.suffix = data.suffix;
          this.track = data.track;
          this.transfered = data.transfered;
          this.weight = data.weight;
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {},
    closeD() {
      eventBus.emit("closeStudentVerificationDialog", true);
      this.dialog = false;
      this.readonly = true;
    },
    verifyStudent(item) {
      console.log(item);
      this.updateData = item;
      // this.action = "Verify";
      this.dialog = false;
    },
    update() {
      alert("To be followed function");
    },
    accept() {
      if (this.$refs.UserVerifyFormref.validate()) {
        let data = {
          bdate: this.bdate,
          birth_place: this.birth_place,
          blood_type: this.blood_type,
          civil_status: this.civil_status,
          disability: this.disability,
          disability_desc: this.disability_desc,
          email: this.email,
          father_fname: this.father_fname,
          father_lname: this.father_lname,
          father_mname: this.father_mname,
          father_number: this.father_number,
          fname: this.fname,
          fourPs: this.fourPs,
          fourpis: this.fourpis,
          guardian_fname: this.guardian_fname,
          guardian_lname: this.guardian_lname,
          guardian_mname: this.guardian_mname,
          guardian_number: this.guardian_number,
          height: this.height,
          id: this.id,
          ip_Name: this.ip_Name,
          isFilipino: this.isFilipino,
          is_IP: this.is_IP,
          last_grade_completed: this.last_grade_completed,
          last_school_ID: this.last_school_ID,
          last_school_attended: this.last_school_attended,
          last_year_completed: this.last_year_completed,
          lname: this.lname,
          mname: this.mname,
          mobile_no: this.mobile_no,
          mother_fname: this.mother_fname,
          mother_lname: this.mother_lname,
          mother_mname: this.mother_mname,
          mother_number: this.mother_number,
          name: this.name,
          permanent_brgy: this.permanent_brgy,
          permanent_city: this.permanent_city,
          permanent_house_no: this.permanent_house_no,
          permanent_prov: this.permanent_prov,
          permanent_street: this.permanent_street,
          permanent_subd: this.permanent_subd,
          permanent_zip: this.permanent_zip,
          residential_brgy: this.residential_brgy,
          residential_city: this.residential_city,
          residential_house_no: this.residential_house_no,
          residential_prov: this.residential_prov,
          residential_street: this.residential_street,
          residential_subd: this.residential_subd,
          residential_zip: this.residential_zip,
          seniorJunior: this.seniorJunior,
          sex: this.sex,
          suffix: this.suffix,
          track: this.track,
          transfered: this.transfered,
          weight: this.weight,
          update_type: 2,
        };

        this.axiosCall(
          "/enroll-student/updateEnrolledStudent",
          "POST",
          data,
        ).then((res) => {
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
            this.$refs.UserVerifyFormref.reset();
            this.closeD();
          }
        });
      }
    },
  },
};
</script>
