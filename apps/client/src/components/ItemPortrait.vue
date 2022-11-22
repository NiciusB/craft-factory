<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '2.5rem',
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
    <img
      :src="imageUrl"
      aria-hidden="true"
      alt=""
      :style="{ width: props.size, height: props.size }"
    />
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
  border-radius: 9px;
  box-shadow: 0 0 9px 1px var(--color-background-contrast-300);
}
</style>
