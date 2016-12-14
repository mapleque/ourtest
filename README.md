# Ourtest

This is a test service for web project.
Deploy this service under your domain, and all you need is telling me where is your cases.

The case should be programmed by javascript with following format:
```javascript
[ <op>, ... ], // case to be run
```

And the "op object" defined here:
```
<op> := [ <op>, ... ]
      | { "parallel" : { (string)k : [ <op>, ... ], ...  } } // k is a parallel key
      | {    "sleep" : (int)n } // sleep n millisecond
      | {     "stop" : (string)s } // stop here and out put s
      | {
               "req" : post(h, p),
                     | get(h, p), // h is your api host and p is your api path, get or post is the http method
              "data" : (json)d, // d is your parameters to send
            "assert" : (json)r, // if r is bool, it will be treat as assert result, otherwise compare with response

        // optional properties
              "hearder" : (json)h, // h is the request header. DEFAULT: empty
          "contentType" : (content-type)ct // ct is the request data content type. DEFAULT: application/x-www-form-ulrencode.
             "dataType" : (mime-type)mt, // mt is the response data mimetype. DEFAULT: judged from response header mime info.
          "dataPredeal" : (func)dp, // dp is a function deal the request data before send. DEFAULT: do nothing.
        "assertPredeal" : (func)ap, // ap is a function deal the response data before assert. DEFAULT: do nothing.
        }
```

--------

Extra, you can define your runtime config in ```config/runtime.js```:
```javasript
runtime = {
    adapter:'adapter/normal.js'         # an adapter file implement adapter interface
}
```
And list your cases files in ```config/cases.js```:
```javasript
[
    'cases/basic.js',                    # the case file
    // ...
]
```

--------

Extra, you can provide your case running adapter instead of the default one by implement the interface:
```javascript
// case running adapter interface
(function(exports){
    exports.ourtest.adapter = {};
    exports.ourtest.adapter.request = function(op, callback){
        // TODO deal with op and callback(response)
    };
})(typeof window != 'undefined' ? window : exports);
```

--------

The project file tree:
```
|- index.html       # main page for everyting
|- adapter
|   |- normal.js    # normal run method implement running adapter interface
|- core
|   |- main.js      # initial method
|   |- view.js      # page view render method
|   |- util.js      # util method
|   |- model.js     # base object
|   |- loader.js    # load file method
|- config
|   |- cases.js     # config the cases file
|   |- runtime.js   # config runtime properties
|- README.md        # this file
```
