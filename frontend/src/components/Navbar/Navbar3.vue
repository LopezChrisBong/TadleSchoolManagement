<template>
  <div class="mt-2">
    <v-navigation-drawer
      persistent
      v-model="drawer"
      :permanent="$vuetify.breakpoint.smAndUp"
      :mini-variant.sync="mini"
      :temporary="!$vuetify.breakpoint.smAndUp"
      app
      style="background-color: #e35e93"
    >
      <!-- <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="mini"
    permanent
    style="background-color: transparent"
  > -->
      <v-list-item class="px-2" style="margin-top: 5px">
        <v-list-item-avatar>
          <v-img
            src="../../assets/img/Asuncion National High Scholl.jpg"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-title class="white--text font-weight-bold"
          >(SMS)
        </v-list-item-title>

        <v-btn
          icon
          @click.stop="mini = !mini"
          v-if="$vuetify.breakpoint.smAndUp"
        >
          <v-icon class="white--text">mdi-menu-open</v-icon>
        </v-btn>
        <v-btn icon @click="closeNav()" v-if="!$vuetify.breakpoint.smAndUp">
          <v-icon class="white--text">mdi-menu-open</v-icon>
        </v-btn>
      </v-list-item>

      <v-list nav dense class="sidebar mt-2">
        <div v-for="(link, i) in links" :key="i" style="background: #e35e93">
          <v-list-item
            v-if="!link.subLink"
            :key="link.title"
            router
            :to="'/' + userType + link.route"
            color="#808191"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="link" color="#3a3b3a" :value="false">
            <v-icon slot="prependIcon">{{ link.icon }}</v-icon>
            <template v-slot:activator>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </template>
            <div class="sub-item">
              <v-list-item
                v-for="sublink in link.subLink"
                router
                :to="'/' + userType + sublink.route"
                :key="sublink.title"
                color="#808191"
              >
                <v-list-item-icon>
                  <!-- <v-icon class="">{{ sublink.icon }}</v-icon> -->
                </v-list-item-icon>
                <v-list-item-title class="">{{
                  sublink.title
                }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- <v-app-bar app flat> -->
    <v-app-bar app flat color="#e35e93">
      <div
        class="d-flex elevation-4 mt-6 px-2 align-center rounded-t-lg"
        style="background-color: white; width: 100%; height: 60px"
      >
        <v-btn icon v-if="!$vuetify.breakpoint.smAndUp">
          <v-icon class="text-green-6DB249" @click="openMobileNav()"
            >mdi-menu-open</v-icon
          >
        </v-btn>
        <div class="pt-4" v-show="$vuetify.breakpoint.smAndUp">
          <!-- <h4 class="text-gray-100">Welcome {{ $store.state.user.fname }}!</h4> -->
          <h4 class="text-gray-100">
            School Management System - Asuncion National High School
          </h4>
          <p></p>
          <!-- <p class="text-caption text-gray-200">{{ getCurrentDate() }}</p> -->
        </div>
        <v-spacer></v-spacer>

        <v-menu>
          <template v-slot:activator="{ on }">
            <v-chip v-on="on" color="white" class="rounded-lg d-flex py-2">
              <v-avatar left :size="$vuetify.breakpoint.smAndUp ? 100 : 100">
                <img :src="profImg" max-width="100" />
              </v-avatar>
              <span
                v-if="$vuetify.breakpoint.smAndUp"
                style="width: 130px; text-align: center"
                ><strong
                  >{{ $store.state.user.fname }}
                  {{ $store.state.user.lname.charAt(0).toUpperCase() }}.</strong
                ><br />{{ $store.state.user.usertype.description }} /
                {{ getMyRole($store.state.user.user.user_roleID) }}
              </span>
              <v-icon right> mdi-chevron-down </v-icon>
            </v-chip>
          </template>
          <v-card width="240">
            <v-list color="#e35e93">
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="profImg" max-width="60" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="white--text"
                    >{{ $store.state.user.fname }}
                    {{
                      $store.state.user.lname.charAt(0).toUpperCase()
                    }}.</v-list-item-title
                  >
                  <v-list-item-subtitle class="white--text"
                    >{{ $store.state.user.usertype.description }} /
                    {{ getMyRole($store.state.user.user.user_roleID) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="menu = false">
                    <v-icon class="white--text">mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item @click="toProfile()">
                <v-list-item-action>
                  <v-icon>mdi-cog-outline</v-icon>
                </v-list-item-action>
                <v-list-item-subtitle
                  ><strong>Profile</strong></v-list-item-subtitle
                >
              </v-list-item>
              <v-list-item @click="logout()">
                <v-list-item-action>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-action>
                <v-list-item-subtitle
                  ><strong>Sign Out </strong></v-list-item-subtitle
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  props: ["screenSmall", "reloadImg"],
  watch: {
    screenSmall: {
      handler(val) {
        this.drawer = val;
        this.mini = false;
      },
    },
    reloadImg: {
      handler() {
        this.loadImg();
      },
    },
    // isOIC: {
    //   handler() {
    //     let userType = this.$store.state.user.user.usertypeID;
    //     let userrole = this.$store.state.user.user.user_roleID;
    //     this.loadMenu(userType, userrole);
    //   },
    // },
  },
  data() {
    return {
      search: "",
      drawer: true,
      mini: false,
      profImg: null,
      mobile: false,
      isActiveOIC: false,
      userRoleList: [],
      links: [],
      userType: null,
      notif_cnt: 0,
      showAllNotifDialog: false,
      interval: null,
      loading: false,
      options: [],
    };
  },

  mounted() {
    // console.log("is OIC", this.isOIC);
    // this.loadUserRoles();
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      // this.render = true;
      this.$router.push("/");

      // location.reload();
    }
    // this.getOICActive();
    this.loadImg();
    // this.getMyNotifs();

    // this.onResize();
    // window.addEventListener("resize", this.onResize, { passive: true });

    if (this.$vuetify.breakpoint.xs) {
      this.drawer = false;
      this.mini = false;
    }
  },

  methods: {
    getMyRole(id) {
      var role;
      for (let i = 0; i < this.userRoleList.length; i++) {
        if (parseInt(this.userRoleList[i].id) == parseInt(id)) {
          role = this.userRoleList[i].description;
        }
      }
      return role;
    },

    openMobileNav() {
      this.drawer = true;
    },
    loadImg() {
      this.axiosCall("/user-details/getUserProfileImg", "GET").then((res) => {
        this.profImg =
          process.env.VUE_APP_SERVER +
          "/user-details/getProfileImg/" +
          res.data.profile_img;
      });
    },
    toProfile() {
      var usertype = this.$store.state.user.usertype.description;
      if (this.$store.state.user.user.user_roleID == 5) {
        this.$router.push("/superadmin/profile");
      } else {
        this.$router.push("/" + usertype.toLowerCase() + "/profile");
      }
    },
    getCurrentDate() {
      const cur_date = new Date();
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return (
        day[cur_date.getDay()] +
        ", " +
        month[cur_date.getMonth()] +
        " " +
        cur_date.getDate() +
        "; " +
        this.formatAMPM(cur_date)
      );
    },
    formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },
    // onResize() {
    //   if (window.innerWidth < 600) {
    //     console.log("triggered");
    //     this.drawer = false;
    //     this.mini = false;
    //   }
    // },
    closeNav() {
      this.drawer = false;

      this.$emit("closeNav");
    },

    getModules(usertypeID) {
      this.axiosCall("/usertype-module/usertype/" + usertypeID, "GET").then(
        (res) => {
          if (res) {
            // this.modules = res.data;
            // console.log(res.data);
          }
        }
      );
    },

    // loadUserRoles() {
    //   this.axiosCall("/user-role/", "GET").then((res) => {
    //     if (res.data) {
    //       // console.log(res.data);
    //       this.userRoleList = res.data;
    //     }
    //   });
    // },

    loadMenu(userType, userRole) {
      this.axiosCall("/assigned-modules/getMyAssignedModules/my", "GET").then(
        (resp) => {
          this.links = JSON.parse(resp.data.assign_mods);
          switch (userType) {
            case 1:
              this.userType = "admin";

              break;
            case 2:
              if (userRole == 5) {
                this.userType = "superadmin";
              } else {
                this.userType = "employee";
              }
              break;
            case 3:
              this.userType = "security";

              break;
            case 4:
              this.userType = "auditor";

              break;
          }
        }
      );

      // if (this.isActiveOIC) {
      //   // this.axiosCall("/assigned-modules/getMyModuleAsOIC", "GET").then(
      //   //   (res) => {
      //   //     console.log("asdasd", res.data.assign_mods);
      //   //     this.links = JSON.parse(res.data.assign_mods);
      //   //     switch (userType) {
      //   //       case 1:
      //   //         this.userType = "admin";

      //   //         break;
      //   //       case 2:
      //   //         if (userRole == 5) {
      //   //           this.userType = "superadmin";
      //   //         } else {
      //   //           this.userType = "employee";
      //   //         }
      //   //         break;
      //   //       case 3:
      //   //         this.userType = "security";

      //   //         break;
      //   //       case 4:
      //   //         this.userType = "auditor";

      //   //         break;
      //   //     }
      //   //   }
      //   // );
      // } else {
      //   // this.axiosCall("/assigned-modules/getMyAssignedModules/my", "GET").then(
      //   //   (res) => {
      //   //     console.log(res);
      //   //     // this.links = JSON.parse(res.data.assign_mods);
      //   //     switch (userType) {
      //   //       case 1:
      //   //         this.userType = "admin";

      //   //         break;
      //   //       case 2:
      //   //         if (userRole == 5) {
      //   //           this.userType = "superadmin";
      //   //         } else {
      //   //           this.userType = "employee";
      //   //         }
      //   //         break;
      //   //       case 3:
      //   //         this.userType = "security";

      //   //         break;
      //   //       case 4:
      //   //         this.userType = "auditor";

      //   //         break;
      //   //     }
      //   //   }
      //   // );
      // }

      // this.axiosCall("/core-time-designation/getMyDesignation", "GET").then(
      //   (res) => {
      //     if (res) {
      //       switch (userType) {
      //         case 1:
      //           this.userType = "admin";
      //           this.links = this.admin_links;
      //           break;
      //         case 2:
      //           this.userType = "employee";
      //           this.links = this.employee_links;

      //           if (res.data.length > 0) {
      //             this.links.splice(this.links.length - 1, 0, {
      //               title: "TO Approval",
      //               icon: "mdi-bus-clock",
      //               route: "/to-approval",
      //             });
      //             this.links.splice(this.links.length - 1, 0, {
      //               title: "LS Approval",
      //               icon: "mdi-text-box-multiple",
      //               route: "/locators",
      //             });
      //           }
      //           break;
      //         case 3:
      //           this.userType = "security";
      //           this.links = this.securityGuard_links;
      //           break;
      //       }
      //     }
      //   }
      // );
    },
  },
  beforeUnmount() {
    // prevent memory leak
    clearInterval(this.interval);
  },

  created: function () {
    // this.getMyAssignedModules();
    let userType = this.$store.state.user.user.usertypeID;

    let userrole = this.$store.state.user.user.user_roleID;
    // this.getMyDesignation();
    this.loadMenu(userType, userrole);

    this.interval = setInterval(() => {
      this.getMyNotifs();
    }, 180000);
  },
};
</script>

