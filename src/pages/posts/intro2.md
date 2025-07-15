---
layout: ../../layouts/MarkdownPostLayout.astro
title: Katex and Astro
author: Neel Chakraborty
description: "After learning some Astro, I couldn't stop!"
image:
    url: "https://docs.astro.build/assets/arc.webp"
    alt: "The Astro logo on a dark background with a purple gradient arc."
pubDate: 2022-07-08
tags: ["astro", "blogging", "katex"]
---

So, in this post,I will talk about adding [$\KaTeX$](https://katex.org) rendering to your blog made with astro. I will assume that you already have a blog setup with astro,and we will just add $\KaTeX$ functionality to it for rendering math expressions written in $\LaTeX$. 

## Installing remark,rehype and $\KaTeX$ plugins

``` npm
npm install rehype-katex remark-math katex
```
## Updating `astro.config.mjs`

Just import rehypeKatex and remarkMath plugins

``` ts
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
```
and then, export markdown like this 

```ts
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  }
});
```
## Add the starter template

Finally, add the starter template from [here](https://katex.org/docs/browser),into your layout.astro.In my case,it was `BaseLayout.astro`

```html
<link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
            integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP"
            crossorigin="anonymous"
        />

        <!-- The loading of KaTeX is deferred to speed up page rendering -->
        <script
            defer
            src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js"
            integrity="sha384-cMkvdD8LoxVzGF/RPUKAcvmm49FQ0oxwDF3BGKtDXcEc+T1b2N+teh/OJfpU0jr6"
            crossorigin="anonymous"></script>

        <!-- To automatically render math in text elements, include the auto-render extension: -->
        <script
            defer
            src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js"
            integrity="sha384-hCXGrW6PitJEwbkoStFjeJxv+fSOOQKOPbJxSfM6G5sWZjAyWhXiTIIAmQqnlLlh"
            crossorigin="anonymous"
            onload="renderMathInElement(document.body);"></script>
```

### Remarks

To add math to .astro pages,add them like this 

``` html
<p class="prose md-prose-lg lg:prose-xl mx-auto px-4 py-6">
				{"\\( \\text{For all } a, b, c > 0 \\text{, we have:} \\)"}
				{
					"$$ \\frac{a}{b + c} + \\frac{b}{c + a} + \\frac{c}{a + b} \\geq \\frac{3}{2} $$"
				}
			</p>
```