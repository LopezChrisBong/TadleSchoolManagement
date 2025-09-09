<template>
  <div class="mx-2">
    <!-- <div
    class="pl-2 pt-2 pr-2 mx-2 fill-height"
    style="background-color: white; overflow-y: hidden; overflow-x: hidden"
  > -->
    <v-card class="">
      <v-form ref="myPdsForm">
        <v-row class="mb-2">
          <v-col cols="12" sm="6" md="6" lg="6" xl="6">
            <br />
            <p class="text-subtitle-2 ml-6">
              Palihog ug butang N/A pag dili applicable sa inyong impormasiyon!
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="px-6 pb-8">
            <v-tabs
              v-model="activeTab"
              :center-active="true"
              show-arrows
              color="#43A047"
              height="40"
              class="mt-n8 rounded-lg"
            >
              <v-tab
                v-for="tab in tabList"
                :key="tab.id"
                @click="changeTab(tab)"
                >{{ tab.name }}</v-tab
              >
            </v-tabs>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mt-2 px-8" cols="12">
            <div v-if="tab.id == 1">
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-text-field
                    v-model="lrnNo"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="LRN No. #"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-select
                    :items="schooYearList"
                    label="School Year"
                    color="#6DB249"
                    item-title="school_year"
                    item-value="id"
                    dense
                    v-model="selectedFiter"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <!-- <strong>Senior/Junior High Enrolly</strong
                  > -->
                  <v-divider></v-divider
                ></v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-select
                    :disabled="!isUpdate"
                    :items="
                      letStatus == 1 ? seniorJuniorList1 : seniorJuniorList
                    "
                    label="Grade Level Category"
                    :rules="[formRules.required]"
                    color="#6DB249"
                    dense
                    v-model="formdata.seniorJunior"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-select
                    :rules="[formRules.required]"
                    :items="
                      formdata.seniorJunior == 'Elementary'
                        ? elementaryList
                        : formdata.seniorJunior == 'Junior High'
                        ? juniorList
                        : formdata.seniorJunior == 'Senior High'
                        ? seniorList
                        : []
                    "
                    label="Grades"
                    color="#6DB249"
                    dense
                    v-model="grade_level"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-select
                    :disabled="!isUpdate"
                    :items="semesterList"
                    v-if="formdata.seniorJunior == 'Senior High'"
                    :rules="
                      formdata.seniorJunior == 'Senior High'
                        ? [formRules.required]
                        : []
                    "
                    label="Semester"
                    color="#6DB249"
                    dense
                    v-model="transfer.semester"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <!-- <v-text-field
                    :disabled="!isUpdate"
                    v-model="transfer.track"
                    v-if="formdata.seniorJunior == 'Senior High'"
                    :rules="
                      formdata.seniorJunior == 'Senior High'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="Track"
                    color="#6DB249"
                  >
                  </v-text-field> -->
                  <v-select
                    :disabled="!isUpdate"
                    :items="trackList"
                    v-if="formdata.seniorJunior == 'Senior High'"
                    :rules="
                      formdata.seniorJunior == 'Senior High'
                        ? [formRules.required]
                        : []
                    "
                    label="Tracks"
                    color="#6DB249"
                    item-title="tracks_name"
                    item-value="id"
                    dense
                    v-model="transfer.track"
                    @update:modelValue="changeTrackData"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-select
                    :disabled="!isUpdate"
                    :items="strandList"
                    v-if="formdata.seniorJunior == 'Senior High'"
                    :rules="
                      formdata.seniorJunior == 'Senior High'
                        ? [formRules.required]
                        : []
                    "
                    label="Strand"
                    color="#6DB249"
                    item-title="strand_name"
                    item-value="id"
                    dense
                    v-model="transfer.strand"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.fname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="First Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.mname"
                    dense
                    class="rounded-lg"
                    label="Middle Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.lname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Last Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.suffix"
                    dense
                    class="rounded-lg"
                    label="Suffix"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model:return-value="formdata.bdate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        v-model="formdata.bdate"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        color="#6DB249"
                        label="Date of Birth"
                        v-bind="attrs"
                        v-on="on"
                        type="date"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="formdata.bdate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.menu.save(formdata.bdate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.birth_place"
                    dense
                    class="rounded-lg"
                    label="Place of Birth"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-select
                    :disabled="!isUpdate"
                    :items="sexItem"
                    label="Sex"
                    color="#6DB249"
                    dense
                    v-model="formdata.sex"
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                  lg="3"
                  xl="3"
                  v-if="letStatus == 2"
                >
                  <v-select
                    :disabled="!isUpdate"
                    :items="cvl_statusItem"
                    label="Civil Status"
                    color="#6DB249"
                    dense
                    v-model="formdata.civil_status"
                  ></v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-if="formdata.civil_status == 'Others'"
                    v-model="formdata.civil_status1"
                    dense
                    class="rounded-lg"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.height"
                    dense
                    class="rounded-lg"
                    label="Height (m)"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.weight"
                    dense
                    class="rounded-lg"
                    label="Weight (kg)"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.blood_type"
                    dense
                    class="rounded-lg"
                    label="Blood Type"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-select
                    :disabled="!isUpdate"
                    :items="dualCtznItem"
                    label="Citizenship (Filipino)"
                    dense
                    color="#6DB249"
                    v-model="formdata.isFilipino"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-select
                    :disabled="!isUpdate"
                    :items="dualCtznItem"
                    label="IP's Member"
                    color="#6DB249"
                    dense
                    v-model="formdata.is_IP"
                  ></v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-if="formdata.is_IP == 'Yes'"
                    v-model="formdata.ip_Name"
                    :rules="formdata.is_IP == 'Yes' ? [formRules.required] : []"
                    dense
                    class="rounded-lg"
                    item-title="type"
                    item-value="id"
                    label="Tribe/Group Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-select
                    :disabled="!isUpdate"
                    :items="dualCtznItem"
                    label="4P's Beneficiary"
                    color="#6DB249"
                    dense
                    v-model="formdata.fourPs"
                  ></v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-if="formdata.fourPs == 'Yes'"
                    v-model="formdata.fourpis"
                    :rules="
                      formdata.fourPs == 'Yes' ? [formRules.required] : []
                    "
                    dense
                    class="rounded-lg"
                    item-title="type"
                    item-value="id"
                    label="Household ID number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.mobile_no"
                    :rules="[formdata.numberOnly]"
                    dense
                    class="rounded-lg"
                    label="Mobile number"
                    type="number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.email"
                    dense
                    class="rounded-lg"
                    label="Email address"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12"
                  ><strong>Is the child a Learner with Disability?</strong
                  ><v-divider></v-divider
                ></v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-select
                    :disabled="!isUpdate"
                    :items="dualCtznItem"
                    label="Yes / No:"
                    color="#6DB249"
                    dense
                    v-model="formdata.disability"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="transfer.disability_desc"
                    v-if="formdata.disability == 'Yes'"
                    :rules="
                      formdata.disability == 'Yes' ? [formRules.required] : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, specify the type of disability:"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                  <strong>Residential Address</strong>

                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_house_no"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="House Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_street"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Street"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_subd"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Subdivision / Village"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_brgy"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Barangay"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_city"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Municipality / City"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_prov"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Province"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_zip"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Zip Code"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                  <strong>Permanent Address</strong>
                  <v-checkbox
                    :disabled="!isUpdate"
                    v-model="computedSameAddress"
                    label="Is Same Address"
                    dense
                  ></v-checkbox>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_house_no"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="House Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_street"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Street"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_subd"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Subdivision / Village"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_brgy"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Barangay"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_city"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Municipality / City"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_prov"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Province"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_zip"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Zip Code"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12"
                  ><strong>Father</strong><v-divider></v-divider
                ></v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.father_fname"
                    dense
                    class="rounded-lg"
                    label="First Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.father_mname"
                    dense
                    class="rounded-lg"
                    label="Middle Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.father_lname"
                    dense
                    class="rounded-lg"
                    label="Last Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.father_number"
                    dense
                    class="rounded-lg"
                    label="Phone Number"
                    color="#6DB249"
                    type="number"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12"
                  ><strong>Mother's Maiden Name</strong><v-divider></v-divider
                ></v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.mother_fname"
                    dense
                    class="rounded-lg"
                    label="First Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.mother_mname"
                    dense
                    class="rounded-lg"
                    label="Middle Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.mother_lname"
                    dense
                    class="rounded-lg"
                    label="Last Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.mother_number"
                    dense
                    class="rounded-lg"
                    label="Phone Number"
                    color="#6DB249"
                    type="number"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12"
                  ><strong>Legal Guardian's Name</strong>
                  <!-- <v-checkbox
                    :disabled="!isUpdate"
                    v-model="computedNoSpouse"
                    label="No Spouse"
                    dense
                  ></v-checkbox
                  > -->
                  <v-divider></v-divider
                ></v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.guardian_fname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="First Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.guardian_mname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Middle Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.guardian_lname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Last Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.guardian_number"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Phone Number"
                    color="#6DB249"
                    type="number"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12"
                  ><strong class="mb-4">If Transfered Student</strong>
                  <!-- <v-checkbox
                    :disabled="!isUpdate"
                    v-model="computedNoSpouse"
                    label="No Spouse"
                    dense
                  ></v-checkbox
                  > -->
                  <v-divider></v-divider
                ></v-col>
                <v-col cols="12">
                  <v-select
                    :disabled="!isUpdate"
                    :items="dualCtznItem"
                    label="Tranfered"
                    color="#6DB249"
                    dense
                    v-model="formdata.transfered"
                    class="mt-2"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="transfer.last_grade_completed"
                    v-if="formdata.transfered == 'Yes'"
                    :rules="
                      formdata.transfered == 'Yes' ? [formRules.required] : []
                    "
                    dense
                    class="rounded-lg"
                    label="Last Grade Level Completed"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="transfer.last_year_completed"
                    v-if="formdata.transfered == 'Yes'"
                    :rules="
                      formdata.transfered == 'Yes' ? [formRules.required] : []
                    "
                    dense
                    class="rounded-lg"
                    label="Last School Year Level Completed"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="transfer.last_school_attended"
                    v-if="formdata.transfered == 'Yes'"
                    :rules="
                      formdata.transfered == 'Yes' ? [formRules.required] : []
                    "
                    dense
                    class="rounded-lg"
                    label="Last School Attended"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="transfer.last_school_ID"
                    v-if="formdata.transfered == 'Yes'"
                    :rules="
                      formdata.transfered == 'Yes' ? [formRules.required] : []
                    "
                    dense
                    class="rounded-lg"
                    label="School ID"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <p>File Upload:</p>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-file-input
                    outlined
                    v-model="GoodMoral"
                    dense
                    class="rounded-lg"
                    label="Good Moral"
                    color="#6DB249"
                    accept=".pdf, .png, .jpg, .jpeg"
                    :clearable="false"
                  >
                  </v-file-input>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-file-input
                    outlined
                    v-model="SchoolCard"
                    dense
                    class="rounded-lg"
                    label="School Card/Form137"
                    color="#6DB249"
                    accept=".pdf, .png, .jpg, .jpeg"
                    :clearable="false"
                  >
                  </v-file-input>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-file-input
                    outlined
                    v-model="PSA"
                    dense
                    class="rounded-lg"
                    label="Philippines Statistic Authority"
                    color="#6DB249"
                    accept=".pdf, .png, .jpg, .jpeg"
                    :clearable="false"
                  >
                  </v-file-input>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-file-input
                    outlined
                    v-model="Picture"
                    dense
                    class="rounded-lg"
                    label="2x2 Picture"
                    color="#6DB249"
                    accept=".pdf, .png, .jpg, .jpeg"
                    :clearable="false"
                  >
                  </v-file-input>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <v-row class="my-4">
          <v-col cols="1"> </v-col>
          <v-col cols="10" class="white--text rounded-lg">
            <v-btn
              block
              color="#e35e93"
              @click="confirmSave()"
              dense
              class="white--text"
            >
              Submit
            </v-btn>
          </v-col>
          <v-col cols="1"> </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- saving confirmation -->
    <v-dialog v-model="confirmDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1" v-if="confirmAction == 'SAVE'">
            <p style="text-align: justify">
              Are you sure you wish to save your changes?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn
            v-if="confirmAction == 'SAVE'"
            color="green"
            class="white--text"
            @click="saveUpdate()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- saving confirmation -->
    <v-dialog v-model="deleteConfirmDialog" persistent max-width="300">
      <v-card>
        <v-card-title class="text-h6 red white--text"> Warning! </v-card-title>
        <div class="pa-4 #3a3b3a--text">
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to <b>REMOVE</b> this data?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="deleteConfirmDialog = false">
            Close
          </v-btn>
          <v-btn color="green" class="white--text" @click="proceedRemove()">
            Confirm
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
    ></fade-away-message-component>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    juniorList: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    elementaryList: [
      "Kinder 1",
      "Kinder 2",
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6",
    ],
    seniorList: ["Grade 11", "Grade 12"],
    lrnNo: null,
    sheet: false,
    selectedFiter: null,
    grade_level: null,
    GoodMoral: null,
    PSA: null,
    SchoolCard: null,
    Picture: null,
    viewRemarks: false,
    submitDialog: false,
    isUpdate: true,
    isUpdateAllowed: false,
    confirmAction: null,
    confirmDialog: false,
    deleteConfirmDialog: false,
    itemData: null,
    indexToRemove: null,
    arrToRemove: null,
    semesterList: ["1st Semester", "2nd Semester"],
    empData: [],
    tab: { id: 1, name: "Personal Information" },
    activeTab: { id: 1, name: "Personal Information" },
    tabList: [{ id: 1, name: "Personal Information" }],
    sexItem: ["Male", "Female"],
    cvl_statusItem: ["Single", "Married", "Widowed", "Separated", "Others"],
    dualCtznItem: ["Yes", "No"],
    ctznTypeList: [
      { id: 1, type: "By birth" },
      { id: 2, type: "By naturalization" },
    ],
    countryList: [],
    seniorJuniorList: ["Junior High", "Senior High"],
    seniorJuniorList1: ["Junior High", "Senior High"],
    status: null,
    formdata: {
      id: null,
      fname: null,
      lname: null,
      mname: null,
      suffix: null,
      fourPs: "No",
      fourpis: null,
      seniorJunior: null,
      transfered: "No",
      email: null,
      bdate: null,
      is_IP: "No",
      ip_Name: null,
      birth_place: null,
      sex: null,
      civil_status: null,
      civil_status1: null,
      height: null,
      weight: null,
      blood_type: null,
      last_grade_completed: null,
      last_year_completed: null,
      last_school_attended: null,
      last_school_ID: null,
      citizenship: null,
      isFilipino: "Yes",
      disability: "No",
      disability_desc: null,
      country: null,
      tel_no: null,
      mobile_no: null,
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
      isSameAddress: false,
    },
    transfer: {
      id: null,
      last_grade_completed: null,
      last_year_completed: null,
      last_school_attended: null,
      last_school_ID: null,
      track: null,
      semester: null,
      strand: null,
    },
    family_background: {
      id: null,
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
    },
    levelCheck: null,
    isAllowPrint: false,
    trackList: [],
    strandList: [],
    action: "Add",
    letStatus: null,

    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
    workExpIndexToUpdate: null,
    lndToUpdate: null,
    remarksData: [],
  }),
  mounted() {
    this.letStatus = this.$store.state.user.status;
    if (this.letStatus == 1) {
      this.formdata.seniorJunior = "Junior High";
    } else {
      this.formdata.seniorJunior = "Junior High";
    }
    this.initialize();
  },

  computed: {
    computedSameAddress: {
      get: function () {
        return this.formdata.isSameAddress;
      },
      set: function (val) {
        this.formdata.isSameAddress = val ? true : false;

        this.formdata.permanent_zip = val
          ? this.formdata.residential_zip
          : null;
        this.formdata.permanent_house_no = val
          ? this.formdata.residential_house_no
          : null;
        this.formdata.permanent_street = val
          ? this.formdata.residential_street
          : null;
        this.formdata.permanent_subd = val
          ? this.formdata.residential_subd
          : null;
        this.formdata.permanent_brgy = val
          ? this.formdata.residential_brgy
          : null;
        this.formdata.permanent_city = val
          ? this.formdata.residential_city
          : null;
        this.formdata.permanent_prov = val
          ? this.formdata.residential_prov
          : null;
      },

      filterYear() {
        return this.$store.getters.getFilterSelected;
      },
    },

    computedRefences() {
      return this.references.length;
    },

    computedNoSpouse: {
      get: function () {
        return this.family_background.noSpouse;
      },
    },
  },
  methods: {
    prependData(val, arr) {
      var dumpArr = arr.slice();
      dumpArr.unshift(val);
      return dumpArr;
    },
    changeTab(i) {
      this.tab = i;
    },
    dispatch() {
      this.empData = [{ id: null }];
    },
    initialize() {
      this.getAllTracks();
      this.getSchoolYear();
    },
    getSchoolYear() {
      this.axiosCall("/enroll-student/getSchoolYear", "GET").then((res) => {
        if (res) {
          this.schooYearList = res.data;
          const currentDate = new Date();
          // Filter rows where the current date is between start_date and end_date
          const filteredData = res.data.filter((item) => {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            return currentDate >= startDate && currentDate <= endDate;
          });
          console.log("Filtered", filteredData[0].id);
          this.selectedFiter = filteredData[0];
        }
      });
    },

    changeTrackData(data) {
      this.axiosCall("/rooms-section/AllStrand/Enroll/" + data, "GET").then(
        (res) => {
          if (res) {
            console.log("All Strandsss", data + res.data);
            this.strandList = res.data;
          }
        }
      );
    },
    getCountry() {
      this.axiosCall("/country", "GET").then((res) => {
        this.countryList = res.data;
      });
    },
    print(withPic) {
      if (withPic) {
        this.axiosCall("/user-details/getUser", "GET").then((res) => {
          window.open(
            process.env.VUE_APP_SERVER +
              "/pdf-generator/generateMyPDS/" +
              res.data +
              "/true"
          );
        });
      } else {
        this.axiosCall("/user-details/getUser", "GET").then((res) => {
          window.open(
            process.env.VUE_APP_SERVER +
              "/pdf-generator/generateMyPDS/" +
              res.data +
              "/false"
          );
        });
      }
    },
    confirmSave() {
      if (this.$refs.myPdsForm.validate()) {
        this.confirmAction = "SAVE";
        this.confirmDialog = true;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message!";
        this.fadeAwayMessage.message = "Please fill all required fields";
      }
    },

    saveUpdate() {
      if (this.lrnNo == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "Please type your LRN No. to submit enrollment!";
        this.confirmDialog = false;
      } else {
        this.confirmDialog = false;
        const fd = new FormData();
        let file = new File(["default content"], "default.pdf", {
          type: "application/pdf",
        });

        let goodMoral;
        if (this.GoodMoral == null) {
          goodMoral = file;
        } else {
          goodMoral = this.GoodMoral;
        }

        let birthPSA;
        if (this.PSA == null) {
          birthPSA = file;
        } else {
          birthPSA = this.PSA;
        }

        let schoolCard;
        if (this.SchoolCard == null) {
          schoolCard = file;
        } else {
          schoolCard = this.SchoolCard;
        }

        let picture;
        if (this.Picture == null) {
          picture = file;
        } else {
          picture = this.Picture;
        }

        let arrFile = [goodMoral, birthPSA, schoolCard, picture];

        for (let i = 0; i < arrFile.length; i++) {
          const element = arrFile[i];
          fd.append("file", element);
        }
        // let filter = this.$store.getters.getFilterSelected;
        let data = {
          fname: this.formdata.fname,
          lname: this.formdata.lname,
          mname: this.formdata.mname,
          suffix: this.formdata.suffix,
          email: this.formdata.email,
          bdate: this.formdata.bdate,
          birth_place: this.formdata.birth_place,
          sex: this.formdata.sex,
          civil_status: this.formdata.civil_status,
          seniorJunior: this.formdata.seniorJunior,
          transfered: this.formdata.transfered == "No" ? false : true,
          height: this.formdata.height,
          weight: this.formdata.weight,
          is_IP: this.formdata.is_IP == "No" ? false : true,
          ip_Name: this.formdata.ip_Name,
          fourPs: this.formdata.fourPs == "No" ? false : true,
          fourpis: this.formdata.fourpis,
          disability: this.formdata.disability == "No" ? false : true,
          disability_desc: this.formdata.disability_desc,
          blood_type: this.formdata.blood_type,
          isFilipino: this.formdata.isFilipino == "Yes" ? "Filipino" : null,
          mobile_no: this.formdata.mobile_no,
          residential_zip: this.formdata.residential_zip,
          residential_house_no: this.formdata.residential_house_no,
          residential_street: this.formdata.residential_street,
          residential_subd: this.formdata.residential_subd,
          residential_brgy: this.formdata.residential_brgy,
          residential_city: this.formdata.residential_city,
          residential_prov: this.formdata.residential_prov,
          permanent_zip: this.formdata.permanent_zip,
          permanent_house_no: this.formdata.permanent_house_no,
          permanent_street: this.formdata.permanent_street,
          permanent_subd: this.formdata.permanent_subd,
          permanent_brgy: this.formdata.permanent_brgy,
          permanent_city: this.formdata.permanent_city,
          permanent_prov: this.formdata.permanent_prov,
          isSameAddress: this.formdata.isSameAddress,

          father_fname: this.family_background.father_fname,
          father_mname: this.family_background.father_mname,
          father_lname: this.family_background.father_lname,
          father_number: this.family_background.father_number,
          mother_fname: this.family_background.mother_fname,
          mother_mname: this.family_background.mother_mname,
          mother_lname: this.family_background.mother_lname,
          mother_number: this.family_background.mother_number,
          guardian_fname: this.family_background.guardian_fname,
          guardian_mname: this.family_background.guardian_mname,
          guardian_lname: this.family_background.guardian_lname,
          guardian_number: this.family_background.guardian_number,

          last_grade_completed: this.transfer.last_grade_completed,
          last_year_completed: this.transfer.last_year_completed,
          last_school_attended: this.transfer.last_school_attended,
          last_school_ID: this.transfer.last_school_ID,
          track: this.transfer.track,
          semester: this.transfer.track,
          strand: this.transfer.track,
          school_yearId: this.selectedFiter,
          grade_level: this.grade_level,
          lrnNo: this.lrnNo,
        };

        fd.append("body", JSON.stringify(data));
        console.log("FD", fd);
        this.axiosCall(
          "/enroll-student/enrollStudentWithFile",
          "POST",
          fd
        ).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message Enrollment";
            this.fadeAwayMessage.message = res.data.msg;
            this.$router.go(0);
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    getAllTracks() {
      this.axiosCall("/rooms-section/getAlltracks/Data/tracks", "GET").then(
        (res) => {
          if (res) {
            console.log("Tracks", res.data);
            this.trackList = res.data;
            this.loading = false;
          }
        }
      );
    },
  },
};
</script>

<style>
.notifBadgeYellow {
  background-color: rgba(255, 255, 34, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgb(140, 140, 14);
  margin: 0 0 0 7px;
  font-weight: 500;
}

.notifBadgeOrange {
  background-color: rgba(255, 122, 34, 0.546);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgb(147, 65, 1);
  margin: 0 0 0 7px;
  font-weight: 500;
}

.notifBadgePurple {
  background-color: rgba(255, 138, 255, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: purple;
  margin: 0 0 0 7px;
  font-weight: 500;
}

.notifBadgeBlue {
  background-color: rgba(138, 210, 255, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgb(0, 75, 128);
  margin: 0 0 0 7px;
  font-weight: 500;
}

.notifBadgeGreen {
  background-color: rgba(47, 199, 17, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgb(21, 128, 0);
  margin: 0 0 0 7px;
  font-weight: 500;
}

thead th {
  background-color: #e35e93 !important;
  color: white !important;
}
thead th:first-child {
  border-radius: 5px 0 0 0;
}
thead th:last-child {
  border-radius: 0 5px 0 0;
}
</style>
