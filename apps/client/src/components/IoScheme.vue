<script setup lang="ts"></script>

<template>
  <div class="io-scheme">
    <div>
      <slot name="input" />
    </div>
    <div class="symbol-next">
      <slot name="middle">></slot>
    </div>
    <div>
      <slot name="output" />
    </div>
  </div>
</template>

<style scoped>
.io-scheme {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.io-scheme .symbol-next {
  flex-grow: 0;
}
</style>
