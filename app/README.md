NewPlayer App Notes
===================

#### Overview

The NewPlayer is an extensible angular application that generates a html presentation from a json manifest file.

##### Manifest

The json manifest is formatted as a nested series of various NewPlayer component objects.
The layout of the presentation is determined by the nesting order of the components.
NewPlayer uses the *type* of each component to determine how to parse the component's *data* and render the html output.
Here is a sample manifest:

		[{
			"type": "npColumn",
			"components": [
				{
					"type": "npHTML",
					"data": {
						"content": "<h1>Example</h1>"
					},
					"components": []
				},
				{
					"type": "npImage",
					"data": {
						"src": "//lorempixel.com/400/200/nature",
						"alt": "nature"
					},
					"components": []        
				}
			]        
		}]


#### TBDs & random thoughts:

- GTM component
	- req references presentation-specific dataLayer code?
	- inserts GTM code

- pass component data via attribute in npComponent directive (don't pull from $scope)

- whitelist core components and bake 'em into main script
	- core component naming convnetion: np-\[type\] (for folders, js and html)
	- try to keep them agnostic of eachother
	- component service doesn't load external js (incl req scripts?) for whitelisted core components

- npColumn - add optional % attr - array? [25,75]

- recursively load/overwrite multiple manifests?
	- defaultManifest

- Event hooks?
	- manifest onLoad
	- manifest parsed - after initial manifest parse
	- components parsed
	- Ex:
		- Content.postParse appends lang (or blank if only one) to reroute var
		- Page.postParse appends pageId to reroute var
		- Router.postParse checks reroute var
