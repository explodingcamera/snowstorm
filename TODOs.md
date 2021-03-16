## TODO's
* We can optimize page loading speed by using something like `<link rel="modulepreload" href="./pages/{currentPage}.js">`
  * Use Rollup for production
* add basepath support
  * currently we have absolute stuff hardcoded all over the place, wouters basepath support should hopefully help a lot
* Routing only works on pageload rn, add page transitions :p