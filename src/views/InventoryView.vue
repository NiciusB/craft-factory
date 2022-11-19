<template>
  <input v-model="search" placeholder="Search..." />
  <div class="inventory">
    <div
      v-for="invItem in inventory"
      :key="invItem.item"
      @click="openCraftbookModal(invItem.item)"
    >
      {{ invItem.item }}
      <div class="badge">{{ invItem.qty }}</div>
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
const inventory = computed(() =>
  gameStore.inventory.filter((x) =>
    searchFilterItemMatches(search.value, x.item)
  )
)
</script>

<style>
.inventory {
  display: grid;
  grid-template: repeat(5, 1fr) / repeat(8, 1fr);
  gap: 1rem;
  padding: 1rem;
}
.inventory > div {
  position: relative;
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-soft);
  cursor: pointer;
}
.inventory > div .badge {
  position: absolute;
  top: -9px;
  right: -9px;
  border-radius: 10px;
  padding: 0.25rem 0.5rem;
  background-color: var(--color-brand);
  color: var(--color-background);
  text-shadow: 0 0 1px var(--color-text);
}
</style>
