<script>
  import github from '$lib/images/github.svg';
</script>

<header class="bg-violet-950/80 flex justify-between">
  <div class="p-2 text-ellipsis whitespace-nowrap overflow-hidden flex place-items-center">
    <span class="font-bold text-2xl">ArcanaSync</span>
  </div>
  <div class="corner flex-shrink-0">
    <a href="https://github.com/sveltejs/kit">
      <img src={github} alt="GitHub" />
    </a>
  </div>
</header>

<style>
  .corner {
    width: 3em;
    height: 3em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  a:hover {
    color: var(--color-theme-1);
  }
</style>
