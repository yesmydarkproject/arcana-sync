<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Player from './Player.svelte';
  import RecordTable from './RecordTable.svelte';
  import { currentTimeContextKey, recordsContextKey, showHoursContextKey } from '$lib/context';
  import type { ArcanaRecord } from '$lib/types';
  import RecordJsonArea from './RecordJsonArea.svelte';

  const currentTime = writable(0);
  setContext(currentTimeContextKey, currentTime);

  const showHours = writable(false);
  setContext(showHoursContextKey, showHours);

  const records = writable<ArcanaRecord[]>([]);
  setContext(recordsContextKey, records);
</script>

<svelte:head>
  <title>ArcanaSync</title>
  <meta name="description" content="ArcanaSync app" />
</svelte:head>

<div class="mt-1 flex">
  <Player className="flex-grow max-w-[70%]" />
  <RecordTable className="w-[30%]  min-w-[15rem]" />
</div>
<div class="border-t-2 border-gray-600 pt-2">
  <RecordJsonArea />
</div>
