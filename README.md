newplayer
=========

Responsive learning content player by www.thenewgroup.com



Dev Notes:

High-level TBDs:

- finish menu component
	- Menu controller can getAll('Page')

- GTM component
	- req references presentation-specific dataLayer code?
	- inserts GTM code

- fix Column component or fork to Grid component
	- ltr flow, calc remaining widths for sub-components

- pass component data via attribute in npComponent directive (don't pull from $scope)

- whitelist core components and bake 'em into main script
	- core component naming convnetion: np-[type] (for folders, js and html)
	- try to keep them agnostic of eachother
	- component service doesn't load external js (incl req scripts?) for whitelisted core components

- recursively load manifests?
	- defaultManifest

- Event hooks?
	- manifest onLoad
	- manifest parsed - after initial manifest parse
	- components parsed
	- Ex:
		- Content.postParse appends lang (or blank if only one) to reroute var
		- Page.postParse appends pageId to reroute var
		- Router.postParse checks reroute var

