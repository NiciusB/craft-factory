<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import openCraftbookModal from '@/components/modals/openCraftbookModal'
import IoScheme from '@/components/IoScheme.vue'
import ItemName from '@/components/ItemName.vue'
import ItemPortrait from '@/components/ItemPortrait.vue'

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
          {{ rin.qty }}x
          <ItemName v-if="'item' in rin" :item-id="rin.item" />
          <ItemPortrait v-if="'item' in rin" :item-id="rin.item" />
          <span v-else-if="'tag' in rin">
            {{ rin.tag }}
          </span>
        </div>
      </template>
      <template #output>
        <div
          class="item"
          v-for="(rout, index) in recipe.out"
          :key="index"
          @click="'item' in rout && openCraftbookModal(rout.item, 'uses')"
        >
          {{ rout.qty }}x
          <ItemName :item-id="rout.item" />
          <ItemPortrait :item-id="rout.item" />
          {{ rout.chance !== 100 ? `(${rout.chance}% chance)` : '' }}
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
.item:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
