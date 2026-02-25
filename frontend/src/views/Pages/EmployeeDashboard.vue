<template>
  <div>
    <!-- Employee Dashboard -->
    <div v-if="user_roleID != 3">
      <TeacherDashboard />
    </div>
    <!-- Parent Dashboard -->
    <div v-else><ParentDashboard /></div>
  </div>
</template>

<script>
import ParentDashboard from './ParentDashboard.vue';
import TeacherDashboard from './TeacherDashboard.vue';

export default {
  components: { ParentDashboard, TeacherDashboard },
  data() {
    return {
      user_roleID: null,
    };
  },
  mounted() {
    this.user_roleID = this.$store.state.user.user.user_roleID;
    console.log('USer', this.$store.state.user.user.user_roleID);
  },
  methods: {},
};
</script>