<style scoped>
.modal_content {
  padding: 5px 0 5px 0;
}
.modal_header {
  background-color: #e35e93;
  padding: 5px;
}
.notifDiv {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #e35e93;
  color: white;
  flex: auto;
  justify-content: space-between;
}
.showAllNotifDiv {
  position: sticky;
  bottom: 0;
  cursor: pointer;
}
.showAllNotif {
  margin: 0;
  font-size: 12px;
  background-color: #e35e93;
  padding: 10px;
  text-align: center;
  max-height: 55vh;
  color: white;
}
.unopened {
  /* top right bottom left */
  margin: 10px;
  /* border-bottom: 0.5px solid #cbcec7; */
  border-radius: 10px;
  background-color: #e7f6cd;
}
.unopened:hover {
  background-color: #d8ff8f;
}
.opened {
  /* top right bottom left */
  margin: 10px;
  border: 0.5px solid #e6ebe1;
  border-radius: 10px;
}
.opened:hover {
  background-color: #d8ff8f;
}
::v-deep .v-toolbar__content {
  padding: 8px !important;
}
.v-list-item__icon {
  color: white !important;
}
.sidebar .v-list-item {
  border-radius: 5px;
  /* margin-left: 10px; */
  color: white;
}

.notifBadgeYellow {
  background-color: rgba(255, 255, 34, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 3px;
  border-radius: 4px;
  font-size: 10px;
  color: rgb(140, 140, 14);
  margin: 0px 0px 0px 5px;
}

.notifBadgePurple {
  background-color: rgba(255, 138, 255, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 3px;
  border-radius: 4px;
  font-size: 10px;
  color: purple;
  margin: 0px 0px 0px 5px;
}

.notifBadgeBlue {
  background-color: rgba(138, 210, 255, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 3px;
  border-radius: 4px;
  font-size: 10px;
  color: rgb(0, 75, 128);
  margin: 0px 0px 0px 5px;
}

.notifBadgeGreen {
  background-color: rgba(157, 255, 138, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 3px;
  border-radius: 4px;
  font-size: 10px;
  color: rgb(21, 128, 0);
  margin: 0px 0px 0px 5px;
}

.sidebar .v-list-item:hover {
  /* background-color: rgba(255, 247, 247, 0.949);
  color: black; */
  border-radius: 5px;
  transition: 0.5s;
}

.sidebar .v-list-item--active .v-list-item__title {
  color: #3a3b3a !important;
}

.sidebar .v-list-item--active .v-list-item__icon i {
  color: #3a3b3a !important;
}

.v-list-group--active .man {
  color: #3a3b3a !important;
}

.sidebar .v-list-item--active {
  background-color: white !important;
  color: #3a3b3a !important;
}
.sidebar .v-list-group--active {
  background-color: white !important;
  border-radius: 5px;

  color: #3a3b3a !important;
}

.sidebar div .sub-item .v-list-item {
  background-color: white !important;
}

.sidebar div .sub-item .v-list-item .v-list-item__title {
  color: #3a3b3a !important;
}

.sidebar div .sub-item .v-list-item .v-list-item__icon i {
  color: #3a3b3a !important;
}

.sidebar div .sub-item .v-list-item--active {
  background-color: #bcedc8 !important;
  color: #3a3b3a !important;
}

.active_grp {
  background-color: white;
}

.nav-drawer .item-title {
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
}
.v-subheader {
  border-bottom: 1px solid #cdcbd0;
  color: green;
}
.notif_msg {
  font-size: 10px;
}
.v-application--is-ltr
  .v-list--dense.v-list--nav
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding: 0 8;
}
.sub-item {
  border-radius: 5px;
  background: white;
}

.v-list-item__title {
  color: white !important;
}

.v-list-item__icon i {
  color: white !important;
}

/* 
.v-list-group {
  color: white !important;
} */

.v-hover {
  border-color: grey !important;
}
.v-list-group .v-list-group--active {
  color: #3a3b3a !important;
}
::v-deep .v-list-group i {
  color: white !important;
}

::v-deep .v-list-group--active i {
  color: #3a3b3a !important;
}

/* .v-list-group__header__append-icon {
  display: none !important;
} */
</style>
