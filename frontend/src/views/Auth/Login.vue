<template>
  <div>
    <v-container fluid class="auth-container">
      <div
        class="auth-wrapper"
        :class="isSmAndUp ? { 'right-panel-active': !isLogin } : {}"
      >
        <!-- Sign In Form -->
        <div class="form-container sign-in-container">
          <v-card class="form-card" elevation="10">
            <h2 class="text-center mb-4">Sign In</h2>
            <v-form ref="formLogin">
              <v-text-field
                v-model="emailLogin"
                :rules="[formRules.required, formRules.email]"
                label="Email address"
                prepend-inner-icon="mdi-email"
                outlined
                @keyup.enter="dologin()"
                dense
                class="mb-3"
              />
              <v-text-field
                v-model="passwordLogin"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                prepend-inner-icon="mdi-lock"
                @keyup.enter="dologin()"
                outlined
                dense
                class="mb-5"
              />
              <v-btn color="primary" block @click="dologin()">Sign In</v-btn>
              <div class="mt-4 text-caption d-flex" v-if="!isSmAndUp">
                <p>Don't have an account yet?</p>
                <a class="text-green" @click="mobileChange()">Sign Up</a>
              </div>
            </v-form>
          </v-card>
        </div>

        <!-- Sign Up Form -->
        <div class="form-container sign-up-container">
          <v-card class="form-card" elevation="10">
            <h2 class="text-center mb-4">Create Account</h2>
            <p class="text-caption text-gray-100">
              Step {{ step.id }} of 2 - {{ step.name }}
            </p>
            <v-form ref="formInformation" v-show="step.id == 1">
              <v-text-field
                v-model="fname"
                label="First Name"
                prepend-inner-icon="mdi-account"
                :rules="[formRules.required]"
                outlined
                dense
                class="mb-3"
              />
              <v-text-field
                v-model="mname"
                label="Middle Name"
                prepend-inner-icon="mdi-account"
                outlined
                class="mb-3"
              />
              <v-text-field
                v-model="lname"
                label="Last Name"
                prepend-inner-icon="mdi-account"
                :rules="[formRules.required]"
                outlined
                dense
                class="mb-3"
              />
              <v-btn color="primary" block @click="next()" class="mb-2"
                >Next</v-btn
              >
              <div class="mt-4 text-caption d-flex" v-if="!isSmAndUp">
                <p>Already have an account?</p>
                <a class="text-green" @click="mobileChange()">Sign In</a>
              </div>
            </v-form>
            <v-form ref="formRegister" v-show="step.id == 2">
              <!-- <v-text-field
                v-model="name"
                label="Name"
                prepend-inner-icon="mdi-account"
                outlined
                dense
                class="mb-3"
              /> -->
              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email"
                :rules="[formRules.required, formRules.email]"
                @change="checkEmail()"
                :error-messages="emailError"
                outlined
                dense
                class="mb-3"
              />
              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :rules="[formRules.required, formRules.password]"
                prepend-inner-icon="mdi-lock"
                outlined
                dense
                class="mb-5"
              />
              <v-text-field
                class="font-size-14"
                outlined
                color="#93CB5B"
                dense
                v-model="confirmPassword"
                :rules="[
                  formRules.required,
                  formRules.confirmPassword(confirmPassword, password),
                ]"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :append-inner-icon="
                  showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'
                "
                @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
                prepend-inner-icon="mdi-lock"
                label="Confirm Password"
              ></v-text-field>
              <v-btn color="primary" block @click="register()" class="mb-2"
                >Sign Up</v-btn
              >
              <!-- <v-btn
                variant="outlined"
                block
                color="primary"
                @click="mobileChange()"
                v-if="!isSmAndUp"
                >Sign In</v-btn
              > -->
              <div class="mt-4 text-caption d-flex" v-if="!isSmAndUp">
                <p>Already have an account?</p>
                <a class="text-green" @click="mobileChange()">Sign In</a>
              </div>
            </v-form>
          </v-card>
        </div>

        <!-- Overlay Panel -->
        <div class="overlay-container" v-if="isSmAndUp">
          <div class="overlay">
            <div class="overlay-panel overlay-center">
              <h2>
                Hello
                {{ userType == 0 ? "Parents/Guardians" : "Admin/Teachers" }}!
              </h2>
              <p>To stay connected, sign in with your credentials.</p>
              <p class="mt-4">Already have an account? Click Sign In</p>
              <v-btn
                variant="outlined"
                class="font-weight-bold"
                color="white"
                @click="isLogin = true"
                >Sign In</v-btn
              >
            </div>
            <div class="overlay-panel overlay-right">
              <h2>
                Welcome
                {{ userType == 0 ? "Parents/Guardians" : "Admin/Teachers" }}!
              </h2>
              <p>Enter your details and start your journey with us!</p>
              <p class="mt-4">Don't have an account yet? Click Sign Up</p>
              <v-btn
                variant="outlined"
                color="white"
                class="font-weight-bold"
                @click="isLogin = false"
                >Sign Up</v-btn
              >
            </div>
          </div>
        </div>
      </div>
    </v-container>
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
import { useDisplay } from "vuetify";
export default {
  name: "loginPage",
  data() {
    return {
      display: useDisplay(),
      isLogin: true,
      mobile: true,
      showPassword: false,
      showPasswordConfirm: false,
      step: { id: 1, name: "Personal Information" },
      fname: null,
      lname: null,
      mname: null,
      name: "",
      email: "",
      emailLogin: "",
      passwordLogin: "",
      password: "",
      emailError: "",
      confirmPassword: "",
      userType: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  computed: {
    isSmAndUp() {
      return this.display.smAndUp;
    },
  },
  mounted() {
    // this.initialize();
    this.userType = localStorage.getItem("userType");
  },
  methods: {
    mobileChange() {
      if (this.mobile == true) {
        this.mobile = false;
        const signUp = document.querySelector(".sign-up-container");
        const signIn = document.querySelector(".sign-in-container");
        if (signUp) {
          signUp.style.zIndex = "1";
          signUp.style.opacity = "100%";
          signIn.style.zIndex = "0";
          signIn.style.opacity = "0";
        }
      } else if (this.mobile == false) {
        this.mobile = true;
        const signUp = document.querySelector(".sign-up-container");
        const signIn = document.querySelector(".sign-in-container");
        if (signIn) {
          signUp.style.zIndex = "0";
          signUp.style.opacity = "0";
          signIn.style.zIndex = "1";
          signIn.style.opacity = "100%";
        }
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    dologin() {
      if (this.$refs.formLogin.validate()) {
        this.isLoading = true;
        let data = {
          email: this.emailLogin,
          password: this.passwordLogin,
        };
        this.axiosCall("/auth/login", "POST", data).then((res) => {
          this.isLoading = false;
          if (
            res.data.status == 200 ||
            res.data.status == 201 ||
            res.data.status == 202
          ) {
            // console.log(res.data);
            localStorage.setItem("token", res.data.token);
            this.$store.commit("setExpiryDate");
            location.reload();
            // setTimeout(() => {
            //   axios({
            //     method: "GET",
            //     url: process.env.VUE_APP_SERVER + "/employee/my-details",

            //     headers: { Authorization: `Bearer ${res.data.token}` },
            //   }).then((resp) => {
            //     this.$store.dispatch("setEmp", resp.data);
            // }, 500);
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = res.data.message;
            this.fadeAwayMessage.header = "System Message";
          }
        });
      }
    },

    register() {
      // registration logic here
      if (this.password != this.confirmPassword) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.message = "Password not mutch";
        this.fadeAwayMessage.header = "System Message";
      } else {
        if (this.$refs.formRegister.validate()) {
          let data = {
            fname: this.fname,
            mname: this.mname,
            lname: this.lname,
            user_roleID: this.userType == 0 ? 3 : 2,
            isAdminApproved: this.userType == 0 ? 0 : 0,
            usertypeID: 2,
            email: this.email,
            password: this.password,
          };
          this.axiosCall("/auth/registerUser", "POST", data).then((res) => {
            if (res.data.status == 201) {
              this.isLoading = false;
              this.$store.dispatch("setEmail", this.email);
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.message = "Successfully Registered!";
              this.fadeAwayMessage.header = "System Message";
              this.isLogin = true;
              this.refresh();
              // this.$router.push("/login");
            } else {
              this.isLoading = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.message = res.data.message;
              this.fadeAwayMessage.header = "System Message";
              this.animated = true;
            }
          });
        }
      }
    },

    checkEmail() {
      this.emailChecking = true;
      this.axiosCall("/auth/checkEmailIfExist/" + this.email, "GET").then(
        (res) => {
          console.log(res.data);
          if (res.data) {
            this.emailError = "Email Already Exist!";
          } else {
            this.emailError = "";
          }
          this.emailChecking = false;
        }
      );
    },
    refresh() {
      this.lname = null;
      this.fname = null;
      this.mname = null;
      this.email = null;
      this.password = null;
    },
    next() {
      if (this.step.id == 1) {
        if (this.$refs.formInformation.validate()) {
          if (this.fname == null || this.lname == null) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = "Please fill-up required fields!";
            this.fadeAwayMessage.header = "System Message";
          } else {
            this.step = { id: 2, name: "Account Information" };
          }
        }
      }
      //  else if (this.step.id == 2) {
      //   if (this.$refs.Step2Formref.validate()) {
      //     this.step = { id: 3, name: "Account Information" };
      //   }
      // }
      //  else if (this.step.id == 3) {
      //   if (this.$refs.Step3Formref.validate()) {
      //     this.step = { id: 4, name: "Otp Confirmation" };
      //   }
      // }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0cad9, #bb73a9);
  /* background: linear-gradient(135deg, #20bfa9, #178ca6); */
}

.auth-wrapper {
  background: #fff;
  width: 900px;
  max-width: 100%;
  min-height: 600px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  transition: all 0.6s ease-in-out;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  z-index: 1;
}
@media (min-width: 768px) {
  .form-container {
    width: 50%;
    padding: none;
  }
  .auth-wrapper {
    min-height: 500px;
  }
  /* .sign-up-container {
    left: 0;
    opacity: 0;
    z-index: 0;
  } */
}

.sign-in-container {
  left: 0;
}
.sign-up-container {
  left: 0;
  opacity: 0;
  z-index: 0;
}

.auth-wrapper.right-panel-active .sign-in-container {
  transform: translateX(100%);
  opacity: 0;
}

.auth-wrapper.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

.form-card {
  width: 360px;
  padding: 40px;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  z-index: 100;
}

.overlay {
  /* background: linear-gradient(135deg, #20bfa9, #178ca6); */
  background: linear-gradient(135deg, #e0cad9, #bb73a9);
  color: white;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: all 0.6s ease-in-out;
  display: flex;
}

.auth-wrapper.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.auth-wrapper.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  width: 50%;
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.overlay-left {
  transform: translateX(-20%);
}

.overlay-right {
  transform: translateX(0);
}
</style>
