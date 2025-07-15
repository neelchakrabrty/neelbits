---
layout: ../../layouts/MarkdownPostLayout.astro
author: 'Neel Chakraborty'
title : 'Porting Zoxide to OpenBSD'
pubDate: 2024-09-10
tags : ["OpenBSD","Porting"]
---

I love [`zoxide`](https://github.com/ajeetdsouza/zoxide), but unfortunately it wasn't present present in OpenBSD,so, I spent the weekend porting `zoxide` to OpenBSD. \
This blog, is a summary of how I did it. This is my first contribution to OpenBSD and I learnt a lot of stuff in the process. 
## Building zoxide from scratch
Before writing the port, I wanted to see if I can compile `zoxide` from scratch on my base system. \
To start things, I needed to install rust toolchain,since `zoxide` is written in rust.\
The commmand to install `rust` in OpenBSD is 
``` shell
     pkg_add rust
```
### Fetch sources
To do that, we have to download the latest source code release from the github repo(or you can clone the github repo as well), and untar it
``` fish
    cd /tmp # I like building packages in /tmp
    curl -L https://github.com/ajeetdsouza/zoxide/archive/refs/tags/v0.9.4.tar.gz > zoxide.tar.gz # Downloads the package and saves it to zoxide.tar.gz
    tar -xzvf zoxide.tar.gz #untars the package
```
Now, all we have to do is build the package. \
For that, we just have to `cd` to the package directory and run `cargo build --release`.

``` fish
    cd /tmp/zoxide-0.9.4 #Assuming you're building in /tmp, or just cd to wherever you untar the source files
    cargo build --release
```
Now, if everything went well, you should see the following output from running `cargo build --release`
### Build
```fish
  Updating crates.io index
  Downloaded askama_escape v0.10.3
  Downloaded libc v0.2.153
  Downloaded askama_derive v0.12.5
  Downloaded askama v0.12.1
  Downloaded askama_parser v0.2.1
  Downloaded 5 crates (818.4 KB) in 0.35s
   Compiling proc-macro2 v1.0.78
   Compiling unicode-ident v1.0.12
   Compiling version_check v0.9.4
   Compiling minimal-lexical v0.2.1
   Compiling heck v0.4.1
   Compiling memchr v2.7.1
   Compiling utf8parse v0.2.1
   Compiling anstyle-query v1.0.2
   Compiling colorchoice v1.0.0
   Compiling anstyle v1.0.6
   Compiling syn v1.0.109
   Compiling clap_lex v0.7.0
   Compiling strsim v0.11.0
   Compiling libc v0.2.153
   Compiling either v1.10.0
   Compiling anstyle-parse v0.2.3
   Compiling serde v1.0.197
   Compiling mime v0.3.17
   Compiling anstream v0.6.12
   Compiling yansi v1.0.0-rc.1
   Compiling itertools v0.12.1
   Compiling option-ext v0.2.0
   Compiling anyhow v1.0.80
   Compiling askama_escape v0.10.3
   Compiling nom v7.1.3
   Compiling clap_builder v4.5.1
   Compiling unicase v2.7.0
   Compiling proc-macro2-diagnostics v0.10.1
   Compiling cfg-if v1.0.0
   Compiling static_assertions v1.1.0
   Compiling bitflags v2.4.2
   Compiling aliasable v0.1.3
   Compiling glob v0.3.1
   Compiling dunce v1.0.4
   Compiling fastrand v2.0.1
   Compiling mime_guess v2.0.4
   Compiling quote v1.0.35
   Compiling syn v2.0.50
   Compiling dirs-sys v0.4.1
   Compiling nix v0.27.1
   Compiling dirs v5.0.1
   Compiling askama_parser v0.2.1
   Compiling color-print-proc-macro v0.3.5
   Compiling color-print v0.3.5
   Compiling clap_derive v4.5.0
   Compiling serde_derive v1.0.197
   Compiling ouroboros_macro v0.18.3
   Compiling askama_derive v0.12.5
   Compiling askama v0.12.1
   Compiling ouroboros v0.18.3
   Compiling clap v4.5.1
   Compiling clap_complete v4.5.1
   Compiling clap_complete_fig v4.5.0
   Compiling zoxide v0.9.4 (/tmp/zoxide-0.9.4)
   Compiling bincode v1.3.3
    Finished release [optimized] target(s) in 27.65s
```
### Run

The binary is stored in `target/release`, still do check that the binary is present by running the following command

``` fish
    ls target/release/zoxide
```
You should get the following output
``` fish
    target/release/zoxide*
```
Check that the binary is running by issuing the following command 

``` fish
    ./target/release/zoxide 
```
You should get the following output
``` fish
zoxide 0.9.4
Ajeet D'Souza <98ajeet@gmail.com>
https://github.com/ajeetdsouza/zoxide

A smarter cd command for your terminal

Usage:
  zoxide <COMMAND>

Commands:
  add     Add a new directory or increment its rank
  edit    Edit the database
  import  Import entries from another application
  init    Generate shell configuration
  query   Search for a directory in the database
  remove  Remove a directory from the database

Options:
  -h, --help     Print help
  -V, --version  Print version

Environment variables:
  _ZO_DATA_DIR          Path for zoxide data files
  _ZO_ECHO              Print the matched directory before navigating to it when set to 1
  _ZO_EXCLUDE_DIRS      List of directory globs to be excluded
  _ZO_FZF_OPTS          Custom flags to pass to fzf
  _ZO_MAXAGE            Maximum total age after which entries start getting deleted
  _ZO_RESOLVE_SYMLINKS  Resolve symlinks when storing paths
```
Also, check the binary by issuing other commands too. \
Now that we have successfully compiled `zoxide` from scratch, it is time to write a port for it.\
Before we get started writing a port for it, I recommend that the reader goes through the [OpenBSD Porter's Handbook](https://www.openbsd.org/faq/ports/).\
It is a brilliantly written document, and does cover everything one needs to know to contribute a port to OpenBSD. \
We will follow the handbook, so please make sure you've given it a proper read 3 to 4 times. 

## Writing a port for Zoxide
### Preparing the user 
#### Adding user to wsrc
Run the following command as root
``` fish
    user mod -G wsrc yourusername
```
#### Enabling doas
Make sure you have enabled `doas` by copying `/etc/examples/doas.conf` to `/etc/doas.conf`
Run the following commands as root
``` fish
    cp /etc/examples/doas.conf /etc
```
Now, allow larry with `permit`,`keepenv` and `persist` options enabled in `/etc/doas.conf`
For example, this is how my `/etc/doas.conf` looks
``` doas
doas (larry@Zeus.my.domain) password: 
# $OpenBSD: doas.conf,v 1.1 2016/09/03 11:58:32 pirofti Exp $
# Configuration sample file for doas(1).
# See doas.conf(5) for syntax and examples.

# Non-exhaustive list of variables needed to build release(8) and ports(7)
#permit nopass setenv { \
#    FTPMODE PKG_CACHE PKG_PATH SM_PATH SSH_AUTH_SOCK \
#    DESTDIR DISTDIR FETCH_CMD FLAVOR GROUP MAKE MAKECONF \
#    MULTI_PACKAGES NOMAN OKAY_FILES OWNER PKG_DBDIR \
#    PKG_DESTDIR PKG_TMPDIR PORTSDIR RELEASEDIR SHARED_ONLY \
#    SUBPACKAGE WRKOBJDIR SUDO_PORT_V1 } :wsrc


permit keepenv persist larry
```
### Fetching the ports tree

Before we begin writing the port, we need to fetch the ports tree by issuing the following command

```fish
    $ cd /tmp 
    $ ftp https://cdn.openbsd.org/pub/OpenBSD/$(uname -r)/{ports.tar.gz,SHA256.sig}
    $ signify -Cp /etc/signify/openbsd-$(uname -r | cut -c 1,3)-base.pub -x SHA256.sig ports.tar.gz
```
Now, untar the ports tree in the `/usr/` directory. Run the following commands as `root` or with 

```fish
     cd /usr
     tar xzf /tmp/ports.tar.gz
```
If you want to configure the ports system further, I recommmend that you go through [Configuration of the Ports System](https://www.openbsd.org/faq/ports/ports.html#PortsConfig) on the OpenBSD Porter's Handbook. 



### Writing the Makefile
#### Picking a category
According to step 4 of [Porting Checklist](https://www.openbsd.org/faq/ports/guide.html#PortsChecklist). We have to pick a primary category for our port and import the infrastructure. \
I have picked the category `sysutils`. We will have to make a `zoxide` directory under `/usr/port/sysutils` directory. 

```fish 
    cd /usr/ports/sysutils
    mkdir zoxide
```
#### Importing infrastructure 

Now, we are ready to import the infrastructure to `/usr/ports/sysutils/zoxide`. We just need to copy `MAKEFILE.template` from `/usr/ports/infrastructure/templates/Makefile.template`\
to our port directory
``` fish 
    cd /usr/ports/sysutils/zoxide/
    cp /usr/ports/infrastructure/templates/Makefile.template Makefile
```
### Writing the Makefile

The `Makefile.template` is fairly well documented with comments in the Makefile. So, I won't be going over every option.\
However, I will go over a few options to explain what they do. If you want to learn more, I recommend that you consult `port-modules(5)`,`port(7)`,`bsd.port.mk(5)`.\
This is what my Makefile looks like 

```Makefile
    COMMENT	=	replacement for cd with history searching

    DIST_TUPLE	=	github ajeetdsouza zoxide v0.9.4 .

    CATEGORIES	=	sysutils

    MAINTAINER	=	Neel Chakraborty <neelroboinfo365@gmail.com>

    # MIT
    PERMIT_PACKAGE	=	Yes

    WANTLIB	=	${MODCARGO_WANTLIB}

    MODULES	=	devel/cargo

    SEPARATE_BUILD	=	Yes

    CONFIGURE_STYLE	=	cargo

    post-install:
	    ${INSTALL_MAN} ${WRKSRC}/man/man1/*.1 ${PREFIX}/man/man1/


    .include "crates.inc"

    .include <bsd.port.mk>
```
For the time being, forget about `.include "crates.inc"`.

#### What does the `MODULES` variable do?
From the description of `bsd.port.mk(5)` 
>   bsd.port.mk contains the `ports(7)` tree `make(1)` framework, in the form of documented public targets, variables and paths.

>   The actual `bsd.port.mk` file lives under `${PORTSDIR}/infrastructure/mk`, with `make(1)`'s system include file redirecting to it.

>   Optional parts of this framework have been moved to `port-modules(5)` in an effort to shrink the main file.

Thus the `MODULES` variable provides an external modules mechanism, providing us with tools that will help to build our program.\
For our example, `the devel/cargo` module automates download and compilation of dependencies of a Rust project using `cargo(1).`\
For more information,consult `cargo-module(5)`.


#### What does the `WANTLIB` variable do? And what is `${MODCARGO_WANTLIB}`?
The `WANTLIB` vairable contains a list of library specifications that a package will need. \
The `MODCARGO_WANTLIB` variable defined by our module above,defines architecture-specific WANTLIB entries required by all Rust code.\
For more information,consult `cargo-module(5)`. 

#### What does `SEPARATE_BUILD` do?

It's self-explanatory, it generates a separate `$WRKBUILD` to build our port. 

#### What does `CONFIGURE_STYLE` do?

Sets the style of configuration that needs to happen.\
In our case, setting `cargo` handles everything. 

Study `port-modules(5)`,`port(7)`,`bsd.port.mk(5)`, and `cargo-module(5)`(for ports to build with Cargo) to gain a deeper understanding of the Makefile

Now, let's talk about `.include "crates.inc"`.\
This file, resides within your port directory, containing all the `MODCARGO_CRATES`. \
`MODCARGO_CRATES` is a variable defining all the crates that will be downloaded by the module.

I didn't know any better so I generated the file by hand. But you don't have to go through the same pain. \
`cargo-module(5)` provides a `make` target called `modcargo-gen-crates` and `modcargo-gen-crates-licenses` and we will use that to populate our `crates.inc` file\
Simply run:-


``` fish
    cd /usr/ports/sysutils/zoxide
    make modcargo-gen-crates-licenses > crates.inc
```
And we are done writing the Makefile.



### Building the Port. 

Now, we are ready to run `make build`

``` fish
    cd /usr/ports/sysutils/zoxide
    make makesum
    make build
```
If everything goes well, the port will go all the way through without errors. Otherwise, we will be in a cycle of `make build`,edit source code, generate a patch using `make update-patches` and `make clean patch`. 

#### Adding pkg/DESCR 
According to point 19 of the [OpenBSD Porting Checklist](https://www.openbsd.org/faq/ports/guide.html#PortsChecklist), we have to add a package description.
``` fish
    mkdir pkg
    touch pkg/DESCR
    vi pkg/DESCR #Add your description
```
#### Adding pkg/PLIST

According to step 21 to 24 of the [OpenBSD Porting Checklist](https://www.openbsd.org/faq/ports/guide.html#PortsChecklist). We have to run `make fake` and update the `PLIST`. It's very simple to do 

``` fish
    make fake
    touch pkg/PLIST
    make update-plist
```
Now, we are almost done . I also wanted to add a message at the end of `make install`. So, I did the following

``` fish
    touch pkg/MESSAGE
    vi pkg/MESSAGE #Add your message to be shown after running make-install
```
#### Checking `make package`,`make install`,`make uninstall` and `make clean`

Run the following commands and make sure they succeed

``` fish
    make package
    make install
    #At this point check whether your port is working, in our case Zoxide
    make uninstall
```

If everything goes well, `zoxide` should be installed and ready for usage. 

### Sending the port to OpenBSD ports mailing list 

Now, just create a gzipped tarball of your port, and mail it to the ports mailing list. 

That's all for today's blog