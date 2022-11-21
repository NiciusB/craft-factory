export default function searchFilterItemMatches(
  searchStr: string,
  itemId: Game.ItemId
) {
  searchStr = searchStr.trim()
  if (searchStr.length === 0) {
    return true
  }

  return itemId.toLowerCase().includes(searchStr.toLowerCase())
}
