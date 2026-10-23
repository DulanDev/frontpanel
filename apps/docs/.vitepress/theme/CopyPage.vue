<script setup lang="ts">
// Copy page, under each doc page's title: the page as Markdown on the clipboard, and a menu to read
// that Markdown or take it to a chat. The Markdown itself is built by llms/.
import { FpButton, FpButtonGroup, FpIcon, FpLed, FpMenu, FpMenuItem, FpMenuSeparator } from '@frontpanel/vue'
import { useData, withBase } from 'vitepress'
import { computed, onBeforeUnmount, ref } from 'vue'
import { siteUrl } from '../site'

const { page } = useData()

// The copy and the tab read this server's Markdown; a chat reads the live site's, which it can reach.
const markdown = computed(() => withBase(`/${page.value.relativePath}`))
const prompt = computed(() => `I'm reading the Frontpanel docs: ${siteUrl}${page.value.relativePath}. Help me understand it and answer my questions about it.`)
const chats = computed(() => [
  { name: 'ChatGPT', href: `https://chatgpt.com/?q=${encodeURIComponent(prompt.value)}` },
  { name: 'Claude', href: `https://claude.ai/new?q=${encodeURIComponent(prompt.value)}` },
])

const result = ref<'copied' | 'failed'>()
// Re-keys the LED, so it blinks again on every press.
const presses = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  const text = fetch(markdown.value).then(async (response) => {
    if (!response.ok)
      throw new Error(`${response.status} ${markdown.value}`)
    return response.text()
  })
  try {
    // Handing the clipboard the fetch as it runs keeps the press counting as the user's in Safari.
    await navigator.clipboard.write([new ClipboardItem({ 'text/plain': text.then(body => new Blob([body], { type: 'text/plain' })) })])
    show('copied')
  }
  catch {
    try {
      await navigator.clipboard.writeText(await text)
      show('copied')
    }
    catch {
      show('failed')
    }
  }
}

function show(outcome: 'copied' | 'failed') {
  result.value = outcome
  presses.value++
  clearTimeout(timer)
  timer = setTimeout(() => (result.value = undefined), 2000)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="copy-page vp-raw">
    <FpButtonGroup aria-label="This page as Markdown">
      <FpButton aria-label="Copy page as Markdown" @click="copy">
        <FpLed :key="presses" :lit="result !== undefined" :color="result === 'failed' ? 'red' : 'green'" blink />
        <!-- All three labels hold the space, so the button keeps its width as the label changes. -->
        <span class="labels" aria-hidden="true">
          <span :class="{ shown: result === undefined }">Copy page</span>
          <span :class="{ shown: result === 'copied' }">Copied</span>
          <span :class="{ shown: result === 'failed' }">Copy failed</span>
        </span>
      </FpButton>
      <FpMenu>
        <template #trigger>
          <FpButton aria-label="More ways to read this page">
            <FpIcon name="down" />
          </FpButton>
        </template>
        <FpMenuItem as="a" :href="markdown" target="_blank" rel="noopener">
          View as Markdown
        </FpMenuItem>
        <FpMenuSeparator />
        <FpMenuItem v-for="chat in chats" :key="chat.name" as="a" :href="chat.href" target="_blank" rel="noopener noreferrer">
          Open in {{ chat.name }}
        </FpMenuItem>
      </FpMenu>
    </FpButtonGroup>
    <span class="status" role="status">{{ result === 'copied' ? 'Copied the page as Markdown' : result === 'failed' ? 'Could not copy the page' : '' }}</span>
  </div>
</template>

<style scoped>
.copy-page {
  margin-top: 16px;
}

.labels {
  display: grid;
}

.labels > span {
  grid-area: 1 / 1;
  visibility: hidden;
}

.labels > .shown {
  visibility: visible;
}

.status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
