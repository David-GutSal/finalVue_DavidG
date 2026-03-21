<script setup>
import { ref, computed, watch } from 'vue'
import axiosInstance from '@/plugins/axios'

const props = defineProps({
  marcas: { type: Array, default: () => [] },
  modelos: { type: Array, default: () => [] },
  idMarcaInicial: { type: String, default: '' },
  idModeloInicial: { type: String, default: '' }
})

const emit = defineEmits(['vehiculoGuardado'])

const idMarca = ref(props.idMarcaInicial)
const idModelo = ref(props.idModeloInicial)
const precioDia = ref('')
const puertas = ref(4)
const sillaInfantil = ref(false)
const mensaje = ref('')
const error = ref('')

const bloqueadaMarca = computed(() => {
  return props.idMarcaInicial !== '' && props.idMarcaInicial !== null && props.idMarcaInicial !== undefined
})

const bloqueadoModelo = computed(() => {
  return props.idModeloInicial !== '' && props.idModeloInicial !== null && props.idModeloInicial !== undefined
})

const modelosDeMarca = computed(() => {
  if (!idMarca.value) {
    return []
  }
  return props.modelos.filter((m) => m.idMarca === idMarca.value)
})

watch(
  () => idMarca.value,
  () => {
    if (!bloqueadoModelo.value) {
      idModelo.value = ''
    }
  }
)

async function guardar() {
  error.value = ''
  mensaje.value = ''

  try {
    const nuevoVehiculo = {
      idModelo: idModelo.value,
      precioDia: Number(precioDia.value),
      puertas: Number(puertas.value),
      sillaInfantil: sillaInfantil.value
    }

    const response = await axiosInstance.post('http://localhost:3000/vehiculos', nuevoVehiculo)
    const data = response.data

    mensaje.value = 'Vehículo añadido correctamente'
    emit('vehiculoGuardado', data)
  } catch (e) {
    error.value = 'Error al guardar el vehículo'
  }
}
</script>

<template>
  <div class="card border-primary">
    <div class="card-header bg-primary text-white fw-semibold">
      <i class="bi bi-plus-circle me-2"></i>
      Nuevo Vehículo
    </div>

    <div class="card-body">
      <form @submit.prevent="guardar">
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Marca</label>
            <select
              v-model="idMarca"
              class="form-select"
              :disabled="bloqueadaMarca"
              required
            >
              <option value="">-- Selecciona una marca --</option>
              <option
                v-for="m in marcas"
                :key="m.id"
                :value="m.id"
              >
                {{ m.nombre }}
              </option>
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
              <option
                v-for="m in modelosDeMarca"
                :key="m.id"
                :value="m.id"
              >
                {{ m.modelo }}
              </option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Precio por día (€)</label>
            <input
              v-model="precioDia"
              type="number"
              min="0"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-4">
            <label class="form-label">Puertas</label>
            <input
              v-model="puertas"
              type="number"
              min="2"
              max="5"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-4 d-flex align-items-end">
            <div class="form-check mb-2">
              <input
                v-model="sillaInfantil"
                type="checkbox"
                class="form-check-input"
                id="sillaCheck"
              />
              <label class="form-check-label" for="sillaCheck">
                Silla infantil
              </label>
            </div>
          </div>
        </div>

        <div v-if="mensaje" class="alert alert-success py-2">
          {{ mensaje }}
        </div>

        <div v-if="error" class="alert alert-danger py-2">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary">
          <i class="bi bi-floppy me-1"></i>
          Guardar
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>