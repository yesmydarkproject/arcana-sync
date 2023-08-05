<script>
  import '../app.css';
  import Header from './Header.svelte';
  import './styles.css';
</script>

<div class="app">
  <Header />

  <main class="px-3 pt-1">
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>
