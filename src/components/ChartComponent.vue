<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables); // Registrar todos los componentes de Chart.js
  
  export default {
    name: "ChartComponent",
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      chartOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    mounted() {
      this.createChart();
    },
    methods: {
      createChart() {
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new Chart(this.$refs.chartCanvas, {
          type: this.chartData.type,
          data: this.chartData.data,
          options: this.chartOptions,
        });
      },
    },
    beforeUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
  };
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    height: auto;
  }
  </style>
  