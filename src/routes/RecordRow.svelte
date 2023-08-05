<script lang="ts">
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import { getContext } from 'svelte';
  import MinusIcon from '$lib/MinusIcon.svelte';
  import { recordsContextKey, type RecordsContext } from '$lib/context';

  dayjs.extend(duration);

  export let timestamp = 0;
  export let comment = '';
  export let showHours = false;
  export let recordIndex = 0;
  let editingTimestamp = false;
  let timestampDuration = '';
  let editingCurrentRow = false;
  let editingCurrentRow2 = false;

  $: {
    if (editingCurrentRow) {
      editingCurrentRow2 = true;
    } else {
      setTimeout(() => {
        if (!editingCurrentRow) {
          editingCurrentRow2 = false;
        }
      }, 100);
    }
  }

  let timestampEditBox: HTMLInputElement | undefined = undefined;
  let timestampSpan: HTMLSpanElement | undefined = undefined;

  $: timestampDuration = dayjs
    .duration(timestamp * 1000)
    .format(showHours ? 'H:mm:ss.SSS' : 'mm:ss.SSS');

  const records = getContext<RecordsContext>(recordsContextKey);

  function startEditingTimestamp() {
    editingTimestamp = true;
    setTimeout(() => {
      timestampEditBox?.focus();
    }, 1);
  }

  function endEditingTimestamp() {
    editingTimestamp = false;
    editingCurrentRow = false;
    setTimeout(() => {
      timestampSpan?.focus();
    }, 1);
  }

  function tryCompleteEditingTimestamp() {
    if (!timestampEditBox) return false;
    if (/[^0-9.]/.test(timestampEditBox.value)) return false;

    records.update((_records) => {
      _records[recordIndex].timestamp = Number.parseFloat(timestampEditBox!.value);
      return _records;
    });

    return true;
  }
</script>

<li
  class="min-h-[1.0rem] my-1 pr-2 py-2 grid grid-cols-[7rem_1fr_35px] items-center data-[focused-row=true]:bg-gray-800"
  data-focused-row={editingCurrentRow2}
>
  <div class="justify-self-center">
    {#if editingTimestamp}
      <input
        bind:this={timestampEditBox}
        class="bg-transparent py-[2px] rounded-sm outline-none text-right"
        style:width={showHours ? '98px' : '80px'}
        type="text"
        inputmode="numeric"
        value={timestamp}
        on:focus={(e) => {
          editingCurrentRow = true;
          e.currentTarget.select();
        }}
        on:blur={() => {
          if (!editingTimestamp) return;

          endEditingTimestamp();
          tryCompleteEditingTimestamp();
        }}
        on:keydown={(e) => {
          if (e.key === 'Escape') {
            endEditingTimestamp();
            e.currentTarget.blur();
          } else if (e.key === 'Enter') {
            if (tryCompleteEditingTimestamp()) {
              endEditingTimestamp();
            }
          }
        }}
      />
    {:else}
      <span
        bind:this={timestampSpan}
        tabindex="0"
        role="button"
        on:click={startEditingTimestamp}
        on:keydown={(e) => {
          if (e.key === ' ') {
            startEditingTimestamp();
          }
        }}>{timestampDuration}</span
      >
    {/if}
  </div>
  <div>
    <input
      class="bg-transparent px-1 py-[2px] w-full rounded-sm outline-none"
      type="text"
      value={comment}
      on:input={(e) => {
        records.update((_records) => {
          _records[recordIndex].comment = e.currentTarget.value;
          return _records;
        });
      }}
      on:keydown={(e) => {}}
      on:focus={() => {
        editingCurrentRow = true;
      }}
      on:blur={() => {
        editingCurrentRow = false;
      }}
    />
  </div>
  <div class="flex items-center gap-2 justify-self-end">
    <button
      class="bg-red-800 box-content p-0.5"
      on:click={() => {
        records.update((_records) => {
          _records.splice(recordIndex, 1);
          return _records;
        });
      }}
    >
      <MinusIcon className="fill-white w-[18px]" />
    </button>
  </div>
</li>
