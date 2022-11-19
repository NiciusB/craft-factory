import type { GameStoreType } from '@/stores/game'

export default function coreMod(gameStore: GameStoreType) {
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

  const greenhouse: Game.Machine = {
    id: 'core:greenhouse',
    tags: ['core:machine'],
    allowedDecimalQty: false,
    processes: ['core:greenhouse_grow'],
    processingSpeed: 1,
    consumptionPerTick: [],
  }
  gameStore.addItem(greenhouse)

  gameStore.addRecipe({
    id: 'core:grow_sapling',
    process: 'core:greenhouse_grow',
    in: [{ item: 'core:sapling', qty: 1 }],
    out: [
      { item: 'core:sapling', qty: 1, chance: 100 },
      { item: 'core:sapling', qty: 1, chance: 25 },
      { item: 'core:log', qty: 4, chance: 100 },
    ],
    allowedAutomation: false,
    processingTicks: 100,
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
}
