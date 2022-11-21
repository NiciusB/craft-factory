<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
})

const imageUrl = computed(() =>
  new URL(
    `/src/assets/images/ai-icons/${props.itemId}.png`,
    import.meta.url
  ).toString()
)
</script>

<template>
  <div class="item-portrait">
    {{ props.itemId }}
    <img :src="imageUrl" aria-hidden="true" alt="" />
  </div>
</template>

<style scoped>
.item-portrait {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
}
.item-portrait img {
  width: 50px;
  height: 50px;
}
</style>
