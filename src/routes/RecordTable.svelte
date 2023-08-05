<script lang="ts">
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import RecordRow from './RecordRow.svelte';
  import RecordAppendControl from './RecordAppendControl.svelte';
  import { getContext } from 'svelte';
  import { type RecordsContext, recordsContextKey } from '$lib/context';

  dayjs.extend(duration);

  export let className = '';

  const records = getContext<RecordsContext>(recordsContextKey);
  $: $records.sort((a, b) => a.timestamp - b.timestamp);
</script>

<div class={`${className}`}>
  <RecordAppendControl
    className="mb-2 pb-2 pr-2 grid grid-cols-[7rem_1fr_35px] items-center border-b-2 border-gray-600"
  />
  <ul>
    {#each $records as { timestamp, comment }, index}
      <RecordRow {timestamp} {comment} recordIndex={index} />
    {/each}
  </ul>
</div>
