<template>
  <input v-model="search" placeholder="Search..." />
  <div class="craftbook">
    <div
      v-for="item in items"
      :key="item.id"
      @click="openCraftbookModal(item.id)"
    >
      {{ item.id }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { computed, ref } from 'vue'
import openCraftbookModal from '@/components/modals/openCraftbookModal'
import searchFilterItemMatches from '@/utils/searchFilterItemMatches'

const search = ref('')

const gameStore = useGameStore()
const items = computed(() =>
  gameStore.items.filter((x) => searchFilterItemMatches(search.value, x.id))
)
</script>

<style>
.craftbook {
  display: grid;
  grid-template: repeat(5, 1fr) / repeat(8, 1fr);
  gap: 1rem;
  padding: 1rem;
}
.craftbook > div {
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-soft);
  cursor: pointer;
}
</style>
