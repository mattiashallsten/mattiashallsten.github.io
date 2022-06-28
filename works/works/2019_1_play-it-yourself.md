---
title: Play it Yourself
date: 2018-2019
tags: installation
desc: Interactive audio installation
vimeo: 368276239
---
_Play it Yourself_ is an interactive installation where the visitors
control a <a href="https://en.wikipedia.org/wiki/Disklavier"
target="_blank">Yamaha Disklavier</a> using their smartphones.

Technically, the installation is a node.js application running a HTTP
server that in turn sends OSC messages to a Pure Data patch. The Pure
Data patch then generates MIDI notes and control signals that it sends
to the Disklavier.

All the code used in the installation is free and open source, and is
avaiable on <a
href="https://github.com/mattiashallsten/playityourself"
target="_blank">GitHub</a>.
