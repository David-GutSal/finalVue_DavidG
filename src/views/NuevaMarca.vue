<script setup>
import { ref } from 'vue'
import axiosInstance from '@/plugins/axios'

const nombre = ref('')
const anioFundacion = ref('')
const origen = ref('')
const error = ref('')

const guardar = async () => {
  error.value = ''
  try {
    await axiosInstance.post('/marcas', {
      nombre: nombre.value,
      origen: origen.value,
      anioFundacion: Number(anioFundacion.value)
    })
    nombre.value = ''
    anioFundacion.value = ''
    origen.value = ''
  } catch (e) {
    error.value = 'Error al guardar la marca'
  }
}
</script>

<template>
  <div>
    <h3 class="mb-4">Nueva Marca</h3>
    <form @submit.prevent="guardar">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input v-model="nombre" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Año de fundación</label>
        <input v-model="anioFundacion" type="number" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">País de origen</label>
        <input v-model="origen" type="text" class="form-control" required />
      </div>
      <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
      <button type="submit" class="btn btn-primary">
        <i class="bi bi-floppy me-1"></i> Guardar
      </button>
    </form>
  </div>
</template>

<style scoped>
form{
    width: 480px;
}
</style>
