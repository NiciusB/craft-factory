<template>
  <div
    @click="onRecipeClicked"
    :class="{ recipe: true, '--has-enough-items': hasEnoughItems }"
  >
    <div
      v-if="progressPercentage !== undefined"
      class="progress-bar"
      :style="{ '--progress-percentage': progressPercentage }"
    />
    <div class="content-over-progress-bar">
      <div>
        <span v-if="queueCount">
          {{ queueCount }} in queue.
          <button @click.prevent="cancelQueuedRecipes">Stop</button>
        </span>
      </div>
      <IoScheme>
        <template #input>
          <div class="item" v-for="(rin, index) in recipe.in" :key="index">
            <template v-if="'item' in rin">
              <span
                :class="{ missing: rin.qty > (inventory.get(rin.item) ?? 0) }"
              >
                {{ numberToHuman(inventory.get(rin.item) ?? 0) }} /
                {{ numberToHuman(rin.qty) }}
              </span>
              {{ ' ' }}
              <ItemName :item-id="rin.item" />
              {{ ' ' }}
              <ItemPortrait :item-id="rin.item" />
            </template>
            <span v-else-if="'tag' in rin">
              {{ numberToHuman(rin.qty) }}
              {{ ' ' }}
              {{ rin.tag }}
            </span>
          </div>
        </template>
        <template #middle>
          <div>></div>
          <div>{{ craftingTime }}</div>
        </template>
        <template #output>
          <div class="item" v-for="(rout, index) in recipe.out" :key="index">
            {{ numberToHuman(rout.qty) }}
            {{ ' ' }}
            <ItemName :item-id="rout.item" />
            {{ ' ' }}
            <ItemPortrait :item-id="rout.item" />
            {{ rout.chance !== 100 ? `(${rout.chance}% chance)` : '' }}
          </div>
        </template>
      </IoScheme>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'
import assertItemIsMachine from '@/utils/assertItemIsMachine'
import IoScheme from '@/components/IoScheme.vue'
import numberToHuman from '@/utils/numberToHuman'
import ItemPortrait from '@/components/ItemPortrait.vue'
import ItemName from '@/components/ItemName.vue'

const props = defineProps({
  selectedMachineId: {
    type: String,
    default: undefined,
  },
  recipeId: {
    type: String,
    required: true,
  },
})

const gameStore = useGameStore()

const selectedMachine = computed(() => {
  if (props.selectedMachineId === undefined) {
    return undefined
  }

  const machine = gameStore.getItem(props.selectedMachineId)
  assertItemIsMachine(machine)
  return machine
})

const recipe = computed(() => {
  return gameStore.getRecipe(props.recipeId)
})

const hasEnoughItems = computed(() => {
  return gameStore.checkHasEnoughItemsForRecipe(props.recipeId)
})

const queueCount = computed(() => {
  return gameStore.countRecipeInProcessesQueue(props.recipeId)
})

const inventory = computed(() => {
  return gameStore.inventory
})

const progressPercentage = computed(() => {
  const progressPercentage = gameStore.getQueueProcessProgress(
    props.selectedMachineId,
    props.recipeId
  )

  return progressPercentage === undefined ? undefined : progressPercentage * 100
})

const craftingTime = computed(() => {
  const processingSpeed = selectedMachine.value?.processingSpeed ?? 1
  return `${Math.ceil(recipe.value.processingSeconds / processingSpeed)}s`
})

function onRecipeClicked(event: Event) {
  if (!event.defaultPrevented && hasEnoughItems.value) {
    gameStore.startProcess(props.recipeId, props.selectedMachineId)
  }
}

function cancelQueuedRecipes() {
  gameStore.cancelQueuedRecipesForRecipeId(props.recipeId)
}
</script>

<style>
.recipe {
  padding: 1rem;
  border: 1px solid var(--color-border-hover);
  margin-bottom: 1rem;
  position: relative;
  background-color: var(--color-background-soft);
  opacity: 0.5;
}
.recipe.--has-enough-items {
  opacity: 1;
  cursor: pointer;
}
.recipe .progress-bar {
  --progress-percentage: 0;
  width: calc(var(--progress-percentage) * 1%);
  background: var(--color-brand);
  opacity: 0.15;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}
.recipe .content-over-progress-bar {
  position: relative;
}
.recipe .missing {
  color: var(--color-error);
}
.recipe .item:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
