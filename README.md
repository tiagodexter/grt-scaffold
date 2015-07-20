# GRT-scaffold

It was wrote with [NodeJS](http://www.nodejs.org) with [Sails.js](http://www.sailsjs.org) Framework.

For installation on your project just add using npm:
```
$ cd your project
$ npm install grt-scaffold
```

How to use?
```
$ cd your project/node_modules/grt-scaffold
$ node grt-scaffold.js -d controller:../../api/controllers -d view:../../views -a -t twitter -f ../../api/models/yourModel.js
```

List of options commands:

```
Usage: grt-scaffold [options] [option value] type
Attention: Remeber to enable the Bootstrap in your layout

Options:
       --version       Display the current version.
   -h, --help          Display help and usage details.
   -t  --type	       View type of Bootstrap
   -c  --controller    Generate Controller
   -v  --view	       Generate View
   -a  --all	       Generate all
   -f  --file          File to read
   -d  --dest	       Parameter to destination dir ( colon [view|controller] ) Ex: Controller,View

Option Value:
   -t:
       (google|twitter)
```
