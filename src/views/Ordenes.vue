<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="layout">
      <BarraLateral/>
      <div class="contenido-principal">
        <h1>Pagina para las ordenes</h1>
        <!-- Aquí irá el resto de tu contenido -->
      </div>
    </div>
  </template>

<script>
import axios from 'axios';
import BarraLateral from "../components/BarraLateral.vue";
  
export default {
  components: {
    BarraLateral,
  },
  data() {
    return {
      ordenes: [],
    };
  },
  methods: {
    async listarordenes() {
      try {
        const response = await axios.get('ordenes/list');
        this.ordenes = response.data;
        console.log(this.ordenes)
      } catch (error) {
        console.error('Hubo un error al obtener los datos:', error);
      }
    },
  },
  mounted() {
    this.listarordenes();
  },
};
</script>