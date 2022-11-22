<template>
  <div class="search">
    <input v-model="search" placeholder="Search..." />
  </div>

  <div class="craftbook">
    <div
      v-for="item in items"
      :key="item.id"
      @click="openCraftbookModal(item.id)"
    >
      <ItemName :item-id="item.id" />
      <ItemPortrait :item-id="item.id" size="3.5rem" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { computed, ref } from 'vue'
import openCraftbookModal from '@/components/modals/openCraftbookModal'
import searchFilterItemMatches from '@/utils/searchFilterItemMatches'
import ItemPortrait from '@/components/ItemPortrait.vue'
import ItemName from '@/components/ItemName.vue'

const search = ref('')

const gameStore = useGameStore()
const items = computed(() =>
  gameStore.items.filter((x) => searchFilterItemMatches(search.value, x.id))
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

.craftbook {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}
.craftbook > div {
  width: 8rem;
  height: 8rem;
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-color: var(--color-background-soft);
  cursor: pointer;
}
</style>
