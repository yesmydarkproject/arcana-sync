<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import YouTubePlayer from '$lib/ytPlayer';
  import {
    currentTimeContextKey,
    showHoursContextKey,
    type CurrentTimeContext,
    type ShowHoursContext
  } from '$lib/context';

  export let className = '';
  let player: YouTubePlayer | undefined = undefined;
  let videoIdOrUrl = '';
  let trueVideoId = '';
  let borderBoxSize: ResizeObserverSize[] = [];

  const currentTime = getContext<CurrentTimeContext>(currentTimeContextKey);
  const showHours = getContext<ShowHoursContext>(showHoursContextKey);

  $: {
    const [size1] = borderBoxSize;
    if (size1) {
      const { blockSize: boxHeight, inlineSize: boxWidth } = size1;
      const { width, height } = calculatePlayerSize(boxWidth, boxHeight);
      player?.setSize(width, height);
    }
  }

  onMount(() => {
    player = new YouTubePlayer('#player', {
      modestBranding: true,
      related: false,
      timeupdateFrequency: 50,
      host: 'https://www.youtube-nocookie.com'
    });
    // player.setVolume(100);

    player.on('cued', () => {
      showHours.set(player!.getDuration() > 60 * 60);
    });
    player.on('playing', () => {
      showHours.set(player!.getDuration() > 60 * 60);
    });
    player.on('timeupdate', (seconds) => {
      currentTime.set(seconds);
    });
  });

  function calculatePlayerSize(boxWidth: number, boxHeight: number) {
    const basedOnWidth = { width: boxWidth, height: (boxWidth * 9) / 16 };
    // return basedOnWidth;
    const basedOnHeight = { width: (boxHeight * 16) / 9, height: boxHeight };

    const current =
      basedOnWidth.width > basedOnHeight.width || basedOnWidth.height > basedOnHeight.height
        ? basedOnHeight
        : basedOnWidth;

    return current;
  }

  $: trueVideoId =
    (videoIdOrUrl.startsWith('https://www.youtube.com/')
      ? new URL(videoIdOrUrl).searchParams.get('v')
      : videoIdOrUrl.startsWith('https://youtu.be/')
      ? new URL(videoIdOrUrl).pathname.replace('/', '')
      : videoIdOrUrl) ?? '';

  $: {
    if (trueVideoId) {
      fetch(
        `//www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${trueVideoId}&format=json`
      ).then((res) => {
        if (res.status !== 200) return;
        player?.load(trueVideoId);
      });
    }
  }
</script>

<div class={`${className}`}>
  <div class="mb-2">
    Video ID/URL: <input
      class="bg-violet-900/50 px-1 ml-3 w-[20rem] rounded-sm outline-none"
      type="text"
      bind:value={videoIdOrUrl}
      on:keydown={(e) => {
        if (e.key === 'Enter' && trueVideoId) {
          videoIdOrUrl = trueVideoId;
        }
      }}
    />
  </div>
  <div class="w-full h-[calc((100vh_-_82px)*0.85)] flex place-items-center" bind:borderBoxSize>
    <div id="player" />
  </div>
</div>

<style>
  #player {
    margin: 0 auto;
  }
</style>
