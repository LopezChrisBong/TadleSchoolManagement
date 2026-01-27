<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app class="top-bot" elevation="2" style="position: sticky">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="text-h6 font-weight-bold">LOGO</div>
          <div class="text-subtitle-1 font-weight-bold">
            SOUTHERN
            <!-- <v-btn
              variant="text"
              @click="enroll()"
              class="text-subtitle-1 font-weight-bold"
            >
              ENROLL</v-btn
            > -->
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container class="py-10">
        <!-- Header -->
        <h2 class="text-center text-white text-h5 font-weight-bold mb-8">
          USERS PORTAL
        </h2>

        <!-- Modules -->
        <v-row justify="center" align="center" dense>
          <v-col
            v-for="(item, i) in modules"
            :key="i"
            cols="12"
            sm="4"
            md="3"
            class="d-flex justify-center"
          >
            <v-card
              :elevation="item.active ? 4 : 1"
              :class="[
                'd-flex flex-column align-center justify-center pa-6 mx-3 transition-all',
                item.active ? 'bg-success text-white' : 'bg-grey-lighten-4',
              ]"
              rounded="lg"
              width="300"
              height="200"
              @click="setActive(i)"
            >
              <v-icon size="70" :color="item.active ? 'white' : 'grey'">
                {{ item.icon }}
              </v-icon>
              <div
                class="mt-4 text-center text-body-1 font-weight-medium"
                :class="item.active ? 'text-white' : 'text-grey-darken-2'"
              >
                {{ item.label }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer  style="position: sticky"-->
    <v-footer app elevation="2" class="top-bot">
      <v-col class="text-center py-4" cols="12" md="6">
        &copy; {{ new Date().getFullYear() }} — SOUTHERN. All rights reserved.
      </v-col>
      <v-col class="text-center py-4" cols="12" md="6">
        <v-icon>mdi-email</v-icon>southern@gmail.com
        <v-icon>mdi-facebook</v-icon>Sounthern National High School
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "portalPage",
  data: () => ({
    modules: [
      { icon: "mdi-account-child", label: "Parents/Guardian", active: false },
      {
        icon: "mdi-human-male-board",
        label: "Admin/Faculty",
        active: false,
      },
      //   { icon: "mdi-account", label: "Student/Alumni", active: false },
      //   { icon: "mdi-chart-bar", label: "Finance", active: false },
      //   { icon: "mdi-folder-multiple", label: "Admin Module", active: false },
      //   { icon: "mdi-cash-register", label: "Cashier", active: false },
    ],
  }),
  methods: {
    setActive(index) {
      console.log(index);
      this.modules.forEach((mod, i) => {
        mod.active = i === index;
        localStorage.setItem("userType", index);
        this.$router.push("/login");
      });
    },
    enroll() {
      this.$router.push("/student-enroll");
    },
  },
};
</script>
<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
.v-card {
  transition: 0.2s ease;
  cursor: pointer;
}
.v-card:hover {
  transform: scale(1.05);
  background-color: green;
}
.v-main {
  background: linear-gradient(135deg, #e0cad9, #bb73a9);
}
.top-bot {
  background-color: #cc49a5;
  color: white;
}
</style>
