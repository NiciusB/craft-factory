<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
})

const item = computed(() => gameStore.getItem(props.itemId))
</script>

<template>
  <span class="item-name">
    {{ item.name[0].value }}
  </span>
</template>

<style scoped>
.item-name {
  text-align: center;
  font-weight: 500;
}
</style>
