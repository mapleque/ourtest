This is a test service for web project.
In the service, all you need is telling me where is your cases.

The case should be programmed by javascript with following format:
```javascript
{
	   setup : [ <op>, ... ], // somthing before case run
	   cases : [ <op>, ... ], // case to be run
	teardown : [ <op>, ... ], // somthing after case run
}
```

And the "op object" defined here:
```
	<op> := [ <op>, ... ]
		  | { "parallel" : { (string)k : [ <op>, ... ], ...  } } // k is a parallel key
		  | {    "sleep" : (int)n } // sleep n millisecond
		  | {     "stop" : (string)s } // stop here and out put s
		  | {
			       "req" : _(h, p), // h is your api host and p is your api path.
			      "data" : (json)d, // d is your parameters to send
			    "assert" : (json)r, // if r is bool, it will be treat as assert, otherwise compare with response

			// optional properties
			       "method" : "POST"|"GET", // the request method, DEFAULT: GET
			      "hearder" : (json)h, // h is the request header. DEFAULT: empty
			  "contentType" : (content-type)ct // ct is the request data content type. DEFAULT: application/x-www-form-ulrencode.
			     "dataType" : (mime-type)mt, // mt is the response data mimetype. DEFAULT: judged from response header mime info.
			  "dataPredeal" : (func)dp, // dp is a function deal the request data before send. DEFAULT: do nothing.
			"assertPredeal" : (func)ap, // ap is a function deal the response data before assert. DEFAULT: do nothing.

```

--------

Extra, you can def your global config and context:
```javasript
{
	config:{
		default_op_properties:{ // all optional properties deafault value could be change here
		}
	},
	context:{ // declare your context during running case, then you can use it directly in case code and it will be independence between cases
	}
}
```

--------

Extra, you can provide your case running adapter instead of the default one by implement the interface:
```javascript
// case running adapter interface
```
