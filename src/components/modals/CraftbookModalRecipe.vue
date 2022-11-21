<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import openCraftbookModal from '@/components/modals/openCraftbookModal'
import IoScheme from '@/components/IoScheme.vue'

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
    <div>{{ recipe.processingSeconds }} seconds</div>
    <IoScheme>
      <template #input>
        <div
          class="item"
          v-for="(rin, index) in recipe.in"
          :key="index"
          @click="'item' in rin && openCraftbookModal(rin.item, 'crafting')"
        >
          {{
            `${rin.qty}x ${
              'item' in rin ? rin.item : 'tag' in rin ? rin.tag : ''
            }`
          }}
        </div>
      </template>
      <template #output>
        <div
          class="item"
          v-for="(rout, index) in recipe.out"
          :key="index"
          @click="'item' in rout && openCraftbookModal(rout.item, 'uses')"
        >
          {{
            `${rout.qty}x ${rout.item} ${
              rout.chance !== 100 ? `(${rout.chance}% chance)` : ''
            }`
          }}
        </div>
      </template>
    </IoScheme>
  </div>
</template>

<style scoped>
.recipe {
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  background-color: var(--color-background-soft);
  padding: 1rem;
}
.item {
  cursor: pointer;
}
</style>
