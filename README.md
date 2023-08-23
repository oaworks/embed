# OA.Works embed

This is the OA.Works javascript embed. It provides functionality for various
services, at the moment including InstantILL and ShareYourPaper. It can be 
extended to support more OA.Works services in future.

There is only one file, oab_embed.js (and a minified version). It starts with 
some definitions of functions that are useful without using big libraries like 
jQuery. These are defined on the _OA prefix. Then there is the general embed 
functionality itself, defined on _oab. This includes functions that make calls 
to the OA.Works API. Any new functionality requried to make such calls should 
be added here.

Then there are css and html templates for each service that needs them - for 
example there is currently a shareyourpaper template and an instantill template.
New ones could be added later.

Next is the configure function. This is pretty complicated owing to a 
combination of old and new config situations. It should be simplifed to expect 
the config to be provided when the embed is instantiated on the web page it is 
embedded into, but for now it makes various loops to try to retrieve a config 
from the API, and these loops depend on timing of whether or not bootstrap 
css values are found in the page or not, and also whether or not a DOI is 
provided in the URL. The purpose here was to ensure that config setup is not 
delayed by requests, but also that requests triggered by the URL are not delayed 
by waiting for config to be retrieved.

After config there's just the declarations of the two services the embed 
currently provides, shareyourpaper and instantill. So either of these can be 
used on a web page by adding a script tag to the embed file, then within a 
javascript element on the page running the relevant service by instantiating 
it such as syp = shareyourpaper();

A config object can be provided at instantiation, see the source of the dev 
site for an example:

https://dev.shareyourpaper.org


## To deploy

Make changes in the develop branch. Once complete, commit the changes. 
SSH to the old (dev.)openaccessbutton.org server (ask sysadmin how to do this) 
and find the dev/oaworks/embed folder, and git pull. The embed itself 
is served through the website domain so switch to the dev/oaworks/website 
folder and run the node build.js command. This will rebuild the website and 
assets, including the embed via a symlink.

To deploy live, go to the live/oaworks/embed folder and git pull, git merge 
origin/develop, git push. Then go to live/oaworks/website and node build.js 
to update the live site assets.

## To run locally 

Simply create a static file containing rudimentary HTML markup (e.g. named `index.html`), place it at the root directory, and copy the following code into it, replacing text in `[brackets]` with the right information: 

```html 
<!DOCTYPE html>
<html dir="ltr" lang="en">

  <head>
    <meta charset="utf-8">
    <title>local embed test</title>
  </head>

 <body>

   <div id="shareyourpaper"></div>
   <script src="embed.js"></script> <script>_oab=shareyourpaper({api: '[ASK FOR API ACCESS]', uid: "[UID HERE]", config: { "owner": "[EMAIL HERE]" }});</script>

 </body>

</html>
``` 

You may now make any modifications to the `embed.js` code on your own branch and see your changes with every page refresh. 
