import { $vfm } from 'vue-final-modal'
import CraftbookModal from '@/components/modals/CraftbookModal.vue'

export default function openCraftbookModal(
  itemId: Game.ItemId,
  tab?: 'uses' | 'crafting'
) {
  $vfm.hideAll()

  return $vfm.show(
    {
      component: CraftbookModal,
    },
    {
      itemId,
      tab,
    }
  )
}
