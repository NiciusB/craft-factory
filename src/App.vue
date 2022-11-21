<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useGameStore } from '@/stores/game'
import coreMod from '@/mods/coreMod'
import { ref } from 'vue'

const gameStore = useGameStore()
coreMod(gameStore)

gameStore.addToInventory('core:greenhouse')
gameStore.addToInventory('core:sapling')

const lastUpdate = ref(Date.now())
function loop() {
  const now = Date.now()
  const dt = now - lastUpdate.value
  lastUpdate.value = now
  gameStore.runTick(dt)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
</script>

<template>
  <main>
    <RouterView />
  </main>
  <footer>
    <nav>
      <RouterLink :to="{ name: 'craft' }">Craft</RouterLink>
      <RouterLink :to="{ name: 'inventory' }">Inventory</RouterLink>
      <RouterLink :to="{ name: 'craftbook' }">Craftbook</RouterLink>
    </nav>
  </footer>
  <ModalsContainer />
</template>

<style scoped>
main {
  min-height: calc(100vh - 100px);
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
