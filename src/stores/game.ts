import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import assertItemIsMachine from '@/utils/assertItemIsMachine'

export const useGameStore = defineStore('game', () => {
  function resetMods() {
    items.value.splice(0, items.value.length)
    recipes.value.splice(0, recipes.value.length)
  }

  const inventoryMap = ref<Map<Game.ItemId, number>>(new Map())
  const inventory = computed(() =>
    Array.from(inventoryMap.value.entries()).map((entry) => ({
      item: entry[0],
      qty: entry[1],
    }))
  )
  const inventoryMachinesList = computed(() => {
    const list = new Set<Game.ItemId>()
    inventory.value.forEach((iv) => {
      const item = getItem(iv.item)

      if (item.tags.includes('core:machine')) {
        list.add(item.id)
      }
    })

    return Array.from(list)
  })
  function addToInventory(itemId: Game.ItemId, qty: number = 1) {
    if (qty <= 0) {
      throw new Error(
        `When adding to inventory, qty must be greater than 0 (${qty})`
      )
    }

    const previousValue = inventoryMap.value.get(itemId) ?? 0
    inventoryMap.value.set(itemId, previousValue + qty)
  }
  function removeFromInventory(itemId: Game.ItemId, qty: number = 1) {
    const previousValue = inventoryMap.value.get(itemId) ?? 0

    if (qty > previousValue) {
      throw new Error(
        `Not enough ${itemId} items in inventory to remove (${qty} vs ${previousValue})`
      )
    }

    if (previousValue - qty === 0) {
      inventoryMap.value.delete(itemId)
    } else {
      inventoryMap.value.set(itemId, previousValue - qty)
    }
  }

  const items = ref<Game.Item[]>([])
  function addItem(newItem: Game.Item) {
    if (items.value.some((item) => item.id === newItem.id)) {
      throw new Error(`Item ${newItem.id} already exists`)
    }

    items.value.push(newItem)
  }
  function addMachine(newMachine: Game.Machine) {
    return addItem(newMachine)
  }
  function getItem(itemId: Game.ItemId) {
    const item = items.value.find((x) => x.id === itemId)
    if (item === undefined) {
      throw new Error(`Item ${itemId} not found`)
    }
    return item
  }

  const recipes = ref<Game.Recipe[]>([])
  function addRecipe(newRecipe: Game.Recipe) {
    if (recipes.value.some((recipe) => recipe.id === newRecipe.id)) {
      throw new Error(`Recipe ${newRecipe.id} already exists`)
    }

    recipes.value.push(newRecipe)
  }
  function getRecipe(recipeId: Game.RecipeId) {
    const recipe = recipes.value.find((x) => x.id === recipeId)
    if (recipe === undefined) {
      throw new Error(`Recipe ${recipeId} not found`)
    }
    return recipe
  }
  const processes = computed(() => {
    const list = new Set<Game.ProcessId>()
    recipes.value.forEach((recipe) => {
      list.add(recipe.process)
    })
    return Array.from(list)
  })

  type ActiveProcess = {
    progress: number
    recipeId: Game.RecipeId
    machineId: Game.ItemId | undefined
    inputItems: { item: Game.ItemId; qty: number }[]
  }

  const processesQueue = ref<Set<ActiveProcess>>(new Set())

  function countRecipeInProcessesQueue(recipeId: Game.RecipeId) {
    let count = 0
    processesQueue.value.forEach((activeProcess) => {
      if (activeProcess.recipeId === recipeId) {
        count++
      }
    })
    return count
  }

  function cancelQueuedRecipesForRecipeId(recipeId: Game.RecipeId) {
    processesQueue.value.forEach((activeProcess) => {
      if (activeProcess.recipeId === recipeId) {
        processesQueue.value.delete(activeProcess)
        activeProcess.inputItems.forEach((inputItem) => {
          addToInventory(inputItem.item, inputItem.qty)
        })
      }
    })
  }

  function startProcess(
    recipeId: Game.RecipeId,
    machineId: Game.ItemId | undefined
  ) {
    const hasMachine =
      machineId === undefined || inventoryMachinesList.value.includes(machineId)
    if (!hasMachine) {
      throw new Error(`Player had no machine`)
    }
    const machine = machineId === undefined ? undefined : getItem(machineId)
    if (machine !== undefined) {
      assertItemIsMachine(machine)
    }

    const recipe = getRecipe(recipeId)

    if (machine === undefined) {
      if (recipe.process !== 'core:craft') {
        throw new Error(`Without machines we can only craft normally`)
      }
    } else {
      if (!machine.processes.includes(recipe.process)) {
        throw new Error(`Machine can not do this process`)
      }
    }

    // Check inventory has all items
    const stockCheck = checkStockedItemsForRecipe(recipeId)
    if (!stockCheck.hasEnoughItems) {
      throw new Error(
        `Not enough items (${JSON.stringify(
          Array.from(stockCheck.missingItems)
        )})`
      )
    }

    const inputItems: ActiveProcess['inputItems'] = []

    // Remove items from inventory
    recipe.in.forEach((rin) => {
      if ('item' in rin) {
        removeFromInventory(rin.item, rin.qty)
        inputItems.push({
          item: rin.item,
          qty: rin.qty,
        })
      }
      if ('tag' in rin) {
        throw new Error(`tag processing not implemented yet`)
      }
    })

    processesQueue.value.add({
      progress: 0,
      recipeId,
      machineId,
      inputItems,
    })
  }
  function checkStockedItemsForRecipe(recipeId: Game.RecipeId) {
    const recipe = getRecipe(recipeId)

    const missingItems = new Map<
      Game.ItemId,
      {
        requiredQty: number
        inventoryQty: number
      }
    >()

    // Check inventory has all items
    recipe.in.forEach((rin) => {
      if ('item' in rin) {
        const inventoryValue = inventoryMap.value.get(rin.item) ?? 0
        if (inventoryValue < rin.qty) {
          missingItems.set(rin.item, {
            requiredQty: rin.qty,
            inventoryQty: inventoryValue,
          })
        }
      }
      if ('tag' in rin) {
        throw new Error(`tag processing not implemented yet`)
      }
    })

    return {
      hasEnoughItems: missingItems.size === 0,
      missingItems,
    }
  }

  function runTick(dt: number) {
    const machinesUsedCount = new Map<Game.ItemId | undefined, number>()
    processesQueue.value.forEach((activeProcess) => {
      const machine =
        activeProcess.machineId === undefined
          ? undefined
          : getItem(activeProcess.machineId)
      if (machine !== undefined) {
        assertItemIsMachine(machine)
      }

      const timesUsed = machinesUsedCount.get(activeProcess.machineId) ?? 0
      const machinesCount =
        activeProcess.machineId === undefined
          ? 1
          : inventoryMap.value.get(activeProcess.machineId) ?? 0
      if (timesUsed >= machinesCount) {
        return
      }
      machinesUsedCount.set(activeProcess.machineId, timesUsed + 1)

      const recipe = getRecipe(activeProcess.recipeId)

      activeProcess.progress += ((machine?.processingSpeed ?? 1) * dt) / 1000

      if (activeProcess.progress >= recipe.processingSeconds) {
        // Finished, remove from queue
        processesQueue.value.delete(activeProcess)

        // Add items to inventory
        recipe.out.forEach((rout) => {
          if (Math.random() * 100 < rout.chance) {
            addToInventory(rout.item, rout.qty)
          }
        })
      }
    })
  }

  function getQueueProcessProgress(
    machineId: Game.ItemId | undefined,
    recipeId: Game.RecipeId
  ) {
    for (const activeProcess of processesQueue.value) {
      if (
        activeProcess.machineId === machineId &&
        activeProcess.recipeId === recipeId
      ) {
        const recipe = getRecipe(activeProcess.recipeId)
        return activeProcess.progress / recipe.processingSeconds
      }
    }
    return undefined
  }

  function serializeGameState(): string {
    return JSON.stringify(
      {
        processesQueue: processesQueue.value,
        inventory: inventory.value,
      },
      (_key, value) => (value instanceof Set ? [...value] : value)
    )
  }
  function restoreSerializedGameState(serialized: string) {
    const unserialized = JSON.parse(serialized)
    processesQueue.value = new Set(unserialized.processesQueue)
    inventoryMap.value = new Map()
    unserialized.inventory.forEach((item: any) => {
      inventoryMap.value.set(item.item, item.qty)
    })
  }

  return {
    resetMods,
    inventory,
    inventoryMachinesList,
    addToInventory,
    removeFromInventory,
    items,
    addItem,
    addMachine,
    getItem,
    recipes,
    addRecipe,
    getRecipe,
    processes,
    processesQueue,
    countRecipeInProcessesQueue,
    cancelQueuedRecipesForRecipeId,
    checkStockedItemsForRecipe,
    startProcess,
    getQueueProcessProgress,
    runTick,
    serializeGameState,
    restoreSerializedGameState,
  }
})

export type GameStoreType = ReturnType<typeof useGameStore>
