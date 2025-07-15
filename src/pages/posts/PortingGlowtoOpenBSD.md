---
layout: ../../layouts/MarkdownPostLayout.astro
author: 'Neel Chakraborty'
title : 'Porting Glow to OpenBSD'
pubDate: 2024-09-13
Tags : ["OpenBSD","Porting"]
---

# What is glow?

Glow is a renderer that renders markdown in your terminal\
and makes it look beautiful while doing so. 

# Porting glow to OpenBSD

Well, a quick look at the github repository of `glow` tells us\
that glow is written in `go`, and we need `go` to compile it. 

As always, manpages are the oracle in the world of OpenBSD. \
Whenever you're in doubt, consult the man-pages \ 

Consulting `port-modules(5)` it seems like `lang/go` will do the trick. \
Also, do read up on `go-module(5)` before proceeding further. \

Let's see if `lang/go` works. 

## Preparing the Makefile

Copy the template Makefile and get to work! 

``` fish
    cp /usr/ports/infrastructure/templates/Makefile.template .
    mv Makefile.template Makefile
```
Even if you didn't read `go-module(5)`(which I think everyone should)\
The template Makefile is commented well enough, that you can virtually get around it without\
consulting any further man pages.

I want to highlight two things from the template Makefile

``` makefile
    MODGO_MODNAME =	github.com/test/app
    MODGO_VERSION =	0.1.1
```
This is where I truly love OpenBSD. The infrastructure has been already laid down for us\
so that, anybody(not necessarily with a programming background,although it helps) with \
the right amount of reading comprehension skills can getstarted with writing a port. \

The first variable is `MODGO_MODNAME`, and it's description in the Makefile template says\
`MODGO_MODNAME` should be set to the 'module' specified in the `'go.mod'` file.\
Where is the `go.mod` file for our project? It is generally located at the project repository root dir\
For us, it is not different. You can find it [Here](https://github.com/charmbracelet/glow/blob/master/go.mod)!. \
For us, the value is, `github.com/charmbracelet/glow/v2`

The second variable is `MODGO_VERSION`, which refers to the version of the go module we are building.\
And the version we are building,according to github is `v2.0.0`. 

Ultimately, the makefile looks like this 

``` makefile
COMMENT =       cli markdown renderer

MODGO_MODNAME =         github.com/charmbracelet/glow/v2

MODGO_VERSION = v2.0.0

DISTNAME =      glow-v2.0.0

CATEGORIES =    sysutils

HOMEPAGE =      https://github.com/charmbracelet/glow

MAINTAINER =            Neel Chakraborty <neelroboinfo365@gmail.com>

#MIT
PERMIT_PACKAGE =        Yes

MODULES =               lang/go

SEPARATE_BUILD =        Yes

.include "modules.inc"

.include <bsd.port.mk>
```
Wait! What is .include "modules.inc" doing there? And why is it there?\
Turns out, for go to compile our software, it needs help of some external modules\
We include those modules in `modules.inc`. \
Well, how do we generate that file?

Time to consult the man-pages again! \
Going through `go-module(5)`, towards the end, we find that 

>This module adds one make(1) target:

>modgo-gen-modules
    Generate the MODGO_MODULES and the MODGO_MODFILES lists. If MODGO_VERSION is set to "latest", the latest known-to-Go version of a package will be used to build the list of modules. Similarly, if MODGO_VERSION is empty, the latest version will be fetched. 

Well,well,well. Turns out the smart people at OpenBSD dev team has already done the \
hard part for us. We just need to run `make modgo-gen-modules > modules.inc` and we are done!

## `make makesum`,`make build` and friends 

Now we follow the usual porting checklist guide and go through generating a `pkg` dir and populating it with `DESCR`. \
Then we run `make build`, if it passes, then `make fake`, etc etc, you know the drill.(If you don't, read the [porting guide](https://www.openbsd.org/faq/ports/guide.html))

That's it. We have ported `glow` to OpenBSD. 



