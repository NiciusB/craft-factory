import type { GameStoreType } from '@/stores/game'

export default function coreMod(gameStore: GameStoreType) {
  // Basic crafting
  gameStore.addItem({
    id: 'core:energy',
    tags: [],
    allowedDecimalQty: true,
  })
  gameStore.addItem({
    id: 'core:stone',
    tags: [],
    allowedDecimalQty: false,
  })
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
    id: 'core:mine_stone',
    process: 'core:craft',
    in: [],
    out: [
      { item: 'core:stone', qty: 1, chance: 100 },
      { item: 'core:stone', qty: 1, chance: 50 },
    ],
    processingSeconds: 10,
  })
  gameStore.addRecipe({
    id: 'core:log_to_plank',
    process: 'core:craft',
    in: [{ item: 'core:log', qty: 1 }],
    out: [{ item: 'core:plank', qty: 4, chance: 100 }],
    processingSeconds: 4,
  })
  gameStore.addRecipe({
    id: 'core:plank_to_stick',
    process: 'core:craft',
    in: [{ item: 'core:plank', qty: 2 }],
    out: [{ item: 'core:stick', qty: 4, chance: 100 }],
    processingSeconds: 2,
  })

  // Greenhouse
  gameStore.addRecipe({
    id: 'core:craft_greenhouse',
    process: 'core:craft',
    in: [{ item: 'core:plank', qty: 50 }],
    out: [{ item: 'core:greenhouse', qty: 1, chance: 100 }],
    processingSeconds: 5,
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
      { item: 'core:sapling', qty: 1, chance: 15 },
      { item: 'core:log', qty: 2, chance: 100 },
    ],
    processingSeconds: 2,
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
    processingSeconds: 20,
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
    in: [
      { item: 'core:energy', qty: 0.1 },
      { item: 'core:log', qty: 1 },
    ],
    out: [
      { item: 'core:plank', qty: 4, chance: 100 },
      { item: 'core:plank', qty: 4, chance: 50 },
    ],
    processingSeconds: 5,
  })
  gameStore.addRecipe({
    id: 'core:sawmill_plank_to_stick',
    process: 'core:sawmill',
    in: [
      { item: 'core:energy', qty: 0.1 },
      { item: 'core:plank', qty: 2 },
    ],
    out: [
      { item: 'core:stick', qty: 4, chance: 100 },
      { item: 'core:stick', qty: 4, chance: 50 },
    ],
    processingSeconds: 3,
  })

  // Biomass generator
  gameStore.addRecipe({
    id: 'core:craft_biomass_generator',
    process: 'core:craft',
    in: [
      { item: 'core:log', qty: 8 },
      { item: 'core:plank', qty: 10 },
    ],
    out: [{ item: 'core:biomass_generator', qty: 1, chance: 100 }],
    processingSeconds: 10,
  })
  gameStore.addMachine({
    id: 'core:biomass_generator',
    tags: ['core:machine'],
    allowedDecimalQty: false,
    processes: ['core:biomass_generator_burn'],
    processingSpeed: 1,
    consumptionPerTick: [],
  })
  gameStore.addRecipe({
    id: 'core:burn_stick',
    process: 'core:biomass_generator_burn',
    in: [{ item: 'core:stick', qty: 1 }],
    out: [{ item: 'core:energy', qty: 1, chance: 100 }],
    processingSeconds: 2,
  })
}
