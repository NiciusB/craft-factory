<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useGameStore } from '@/stores/game'
import coreMod from '@/mods/coreMod'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const gameStore = useGameStore()
coreMod(gameStore)

const saveInterval = ref<number>()
const lastUpdate = ref(Date.now())
const mounted = ref(true)

function saveGame() {
  localStorage.setItem('save1', gameStore.serializeGameState())
}
function onBeforeUnloadCallback() {
  saveGame()
  return true
}

function startGame() {
  const savedGame = localStorage.getItem('save1')
  if (savedGame) {
    // Load previous game
    gameStore.restoreSerializedGameState(savedGame)
  } else {
    // Start new game
    gameStore.giveInitialGameItems()
  }
}

onMounted(() => {
  startGame()

  function loop() {
    if (!mounted.value) {
      return
    }
    const now = Date.now()
    const dt = now - lastUpdate.value
    lastUpdate.value = now
    gameStore.runTick(dt)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)

  saveInterval.value = setInterval(saveGame, 5000)

  window.addEventListener('beforeunload', onBeforeUnloadCallback)
})

onBeforeUnmount(() => {
  mounted.value = false
  clearInterval(saveInterval.value)
  window.removeEventListener('beforeunload', onBeforeUnloadCallback)
})
</script>

<template>
  <div class="container">
    <main>
      <RouterView />
    </main>
    <div class="flex-grow" />
    <footer>
      <nav>
        <RouterLink :to="{ name: 'craft' }">Craft</RouterLink>
        <RouterLink :to="{ name: 'inventory' }">Inventory</RouterLink>
        <RouterLink :to="{ name: 'craftbook' }">Craftbook</RouterLink>
        <RouterLink :to="{ name: 'settings' }">Settings</RouterLink>
      </nav>
    </footer>
  </div>
  <ModalsContainer />
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.container .flex-grow {
  flex-grow: 1;
}

footer {
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--color-background);
}

nav {
  width: 100%;
  text-align: center;
  margin-top: 2rem;
  font-size: 1.25rem;
  padding: 1rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: var(--color-text);
}

nav a.router-link-exact-active {
  color: var(--color-brand);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a:first-of-type {
  border: 0;
}
</style>
