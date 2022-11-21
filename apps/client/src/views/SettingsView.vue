<template>
  <button @click="restartGame">Restart game</button>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'

const router = useRouter()
const gameStore = useGameStore()
function restartGame() {
  if (confirm('Are you sure? You will lose all progress')) {
    gameStore.restartGame()
    gameStore.giveInitialGameItems()
    router.push({ name: 'home' })
    alert('Game restarted!')
  }
}
</script>
