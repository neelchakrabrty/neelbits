---
layout: ../../layouts/MarkdownPostLayout.astro
author: 'Neel Chakraborty'
title: 'I was bored,so I built a router'
pubDate: 2024-09-07
tags: ["OpenBSD","Router","FOSS"]
---

I am still buzzing from the learning experience alone. 

I was wondering how to spend my weekend, and I got bored, so I decided to build a router. 

I want to start off by saying that I was not very well accustomed to OpenBSD, I didn't know how rcctl,pf,unbound,dhcpd worked. I didn't know how hostname configuration worked,and I had absolutely no idea how to setup a static IP in OpenBSD. 

I thought to myself, how hard can it be, given that I have standard ability to read and comprehend things. Turns out, not very hard at all. I came across two guides, one [official guide](https://www.openbsd.org/faq/pf/example1.html) and another [unofficial guide](https://openbsdrouterguide.net/). I must say that the unofficial guide is very good, and goes in depth to explain stuff that a newcomer like me needed to be explained. Ultimately, after giving the unofficial guide a good read 2-3 times, I ditched it and went for the official guide and man pages. 

I thought that it would take me hours to setup the router, but it only took me 45 minutes of fiddling around and reading the man pages to get a usable router without an AP. The fact that I went into this project knowing nothing about the technology stack, and it took me 45 minutes to get used to the syntax and commands is a testament to how well OpenBSD is designed, including the man pages. I learnt boilerplate usage of rcctl,dhcpd,unbound and it was a breeze setting them up.I can't believe I get to use this amazing OS and it's software stack for free, I feel privileged. Thank you to all the devs who make such beautiful software.

I leave out the details on how to build your own router, because I cannot do better than the two guides I have already linked above. 

Also, I guess, I don't like getting bored. 