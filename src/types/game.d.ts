export {}

declare global {
  declare namespace Game {
    export type ItemId = string
    export type RecipeId = string
    export type ProcessId = string
    export type TagId = string

    export type Item = {
      id: ItemId
      tags: TagId[]
      allowedDecimalQty: boolean
    }

    export type Recipe = {
      id: RecipeId
      in: { tag?: TagId; item?: ItemId; qty: number }[]
      out: { item: ItemId; qty: number; chance: number }[]
      process: ProcessId
      allowedAutomation: boolean
      processingTicks: number
    }

    export type Machine = Item & {
      tags: ['core:machine', ...TagId]
      processes: ProcessId[]
      processingSpeed: number
      consumptionPerTick: { tag?: TagId; item?: ItemId; qty: number }[]
    }
  }
}
