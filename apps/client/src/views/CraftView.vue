<template>
  <div class="machine-selection">
    <div
      v-for="machine in machines"
      :key="machine ?? 'handcraft'"
      @click="selectedMachineId = machine"
      :class="{ machine: true, '--selected': selectedMachineId === machine }"
    >
      <ItemPortrait v-if="machine !== undefined" :item-id="machine" />
      <span v-else>Hand Craft</span>
    </div>
  </div>
  <div class="recipes">
    <div
      v-for="{
        recipe,
        missingItems,
        hasEnoughItems,
        progressPercentage,
        queueCount,
      } in recipes"
      :key="recipe.id"
      @click="
        !$event.defaultPrevented && hasEnoughItems && onRecipeClicked(recipe)
      "
      :class="{ recipe: true, '--has-enough-items': hasEnoughItems }"
    >
      <div
        v-if="progressPercentage !== undefined"
        class="progress-bar"
        :style="{ '--progress-percentage': progressPercentage }"
      />
      <div>
        <span
          >{{ Math.ceil(recipe.processingSeconds / processingSpeed) }}s.
        </span>
        <span v-if="queueCount">
          {{ queueCount }} in queue.
          <button @click.prevent="cancelAllQueuedRecipes(recipe)">
            Cancel all
          </button>
        </span>
      </div>
      <IoScheme>
        <template #input>
          <div v-for="(rin, index) in recipe.in" :key="index">
            <span
              v-if="'item' in rin && missingItems[rin.item] > 0"
              class="missing"
            >
              (Missing {{ numberToHuman(missingItems[rin.item]) }})
            </span>
            {{ rin.qty }}x
            <ItemPortrait v-if="'item' in rin" :item-id="rin.item" />
            <span v-else-if="'tag' in rin">
              {{ rin.tag }}
            </span>
          </div>
        </template>
        <template #output>
          <div v-for="(rout, index) in recipe.out" :key="index">
            {{ rout.qty }}x <ItemPortrait :item-id="rout.item" />
            {{ rout.chance !== 100 ? `(${rout.chance}% chance)` : '' }}
          </div>
        </template>
      </IoScheme>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { computed, ref } from 'vue'
import assertItemIsMachine from '@/utils/assertItemIsMachine'
import IoScheme from '@/components/IoScheme.vue'
import numberToHuman from '@/utils/numberToHuman'
import ItemPortrait from '@/components/ItemPortrait.vue'

const selectedMachineId = ref<string | undefined>()

const gameStore = useGameStore()
const machines = computed(() => [undefined, ...gameStore.inventoryMachinesList])

const selectedMachine = computed(() => {
  const machine =
    selectedMachineId.value === undefined
      ? undefined
      : gameStore.getItem(selectedMachineId.value)
  if (machine !== undefined) {
    assertItemIsMachine(machine)
  }

  return machine
})

const processingSpeed = computed(() => {
  return selectedMachine.value?.processingSpeed ?? 1
})

const recipes = computed(() => {
  const machineProcesses =
    selectedMachine.value === undefined
      ? ['core:craft']
      : selectedMachine.value.processes

  return gameStore.recipes
    .filter((recipe) => machineProcesses.includes(recipe.process))
    .map((recipe) => {
      const progressPercentage = gameStore.getQueueProcessProgress(
        selectedMachineId.value,
        recipe.id
      )
      const stockCheck = gameStore.checkStockedItemsForRecipe(recipe.id)
      const missingItems: { [key: Game.ItemId]: number } = {}
      stockCheck.missingItems.forEach((missingItem, itemId) => {
        missingItems[itemId] = Math.max(
          0,
          missingItem.requiredQty - missingItem.inventoryQty
        )
      })
      const queueCount = gameStore.countRecipeInProcessesQueue(recipe.id)
      return {
        recipe,
        missingItems,
        hasEnoughItems: stockCheck.hasEnoughItems,
        queueCount,
        progressPercentage:
          progressPercentage === undefined
            ? undefined
            : progressPercentage * 100,
      }
    })
})

function onRecipeClicked(recipe: Game.Recipe) {
  gameStore.startProcess(recipe.id, selectedMachineId.value)
}

function cancelAllQueuedRecipes(recipe: Game.Recipe) {
  gameStore.cancelQueuedRecipesForRecipeId(recipe.id)
}
</script>

<style>
.machine-selection {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}
.machine-selection .machine {
  width: 7rem;
  height: 7rem;
  position: relative;
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-soft);
  cursor: pointer;
}
.machine-selection .machine.--selected {
  background-color: var(--color-brand);
}

.recipes {
  padding: 1rem;
}
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
.recipe .missing {
  color: var(--color-error);
}
</style>
