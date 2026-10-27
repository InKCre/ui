<script setup lang="ts">
import InkContentReader from "../../src/components/inkContentReader/inkContentReader.vue";
const markdown =
  "# Notes\n\n- [x] Reviewed\n- [ ] Pending\n\n| Item | Value |\n| --- | --- |\n| A | 12 |\n\n```html\n<node>& value\n  indented\n```\n\n~~removed~~ https://example.org";
const html =
  '<article><h1>Saved page</h1><p><a href="https://example.org">Source</a></p><pre><code>&lt;node&gt;&amp; value\n  indented</code></pre><table><tr><th>Item</th><th>Value</th></tr><tr><td>A</td><td>12</td></tr></table><img src="https://example.org/image.png" alt="Image reference"><script>window.readerExecuted=true</scr' +
  'ipt><input value="private"><a href="javascript:alert(1)">Unsafe link</a></article>';
</script>
<template>
  <Story title="Media/ContentReader" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="HTML structure and blocked active content"
      ><InkContentReader :content="html" format="html"
    /></Variant>
    <Variant title="GFM source and literal code"
      ><InkContentReader :content="markdown" format="markdown"
    /></Variant>
  </Story>
</template>
