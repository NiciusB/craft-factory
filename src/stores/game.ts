import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const inventoryObj = ref<Map<Game.ItemId, number>>(new Map())
  const inventory = computed(() =>
    Array.from(inventoryObj.value.entries()).map((entry) => ({
      item: entry[0],
      qty: entry[1],
    }))
  )
  const inventoryMachines = computed(() =>
    inventory.value.filter((iv) =>
      getItem(iv.item)?.tags?.includes('core:machine')
    )
  )
  function addToInventory(itemId: Game.ItemId, qty: number = 1) {
    const previousValue = inventoryObj.value.get(itemId) ?? 0
    inventoryObj.value.set(itemId, previousValue + qty)
  }

  const items = ref<Game.Item[]>([])
  function addItem(newItem: Game.Item) {
    if (items.value.some((item) => item.id === newItem.id)) {
      throw new Error(`Item ${newItem.id} already exists`)
    }

    items.value.push(newItem)
  }
  function getItem(itemId: Game.ItemId) {
    return items.value.find((x) => x.id === itemId)
  }

  const recipes = ref<Game.Recipe[]>([])
  function addRecipe(newRecipe: Game.Recipe) {
    if (recipes.value.some((recipe) => recipe.id === newRecipe.id)) {
      throw new Error(`Recipe ${newRecipe.id} already exists`)
    }

    recipes.value.push(newRecipe)
  }
  function getRecipe(recipeId: Game.RecipeId) {
    return recipes.value.find((x) => x.id === recipeId)
  }
  const processes = computed(() => {
    const list = new Set<Game.ProcessId>()
    recipes.value.forEach((recipe) => {
      list.add(recipe.process)
    })
    return Array.from(list)
  })

  return {
    inventory,
    inventoryMachines,
    addToInventory,
    items,
    addItem,
    getItem,
    recipes,
    addRecipe,
    getRecipe,
    processes,
  }
})

export type GameStoreType = ReturnType<typeof useGameStore>
