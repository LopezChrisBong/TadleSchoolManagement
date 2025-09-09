<script>
import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: {
    chartType: null,
  },
  data() {
    return {
      data: null,
    };
  },
  methods: {
    renderGraph(totalWorks, subWorks) {
      let bgColor = ["#239FAB", "#E4E8EF"];
      let label = [];
      if (this.chartType == 1) {
        bgColor = ["#239FAB", "#E4E8EF"];
        label = ["Scheduled Works", "All Works"];
      } else if (this.chartType == 2) {
        bgColor = ["#FD8539", "#E4E8EF"];
        label = ["Dispatched Works", "All Works"];
      } else if (this.chartType == 3) {
        bgColor = ["#FE6D8E", "#E4E8EF"];
        label = ["Cancelled Works", "All Works"];
      } else if (this.chartType == 4) {
        bgColor = ["#2ED480", "#E4E8EF"];
        label = ["Completed Works", "All Works"];
      }
      this.renderChart(
        {
          labels: label,
          datasets: [
            {
              backgroundColor: bgColor,
              data: [subWorks, totalWorks],
            },
          ],
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
        }
      );
    },
  },
};
</script>