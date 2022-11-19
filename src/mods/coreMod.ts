import type { GameStoreType } from '@/stores/game'

export default function coreMod(gameStore: GameStoreType) {
  // Basic crafting
  gameStore.addItem({
    id: 'core:sapling',
    tags: [],
    allowedDecimalQty: false,
  })
  gameStore.addItem({
    id: 'core:log',
    tags: [],
    allowedDecimalQty: false,
  })
  gameStore.addItem({
    id: 'core:plank',
    tags: [],
    allowedDecimalQty: false,
  })
  gameStore.addItem({
    id: 'core:stick',
    tags: [],
    allowedDecimalQty: false,
  })

  gameStore.addRecipe({
    id: 'core:log_to_plank',
    process: 'core:craft',
    in: [{ item: 'core:log', qty: 1 }],
    out: [{ item: 'core:plank', qty: 4, chance: 100 }],
    allowedAutomation: true,
    processingTicks: 40,
  })
  gameStore.addRecipe({
    id: 'core:plank_to_stick',
    process: 'core:craft',
    in: [{ item: 'core:plank', qty: 2 }],
    out: [{ item: 'core:stick', qty: 4, chance: 100 }],
    allowedAutomation: true,
    processingTicks: 20,
  })

  // Greenhouse
  gameStore.addRecipe({
    id: 'core:craft_greenhouse',
    process: 'core:craft',
    in: [{ item: 'core:plank', qty: 50 }],
    out: [{ item: 'core:greenhouse', qty: 1, chance: 100 }],
    allowedAutomation: true,
    processingTicks: 500,
  })
  gameStore.addMachine({
    id: 'core:greenhouse',
    tags: ['core:machine'],
    allowedDecimalQty: false,
    processes: ['core:greenhouse_grow'],
    processingSpeed: 1,
    consumptionPerTick: [],
  })
  gameStore.addRecipe({
    id: 'core:grow_sapling',
    process: 'core:greenhouse_grow',
    in: [{ item: 'core:sapling', qty: 1 }],
    out: [
      { item: 'core:sapling', qty: 1, chance: 100 },
      { item: 'core:sapling', qty: 1, chance: 25 },
      { item: 'core:log', qty: 2, chance: 100 },
      { item: 'core:log', qty: 1, chance: 50 },
    ],
    allowedAutomation: false,
    processingTicks: 100,
  })

  // Sawmill
  gameStore.addRecipe({
    id: 'core:craft_sawmill',
    process: 'core:craft',
    in: [
      { item: 'core:log', qty: 4 },
      { item: 'core:plank', qty: 6 },
      { item: 'core:stick', qty: 10 },
    ],
    out: [{ item: 'core:sawmill', qty: 1, chance: 100 }],
    allowedAutomation: true,
    processingTicks: 500,
  })
  gameStore.addMachine({
    id: 'core:sawmill',
    tags: ['core:machine'],
    allowedDecimalQty: false,
    processes: ['core:sawmill'],
    processingSpeed: 1,
    consumptionPerTick: [],
  })
  gameStore.addRecipe({
    id: 'core:sawmill_log_to_plank',
    process: 'core:sawmill',
    in: [{ item: 'core:log', qty: 1 }],
    out: [
      { item: 'core:plank', qty: 4, chance: 100 },
      { item: 'core:plank', qty: 4, chance: 50 },
    ],
    allowedAutomation: true,
    processingTicks: 20,
  })
  gameStore.addRecipe({
    id: 'core:sawmill_plank_to_stick',
    process: 'core:sawmill',
    in: [{ item: 'core:plank', qty: 2 }],
    out: [
      { item: 'core:stick', qty: 4, chance: 100 },
      { item: 'core:stick', qty: 4, chance: 50 },
    ],
    allowedAutomation: true,
    processingTicks: 10,
  })
}
