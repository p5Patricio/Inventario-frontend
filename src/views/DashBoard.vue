<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="layout">
      <BarraLateral/>
      <div class="contenido-principal">
        <h1>Pagina para el dashboard</h1>
        <!-- Aquí irá el resto de tu contenido -->
      </div>
    </div>
  </template>

<script>
//import axios from 'axios';
import BarraLateral from "../components/BarraLateral.vue";
  
export default {
  components: {
    BarraLateral,
  },
  data() {
    return {
      
    };
  },
  methods: {
    
  },
  mounted() {
    
  },
};
</script>