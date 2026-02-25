<template>
  <v-container fluid class="pa-6 grey-lighten-4 fill-height">
    <v-row>
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="4">
        <!-- Student Profile -->
        <v-card class="pa-4 rounded-xl mb-4 elevation-3">
          <div class="text-h6 font-weight-bold mb-4">Student Profile</div>

          <div class="d-flex align-center">
            <v-avatar size="70" class="me-4">
              <v-img src="https://i.pravatar.cc/100" />
            </v-avatar>

            <div>
              <div class="font-weight-bold text-body-1">John Dela Cruz</div>
              <div class="text-caption">LRN: 123456789012</div>
              <div class="text-caption">Grade: 8 - Section A</div>
              <div class="text-caption">Adviser: Mrs. Santos</div>
              <div class="text-caption">School Year: 2023–2024</div>
              <div class="text-caption">Quarter: Q3</div>
            </div>
          </div>
        </v-card>

        <!-- Academic Performance -->
        <v-card class="pa-4 rounded-xl elevation-3 mb-4">
          <div class="text-h6 font-weight-bold mb-4">Academic Performance</div>

          <div class="mb-3">
            <div class="d-flex justify-space-between text-caption">
              <span>Math</span>
              <span class="text-red">62%</span>
            </div>
            <v-progress-linear
              model-value="62"
              color="red"
              height="8"
              rounded
            />
          </div>

          <div class="mb-3">
            <div class="d-flex justify-space-between text-caption">
              <span>Science</span>
              <span class="text-orange">74%</span>
            </div>
            <v-progress-linear
              model-value="74"
              color="orange"
              height="8"
              rounded
            />
          </div>

          <div>
            <div class="d-flex justify-space-between text-caption">
              <span>English</span>
              <span class="text-green">88%</span>
            </div>
            <v-progress-linear
              model-value="88"
              color="green"
              height="8"
              rounded
            />
          </div>
        </v-card>

        <!-- Reports -->
        <v-card class="pa-4 rounded-xl elevation-3">
          <div class="text-h6 font-weight-bold mb-4">Reports</div>

          <v-list density="compact">
            <v-list-item title="SF9: Report Card" subtitle="Q3">
              <template #append>
                <v-btn size="small" variant="text">View</v-btn>
              </template>
            </v-list-item>

            <v-list-item title="Attendance Record" subtitle="Jan – Mar">
              <template #append>
                <v-btn size="small" variant="text">View</v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" md="8">
        <!-- Attendance Overview -->
        <v-card class="pa-6 rounded-xl mb-4 elevation-3">
          <div class="text-h6 font-weight-bold mb-4">Attendance Overview</div>

          <v-row align="center">
            <v-col cols="12" md="4" class="text-center">
              <v-progress-circular
                model-value="78"
                size="130"
                width="15"
                color="green"
              >
                78%
              </v-progress-circular>
            </v-col>

            <v-col cols="12" md="8">
              <v-chip color="green" class="me-2">25 Present</v-chip>
              <v-chip color="orange" class="me-2">8 Absences</v-chip>
              <v-chip color="yellow-darken-2">3 Late</v-chip>

              <div class="mt-4">
                <v-alert type="error" density="compact" variant="tonal">
                  LARDO ALERT
                </v-alert>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-row>
          <!-- Alert & Discipline -->
          <v-col cols="12" md="6">
            <v-card class="pa-4 rounded-xl elevation-3">
              <div class="text-h6 font-weight-bold mb-3">
                Alert & Discipline Status
              </div>

              <v-alert type="error" variant="flat" class="mb-3">
                Learner At-Risk of Dropping Out
              </v-alert>

              <div class="text-caption">Risk Level: <strong>High</strong></div>
              <div class="text-caption">
                Reason: <strong>5 Consecutive Absences</strong>
              </div>
              <div class="text-caption">
                Status: <strong>Under Monitoring</strong>
              </div>
            </v-card>
          </v-col>

          <!-- Discipline Case -->
          <v-col cols="12" md="6">
            <v-card class="pa-4 rounded-xl elevation-3">
              <div class="text-h6 font-weight-bold mb-3">Discipline Case</div>

              <v-timeline density="compact">
                <v-timeline-item dot-color="blue">
                  Academic Concern
                </v-timeline-item>
                <v-timeline-item dot-color="grey"> Reported </v-timeline-item>
                <v-timeline-item dot-color="grey"> Counseled </v-timeline-item>
                <v-timeline-item dot-color="red">
                  Referred to Prefect
                </v-timeline-item>
              </v-timeline>

              <v-btn color="error" block class="mt-3"> Under Ongoing </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <!-- Announcements -->
          <v-col cols="12" md="6">
            <v-card class="pa-4 rounded-xl elevation-3">
              <div class="text-h6 font-weight-bold mb-3">Announcements</div>

              <v-list density="compact">
                <v-list-item
                  title="Parent Meeting"
                  subtitle="Reminder: Friday at 3PM"
                />
                <v-list-item
                  title="Field Trip Update"
                  subtitle="Rescheduled to March 10"
                />
              </v-list>
            </v-card>
          </v-col>

          <!-- Recent Notifications -->
          <v-col cols="12" md="6">
            <v-card class="pa-4 rounded-xl elevation-3">
              <div class="text-h6 font-weight-bold mb-3">
                Recent Notifications
              </div>

              <v-list density="compact">
                <v-list-item title="At-Risk of Failing in Math" />
                <v-list-item title="5 Consecutive Absences" />
                <v-list-item title="Arrived 15 minutes late today" />
                <v-list-item title="New Announcement Posted" />
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script></script>
<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
