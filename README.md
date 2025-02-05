# Docs.websockets-topgg.com

This is the docs for websocket-topgg.com, its in early stages right now.

## Structure

The goal is to use entirely SSG/Static pages.

Inside of `src/app` contains the dynamic routes, routes use generateStaticParams.
Inside of `src/docs` contains the static markdown files that are converted into pages. The file structure tells routes how to organize them.
Docs are organized as `/category/version/pages` The files in side the version are named in a specific way. `index.mdx` is the main route, other files start with `xx-` where xx is a number, its followed by the page name.


## Contributing
When contributing make sure to only modify the docs or pages.


## To Do
- Add more of a guide format
- Update select-version and select-platform to be dynamic.
- Clean up old code from older versions
- Fix mdx-components(this is a mismash of old and new components)



