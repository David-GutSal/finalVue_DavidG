<script setup>

</script>

<template>
  <nav class="d-flex flex-column bg-dark text-white">
    <div class="text-center p-3 border-bottom border-secondary">
      <i class="bi bi-car-front-fill text-primary"></i>
      <div class="fw-bold mt-1 fs-5">RentingCar</div>
    </div>
    <ul class="nav flex-column p-2 gap-1">
      <li class="nav-item">
        <RouterLink class="nav-link text-white" to="/">
          <i class="bi bi-house me-2"></i>Inicio
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link text-white" to="/marcas">
          <i class="bi bi-bookmark me-2"></i>Marcas
        </RouterLink>
      </li>
      <li class="nav-item ps-3">
        <RouterLink class="nav-link text-white-50 small" to="/marca/nueva">
          <i class="bi bi-plus-circle me-1"></i>Nueva Marca
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link text-white" to="/modelos">
          <i class="bi bi-list-ul me-2"></i>Modelos
        </RouterLink>
      </li>
      <li class="nav-item ps-3">
        <RouterLink class="nav-link text-white-50 small" to="/modelo/nuevo">
          <i class="bi bi-plus-circle me-1"></i>Nuevo Modelo
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link text-white" to="/vehiculos">
          <i class="bi bi-truck me-2"></i>Vehículos
        </RouterLink>
      </li>
      <li class="nav-item ps-3">
        <RouterLink class="nav-link text-white-50 small" to="/vehiculo/nuevo">
          <i class="bi bi-plus-circle me-1"></i>Nuevo Vehículo
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link text-white" to="/alquiler">
          <i class="bi bi-key me-2"></i>Alquiler
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link text-white" to="/clientes">
          <i class="bi bi-people me-2"></i>Clientes
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.bi-car-front-fill{
  font-size: 2.5rem;
}
nav{
  min-width:210px; 
  min-height:100vh;
}
</style>
