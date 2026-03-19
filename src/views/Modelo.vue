<script setup>
import { ref, computed, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'

const marcas = ref([])
const modelos = ref([])
const vehiculos = ref([])
const idMarcaSeleccionada = ref('')
const extrasTemp = ref({})

onMounted(async () => {
  const [rMarcas, rModelos, rVehiculos] = await Promise.all([
    axiosInstance.get('http://localhost:3000/marcas'),
    axiosInstance.get('http://localhost:3000/modelos'),
    axiosInstance.get('http://localhost:3000/vehiculos')
  ])
  marcas.value = rMarcas.data
  modelos.value = rModelos.data
  vehiculos.value = rVehiculos.data
})

const modelosDeMarca = computed(() => {
  if (!idMarcaSeleccionada.value) return []
  return modelos.value.filter(m => m.idMarca === idMarcaSeleccionada.value)
})

function getPrecioMedio(idModelo) {
  const vehiculosDelModelo = vehiculos.value.filter(vehiculo => vehiculo.idModelo === idModelo)
  if (!vehiculosDelModelo.length) return 0
  const suma = vehiculosDelModelo.reduce((acc, v) => acc + v.precioDia, 0)
  return suma / vehiculosDelModelo.length
}

function tieneExtra(modelo) {
  return modelo.extraPorModelo && modelo.extraPorModelo > 0
}

async function guardarExtra(modelo) {
  const extra = extrasTemp.value[modelo.id]
  if (extra === undefined || extra === null || extra === '') return

  const modeloActualizado = { ...modelo, extraPorModelo: Number(extra) }

  await axiosInstance.put(`http://localhost:3000/modelos/${modelo.id}`, modeloActualizado)

  const index = modelos.value.findIndex(m => m.id === modelo.id)
  if (index !== -1) modelos.value[index] = modeloActualizado

  delete extrasTemp.value[modelo.id]
}
</script>

<template>
  <div>
    <h3 class="mb-4">Modelos</h3>
    <div class="d-flex justify-content-center mb-4">
      <select v-model="idMarcaSeleccionada" class="form-select w-50">
        <option value="">-- Selecciona una marca --</option>
        <option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nombre }}</option>
      </select>
    </div>
    <div v-if="idMarcaSeleccionada">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>Modelo</th>
            <th>Precio medio/día</th>
            <th>Extra por modelo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="modelo in modelosDeMarca" :key="modelo.id">
            <td>{{ modelo.modelo }}</td>
            <td>{{ getPrecioMedio(modelo.id).toFixed(2) }}€/día</td>
            <td>
              <!-- Tiene extra: se muestra el valor -->
              <span v-if="tieneExtra(modelo)">
                {{ modelo.extraPorModelo }}€
              </span>
              <div v-else class="d-flex gap-2 align-items-center">
                <input
                  v-model.number="extrasTemp[modelo.id]"
                  type="number"
                  min="0"
                  class="form-control form-control-sm"
                  style="width: 90px;"
                  placeholder="0"
                />
                <button
                  class="btn btn-sm btn-success"
                  @click="guardarExtra(modelo)"
                >
                  <i class="bi bi-check-lg"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!modelosDeMarca.length">
            <td colspan="3" class="text-center text-muted">
              No hay modelos para esta marca
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
</style>