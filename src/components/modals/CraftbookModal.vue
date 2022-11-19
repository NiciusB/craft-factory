<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import CraftbookModalRecipe from '@/components/modals/CraftbookModalRecipe.vue'
import assertItemIsMachine from '@/utils/assertItemIsMachine'
const gameStore = useGameStore()

const tab = ref<'uses' | 'crafting' | 'machineRecipes'>('crafting')
const itemId = ref<Game.ItemId>()
function onBeforeOpen(event: any) {
  itemId.value = event.ref.params.value.itemId
  tab.value = event.ref.params.value.tab ?? 'crafting'
}

const item = computed(() =>
  itemId.value ? gameStore.getItem(itemId.value) : undefined
)
const isMachine = computed(() => item.value?.tags?.includes('core:machine'))

const recipes = computed(() => {
  switch (tab.value) {
    case 'uses': {
      return gameStore.recipes.filter((recipe) =>
        recipe.in.some(
          (rin) =>
            ('item' in rin && rin.item === itemId.value) ||
            ('tag' in rin && item.value?.tags?.includes(rin.tag))
        )
      )
    }
    case 'crafting': {
      return gameStore.recipes.filter((recipe) =>
        recipe.out.some((out) => out.item === itemId.value)
      )
    }
    case 'machineRecipes': {
      const itemValue = item.value
      assertItemIsMachine(itemValue)
      return gameStore.recipes.filter((recipe) =>
        itemValue.processes.includes(recipe.process)
      )
    }
    default:
      throw new Error(`Unknown tab ${tab.value}`)
  }
})
</script>

<template>
  <vue-final-modal
    v-bind="$attrs"
    classes="modal-container"
    content-class="modal-content"
    @before-open="onBeforeOpen"
  >
    <div v-if="item">
      <span class="modal__title">{{ item.id }}</span>
      <button @click="tab = 'crafting'" :disabled="tab === 'crafting'">
        Crafting Sources
      </button>
      <button @click="tab = 'uses'" :disabled="tab === 'uses'">
        Crafting Uses
      </button>
      <button
        v-if="isMachine"
        @click="tab = 'machineRecipes'"
        :disabled="tab === 'machineRecipes'"
      >
        Machine Recipes
      </button>

      <div class="modal__content">
        <CraftbookModalRecipe
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe-id="recipe.id"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: var(--color-background);
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__content {
  margin-top: 1rem;
  overflow-y: auto;
  max-height: 60vh;
}
</style>
