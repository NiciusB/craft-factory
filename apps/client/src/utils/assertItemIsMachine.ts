export default function assertItemIsMachine(
  item?: Game.Item
): asserts item is Game.Machine {
  if (!item?.tags?.includes('core:machine')) {
    throw new Error(`Item is not a Machine`)
  }
}
