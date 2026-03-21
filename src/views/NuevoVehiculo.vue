<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/plugins/axios'

const route = useRoute()
const router = useRouter()

const marcas = ref([])
const modelos = ref([])

const idMarcaInicial = route.query.idMarca || ''
const idModeloInicial = route.query.idModelo || ''

const idMarca = ref(idMarcaInicial)
const idModelo = ref(idModeloInicial)
const precioDia = ref('')
const puertas = ref(4)
const sillaInfantil = ref(false)
const mensaje = ref('')
const error = ref('')

const bloqueadaMarca = computed(() => !!idMarcaInicial)
const bloqueadoModelo = computed(() => !!idModeloInicial)

onMounted(async () => {
  const [rMarcas, rModelos] = await Promise.all([
    axiosInstance.get('http://localhost:3000/marcas'),
    axiosInstance.get('http://localhost:3000/modelos'),
  ])
  marcas.value = rMarcas.data
  modelos.value = rModelos.data
})

const modelosDeMarca = computed(() => {
  if (!idMarca.value) return []
  return modelos.value.filter((m) => m.idMarca === idMarca.value)
})

watch(idMarca, () => {
  if (!bloqueadoModelo.value) idModelo.value = ''
})

async function guardar() {
  error.value = ''
  mensaje.value = ''
  try {
    await axiosInstance.post('http://localhost:3000/vehiculos', {
      idModelo: idModelo.value,
      precioDia: Number(precioDia.value),
      puertas: Number(puertas.value),
      sillaInfantil: sillaInfantil.value,
    })
    mensaje.value = 'Vehículo añadido correctamente'
    setTimeout(() => router.push('/vehiculos'), 1500)
  } catch (e) {
    error.value = 'Error al guardar el vehículo'
  }
}
</script>

<template>
  <div>
    <h3 class="mb-4">Nuevo Vehículo</h3>

    <div v-if="bloqueadaMarca" class="alert alert-info py-2 mb-4">
      <i class="bi bi-info-circle me-2"></i>
      Marca y modelo preseleccionados desde el listado de vehículos.
    </div>

    <form @submit.prevent="guardar" style="max-width: 560px">
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Marca</label>
          <select v-model="idMarca" class="form-select" :disabled="bloqueadaMarca" required>
            <option value="">-- Selecciona una marca --</option>
            <option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nombre }}</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Modelo</label>
          <select
            v-model="idModelo"
            class="form-select"
            :disabled="bloqueadoModelo || !idMarca"
            required
          >
            <option value="">-- Selecciona un modelo --</option>
            <option v-for="m in modelosDeMarca" :key="m.id" :value="m.id">{{ m.modelo }}</option>
          </select>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <label class="form-label">Precio por día (€)</label>
          <input v-model="precioDia" type="number" min="0" class="form-control" required />
        </div>
        <div class="col-md-4">
          <label class="form-label">Puertas</label>
          <input v-model="puertas" type="number" min="2" max="5" class="form-control" required />
        </div>
        <div class="col-md-4 d-flex align-items-end pb-1">
          <div class="form-check">
            <input
              v-model="sillaInfantil"
              type="checkbox"
              class="form-check-input"
              id="sillaCheck"
            />
            <label class="form-check-label" for="sillaCheck">Silla infantil</label>
          </div>
        </div>
      </div>

      <div v-if="mensaje" class="alert alert-success py-2">{{ mensaje }}</div>
      <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">
          <i class="bi bi-floppy me-1"></i> Guardar
        </button>
        <button type="button" class="btn btn-secondary" @click="router.push('/vehiculos')">
          <i class="bi bi-arrow-left me-1"></i> Volver
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
