<template>
  <div class="search">
    <input v-model="search" placeholder="Search..." />
  </div>

  <div class="inventory">
    <ItemRow
      v-for="invItem in inventory"
      :key="invItem.item"
      :item-id="invItem.item"
      @click="openCraftbookModal(invItem.item, 'uses')"
    >
      <template #amount>{{ numberToHuman(invItem.qty) }}</template>
    </ItemRow>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { computed, ref } from 'vue'
import openCraftbookModal from '@/components/modals/openCraftbookModal'
import searchFilterItemMatches from '@/utils/searchFilterItemMatches'
import numberToHuman from '@/utils/numberToHuman'
import ItemRow from '@/components/ItemRow.vue'

const search = ref('')

const gameStore = useGameStore()
const inventory = computed(() =>
  Array.from(gameStore.inventory.entries())
    .map((entry) => ({
      item: entry[0],
      qty: entry[1],
    }))
    .filter((x) => searchFilterItemMatches(search.value, x.item))
)
</script>

<style>
.search {
  margin-bottom: 0.5rem;
  position: sticky;
  top: 0;
}
.search input {
  width: 100%;
  height: 2rem;
}
.inventory > div {
  border-bottom: 1px solid var(--color-border-hover);
  background-color: var(--color-background-soft);
  cursor: pointer;
  padding: 0.5rem 0.75rem;
}
</style>
