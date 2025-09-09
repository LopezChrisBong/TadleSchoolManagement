<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  mounted() {
    this.renderChart(
      {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "# of Votes",
            data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15],
            borderColor: "pink",
          },
          {
            label: "# of Points",
            data: [8, 9, 9, 10, 10, 10, 11, 12, 15, 15, 16],
            borderColor: "orange",
            // xAxisID: "x2", // Match dataset to other axis
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "My Data",
        },
        scales: {
          xAxes: [
            {
              type: "category",
              labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
              id: "x",
              display: true, // Set to false to hide the axis
            },
            // {
            //   type: "category",
            //   labels: [54, 64, 74, 84, 94, 104, 114, 124, 134, 144, 154],
            //   id: "x2",
            //   display: true, // Set to false to hide the axis
            // },
          ],
        },
      }
    );
  },
};
</script>
