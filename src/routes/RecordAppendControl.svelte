<script lang="ts">
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import PlusIcon from '$lib/PlusIcon.svelte';
  import { getContext } from 'svelte';
  import {
    currentTimeContextKey,
    showHoursContextKey,
    recordsContextKey,
    type CurrentTimeContext,
    type ShowHoursContext,
    type RecordsContext
  } from '$lib/context';

  dayjs.extend(duration);

  export let className = '';
  const currentTime = getContext<CurrentTimeContext>(currentTimeContextKey);
  const showHours = getContext<ShowHoursContext>(showHoursContextKey);
  const records = getContext<RecordsContext>(recordsContextKey);

  let appendRecordTimestampMs = 0;
  let appendRecordTimestampString = '';
  let appendRecordComment = '';
  let appendInputting = false;
  let inputBox: HTMLInputElement | undefined = undefined;
  let canAppend = false;

  $: {
    canAppend = appendRecordComment.length > 0;
  }

  $: {
    if (!appendInputting) {
      appendRecordTimestampMs = Math.floor($currentTime * 1000);
    }
  }

  $: appendRecordTimestampString = dayjs
    .duration(appendRecordTimestampMs)
    .format($showHours ? 'H:mm:ss.SSS' : 'mm:ss.SSS');

  function appendOnInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const value = e.currentTarget.value;
    appendRecordComment = value;
    if (value.length > 0) {
      appendInputting = true;
    }
  }

  function requestAppend() {
    if (!canAppend) return;

    const timestamp = appendRecordTimestampMs / 1000;
    const comment = appendRecordComment;
    records.update((_records) => {
      _records.push({ timestamp, comment });
      return _records.sort((a, b) => a.timestamp - b.timestamp);
    });
  }

  function resetControl() {
    inputBox && (inputBox.value = '');
    appendRecordComment = '';
    appendInputting = false;
  }
</script>

<div class={className}>
  <span class="justify-self-center">
    {appendRecordTimestampString}
  </span>
  <input
    bind:this={inputBox}
    class="bg-violet-900/50 px-1 py-[2px] w-full rounded-sm outline-none"
    on:input={appendOnInput}
    on:blur={() => {
      if (appendRecordComment.length === 0) {
        appendInputting = false;
      }
    }}
    on:keydown={(e) => {
      if (e.key === 'Escape') {
        e.currentTarget.value = '';
        appendRecordComment = '';
        e.currentTarget.blur();
      } else if (e.key === 'Enter') {
        requestAppend();
        resetControl();
      }
    }}
  />
  <div class="flex items-center gap-2 justify-self-end">
    <button
      class="bg-gray-600 box-content p-0.5 data-[can-append=true]:bg-green-800"
      data-can-append={canAppend}
      tabindex={canAppend ? 0 : -1}
      on:click={() => {
        requestAppend();
        resetControl();
      }}
    >
      <PlusIcon className="fill-white w-[18px]" />
    </button>
  </div>
</div>
