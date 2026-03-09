<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { RouterView } from 'vue-router'


</script>


<template>
  <div class="container-fluid">
    <div class="d-flex">
      <NavMenu />
      <div class="flex-grow-1 p-4 bg-light">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
