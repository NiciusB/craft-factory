<template>
  <div class="machine-selection">
    <div
      v-for="machine in machines"
      :key="machine ?? 'handcraft'"
      @click="selectedMachineId = machine"
      :class="{ machine: true, '--selected': selectedMachineId === machine }"
    >
      <template v-if="machine !== undefined">
        <ItemName :item-id="machine" />
        <ItemPortrait :item-id="machine" />
      </template>
      <span v-else>Hand Craft</span>
    </div>
  </div>
  <div class="recipes">
    <CraftViewRecipe
      v-for="recipeId in recipeIds"
      :key="recipeId"
      :recipe-id="recipeId"
      :selectedMachineId="selectedMachineId"
    />
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { computed, ref } from 'vue'
import assertItemIsMachine from '@/utils/assertItemIsMachine'
import ItemPortrait from '@/components/ItemPortrait.vue'
import ItemName from '@/components/ItemName.vue'
import CraftViewRecipe from '@/components/CraftView/CraftViewRecipe.vue'

const selectedMachineId = ref<string | undefined>(undefined)

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

const recipeIds = computed(() => {
  const machineProcesses =
    selectedMachine.value === undefined
      ? ['core:craft']
      : selectedMachine.value.processes

  return gameStore.recipes
    .filter((recipe) => machineProcesses.includes(recipe.process))
    .map((recipe) => recipe.id)
})
</script>

<style>
.machine-selection {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
  overflow-x: auto;
}
.machine-selection .machine {
  width: 7rem;
  height: 7rem;
  flex-shrink: 0;
  position: relative;
  border: 1px solid var(--color-border-hover);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-color: var(--color-background-soft);
  cursor: pointer;
}
.machine-selection .machine.--selected {
  background-color: var(--color-brand);
}

.recipes {
  padding: 1rem;
}
</style>
