newplayer
=========

Responsive learning content player by www.thenewgroup.com



Dev Notes:

High-level TBDs:

- fix lang/page routing
	- determine default lang & page if only manifest is specified
		- Router needs variable that triggers reroute if populated?
		- Content & Page components need hooks
			- postParse( manifest ) after initial manifest parse
				- Content.postParse appends lang (or blank if only one) to reroute var
				- Page.postParse appends pageId to reroute var

- finish menu component
	- Menu controller can getAll('Page')

- data massaging component (can it be generic?)
	- define another format for replacing module values!?
	- recursively load manifests?
		- defaultManifest

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

- abstract method "getId" available to components?
	- overriden by components to set smart IDs when not in manifest.

