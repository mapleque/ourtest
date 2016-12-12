(function(exports){
    exports.ourtest.loader = {};
    var recordLine = function(){
        var lineNumber = -1;
        var callStack = [];
        return {
            lineNumber : lineNumber,
            callStack : callStack
        };
    };

    var loadFile = function(fileUrl, callback){
        exports.ourtest.request({
            url: fileUrl,
            success: function(code){
                var file = new exports.ourtest.File(fileUrl)
                var op = function(url, opt) {
                    var l = recordLine();
                    opt.lineNumber = l.lineNumber;
                    opt.callStack = l.callStack;
                    opt.url = url;
                    var oneOp = new exports.ourtest.Op(opt);
                    file.addOp(oneOp);
                };
                eval(code);
                callback(file);
            }
        });
    };
    exports.ourtest.loader.loadFile = loadFile;
 })(typeof window != 'undefined' ? window : exports);
