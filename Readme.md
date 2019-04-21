# Read me
The project is aimed to create a locally installed tool, to helper developers to generate UI codes from templates.
It's designed to be installable as a global npm package, but current haven't publish to public npm registry. Instead it's published to NJ local nexus-npm-registry.

![uncached image](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/guanpu/woodcut/master/explain.pu?token=ABMYMZMUK2ZGBLAI2DEEPMC4XPTMM)


# How to
## Install
To use it, configure you local registry:
`npm config set registry http://10.113.49.221:5800/repository/npm-public/`
and then
`npm install -g woodcut`
## Generate code
first, in your project root, add two folder and corresponding sub-folders/files like:
```
|-OJET project
  |-templates
    |- views
      |- crud.js
    |- viewModels
      |- crud.html
    |- config.json
  |-models
    |- entity.json
    ...
```
You can copy from this project as a sample. Of course, it's designed that you create your own templates and define entities. Then configure it in the config.json file.
As long as the templates and models are defined properly there, run `woodcut` at your project root folder.
Now check `src/js/views` and `src/js/viewModels` to see what you need.
With proper tweak on Router and start up the app with `ojet serve`, the results would be directly visible.

## Configuration
In the `templates/config.json`, you can specify the template name to work on.

## Write your own template
Templates are just like ordinary view&viewmodel files, i.e. *.js & *.html. Replace those 'entity' specific properties with '__' as wrapper. Currently the only supported advanced control flow keywords include "foreach" and "if" which I think is self-explained, and the stereotype keywords only support "form" which would extract HTML widgets from templates/form.html to use predefined HTML snippets.
