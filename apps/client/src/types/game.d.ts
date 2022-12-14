export {}

declare global {
  declare namespace Game {
    export type ItemId = string
    export type RecipeId = string
    export type ProcessId = string
    export type TagId = string

    export type Translation = {
      locale: string
      value: string
    }

    export type Process = {
      id: ProcessId
      name: Translation[]
    }

    export type Item = {
      id: ItemId
      tags: TagId[]
      name: Translation[]
      allowedDecimalQty: boolean
    }

    export type Recipe = {
      id: RecipeId
      in: (({ tag: TagId } | { item: ItemId }) & { qty: numbe })[]
      out: { item: ItemId; qty: number; chance: number }[]
      process: ProcessId
      processingSeconds: number
    }

    export type Machine = Item & {
      tags: ['core:machine', ...TagId]
      allowedDecimalQty: false
      processes: ProcessId[]
      processingSpeed: number
      consumptionPerTick: { tag?: TagId; item?: ItemId; qty: number }[]
    }
  }
}
