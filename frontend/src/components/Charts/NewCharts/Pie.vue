<template>
  <div class="pa-4">
    <canvas></canvas>
  </div>
</template>
<script>
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.plugins.register(ChartDataLabels);
export default {
  name: "PiePage",
  props: {
    data: Object,
  },
  data() {
    return {
      plugins: {
        datalabels: {
          align: "center",
          anchor: "center",
          color: "grey",
          labels: {
            title: {
              font: {
                weight: "bold",
                size: 10,
              },
            },
          },
          formatter: function (value) {
            if (value > 0) {
              value = value.toString();
              value = value.split(/(?=(?:...)*$)/);
              value = value.join(",");
              return value;
            } else {
              value = "";
              return value;
            }
          },
        },
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        this.render(data.label, data.data);
      },
    },
    deep: true,
  },

  methods: {
    render(label, data) {
      console.log("label", label, "data", data);
      new Chart(this.$el.getElementsByTagName("canvas"), {
        type: "pie",
        data: {
          labels: label,
          datasets: [
            {
              label: "# of Votes",
              data: data,
              backgroundColor: [
                "#FDB147",
                "#17C800",
                "#20C745",
                "#FC7300",
                "#F8B102",
              ],
              borderColor: [
                "#FDB147",
                "#17C800",
                "#20C745",
                "#FC7300",
                "#F8B102",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          legend: { display: false },

          plugins: this.plugins,
        },
      });
    },
  },
};
</script>
