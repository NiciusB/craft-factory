<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import openCraftbookModal from '@/components/modals/openCraftbookModal'

const gameStore = useGameStore()

const props = defineProps({
  recipeId: {
    type: String,
    required: true,
  },
})

const recipe = gameStore.getRecipe(props.recipeId)
</script>

<template>
  <div class="recipe">
    <div>Process: {{ recipe.process }}</div>
    <div>{{ recipe.processingTicks }} ticks</div>
    <div class="io-scheme">
      <div>
        <div
          class="item"
          v-for="(rin, index) in recipe.in"
          :key="index"
          @click="rin.item && openCraftbookModal(rin.item, 'crafting')"
        >
          {{ `${rin.qty}x ${rin.item ?? rin.tag}` }}
        </div>
      </div>
      <div class="symbol-next">></div>
      <div>
        <div
          class="item"
          v-for="(rout, index) in recipe.out"
          :key="index"
          @click="rout.item && openCraftbookModal(rout.item, 'uses')"
        >
          {{ `${rout.qty}x ${rout.item}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe {
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  background-color: var(--color-background-soft);
  padding: 1rem;
}
.io-scheme {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}
.io-scheme .symbol-next {
  flex-grow: 0;
  padding: 1rem;
}
.io-scheme .item {
  cursor: pointer;
}
</style>
