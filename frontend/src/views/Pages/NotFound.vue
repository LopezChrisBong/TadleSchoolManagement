<template>
  <v-container fluid class="d-flex align-center justify-center error-bg">
    <v-card
      class="pa-10 text-center error-card"
      elevation="10"
      rounded="xl"
      max-width="520"
    >
      <v-icon size="80" color="pink-darken-2" class="mb-4">
        mdi-alert-circle-outline
      </v-icon>

      <div class="error-code mb-2">404</div>

      <div class="text-h5 font-weight-bold mb-2">Page not found</div>

      <div class="text-body-1 text-grey mb-6">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </div>

      <v-btn
        color="pink-darken-2"
        size="large"
        rounded="xl"
        class="px-8"
        @click="redirectTo"
      >
        <v-icon start>mdi-home</v-icon>
        Back to Home
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  methods: {
    redirectTo() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.error-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #fde2eb, #fce7f3);
}

.error-card {
  backdrop-filter: blur(8px);
}

.error-code {
  font-size: 6rem;
  font-weight: 800;
  color: #e35e93;
  line-height: 1;
}
</style>
