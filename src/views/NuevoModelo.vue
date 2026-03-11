<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'

const marcas = ref([])
const idMarca = ref('')
const modelo = ref('')
const extraPorModelo = ref(null)
const error = ref('')

const guardar = async () => {
  error.value = ''
  try {
    const nuevoModelo = {
      idMarca: idMarca.value,
      modelo: modelo.value,
      ...(extraPorModelo.value > 0 && { extraPorModelo: Number(extraPorModelo.value) })
    }
    await axiosInstance.post('/modelos', nuevoModelo)
    idMarca.value = ''
    modelo.value = ''
    extraPorModelo.value = null
  } catch (e) {
    error.value = 'Error al guardar el modelo'
  }
}

onMounted(async () => {
  const { data } = await axiosInstance.get('/marcas')
  marcas.value = data
})
</script>

<template>
  <div>
    <h3 class="mb-4">Nuevo Modelo</h3>
    <form @submit.prevent="guardar">
      <div class="mb-3">
        <label class="form-label">Marca</label>
        <select v-model="idMarca" class="form-select" required>
          <option value="">-- Selecciona una marca --</option>
          <option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nombre }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Nombre del modelo</label>
        <input v-model="modelo" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">
          Extra por modelo (€)
          <span class="text-muted small">(opcional)</span>
        </label>
        <input v-model="extraPorModelo" type="number" min="0" class="form-control" placeholder="0" />
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
