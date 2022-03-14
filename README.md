# OA.Works embed

This is the OA.Works javascript embed. It provides functionality for various
services, at the moment including InstantILL and ShareYourPaper. It can be 
extended to support more OA.Works services in future.

There is only one file, oab_embed.js (and a minified version). It starts with 
some definitions of functions that are useful without using big libraries like 
jQuery. These are defined on the _OA prefix. Then there is the general embed 
functionality itself, defined on _oab