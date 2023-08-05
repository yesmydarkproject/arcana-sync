<script lang="ts">
  import { getContext } from 'svelte';
  import { type RecordsContext, recordsContextKey } from '$lib/context';

  const records = getContext<RecordsContext>(recordsContextKey);

  let jsonTextarea: HTMLTextAreaElement | undefined = undefined;
  let jsonMinified = false;
  let jsonButtonText = '';

  $: jsonButtonText = jsonMinified ? 'Format' : 'Minify';

  $: {
    if (jsonTextarea) {
      if (jsonMinified) {
        jsonTextarea.value = JSON.stringify($records);
      } else {
        jsonTextarea.value =
          '[\n' +
          $records
            .map(
              ({ timestamp, comment }) => `  { "timestamp": ${timestamp}, "comment": "${comment}" }`
            )
            .join(',\n') +
          '\n]';
      }
      const scroll = window.scrollY;
      jsonTextarea.style.height = '';
      jsonTextarea.style.height = `${jsonTextarea.scrollHeight}px`;
      window.scrollTo({ top: scroll, behavior: 'instant' });
    }
  }
</script>

<div class="relative">
  <textarea
    bind:this={jsonTextarea}
    class="bg-gray-900 font-mono py-1 px-2 w-full resize-none outline-none h-auto"
    readonly
    on:click={(e) => {
      e.currentTarget.select();
    }}
  />
  <div class="absolute top-0 right-1">
    <button
      class="px-2 py-0.5 bg-violet-800 text-sm"
      on:click={() => {
        jsonMinified = !jsonMinified;
      }}>{jsonButtonText}</button
    >
    <button
      class="px-2 py-0.5 bg-violet-800 text-sm"
      on:click={() => {
        if (!jsonTextarea) return;
        navigator.clipboard.writeText(jsonTextarea.value);
      }}>Copy</button
    >
  </div>
</div>
