NewPlayer Components
====================

#### Overview

This folder contains all of the components that are specified in the manifest and rendered by the NewPlayer application.
When the manifest indicates that a specific component should be rendered, the NewPlayer application retrieves its rendering instructions and template from the files in the corresponding component type folder.
Therefore, each component folder minimally contains  two files with names that match the component type:

1. a js file (ex: npImage.js) with angular module code for component-specific processing logic;
1. an HTML file (ex: npImage.html) that serves as a template for the component.

New components can be added to this folder and referenced by the manifest without needing to rebuild the application.
NewPlayer will render whatever components are contained in the manifest.
All component are optional--that is, a valid manifest does not need to contain any specific component--though some component types interact with other types.
Components that are never specified in the manifest are never loaded, avoiding the unnecesarry overhead of loading unused code.
Subsequent calls to components that have already been loaded are pulled from angular's cache.

The following is a work-in-progress list of maintained components with brief descriptions:

- [npFeature](npFeature/) - wrapper for the entire manifest
- [npContent](npContent/) - wrapper for language-specific components
- [npPage](npPage/) - wrapper for components that are segmented into a single "page" of the presentation
- [npHeader](npHeader/) - wrapper for components that would make up header content
- [npFooter](npFooter/) - wrapper for components that would make up footer content
- [npMenu](npMenu/) - renders a menu list of links (by default, derrived from the npPage components in the manifest)
- [npColumn](npColumn/) - renders sub-components  into columns
- [npHTML](npHTML/) - renders arbitrary HTML content
- [npImage](npImage/) - renders an image
- [npVideo](npVideo/) - renders video content
- [npQuestion](npQuestion/) - renders a form with npAnswer sub-components
- [npAnswer](npAnswer/) - renders an input field
- [npButton](npButton/) - renders a button

