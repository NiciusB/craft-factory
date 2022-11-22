<script setup lang="ts">
import ItemPortrait from '@/components/ItemPortrait.vue'
import ItemName from '@/components/ItemName.vue'

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="item-row">
    <ItemPortrait :item-id="props.itemId" />
    <ItemName :item-id="props.itemId" />
    <div class="amount"><slot name="amount" /></div>
  </div>
</template>

<style scoped>
.item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.amount {
  font-weight: 500;
}
</style>
