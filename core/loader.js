(function(exports){
    exports.ourtest.loader = {};
    var recordLine = function(){
        var error = new Error();
        var stack = error.stack.split('\n');
        // remove Error
        stack.shift();
        // remove first 2 line stack method call
        stack.shift();
        stack.shift();
        // remove last 2 line frame method call
        stack.pop();
        stack.pop();

        var lineNumber = -1;
        for (var i in stack) {
            var reg = RegExp('\\((.*?):(\\d+):(\\d+)\\)$');
            var match = reg.exec(stack[i]);
            if (match) {
                lineNumber = match[2];
            }
        }
        return {
            lineNumber : lineNumber,
            callStack : stack
        };
    };

    var loadFile = function(fileUrl, callback){
        exports.ourtest.request({
            url: fileUrl,
            success: function(code){
                var file = new exports.ourtest.File(fileUrl)
                var get = function(path, api) {
                    var l = recordLine();
                    var opt = {};
                    opt.lineNumber = l.lineNumber;
                    opt.callStack = l.callStack;
                    opt.url = path + '/' + api;
                    opt.method = 'GET';
                    return opt;
                };
                var post = function(path, api) {
                    var l = recordLine();
                    var opt = {};
                    opt.lineNumber = l.lineNumber;
                    opt.callStack = l.callStack;
                    opt.url = '/' + path + '/' + api;
                    opt.method = 'POST';
                    return opt;
                };
                var ops = eval(code + '\n//# sourceURL=' + fileUrl);
                for (var i in ops) {
                    var op = new exports.ourtest.Op(ops[i]);
                    file.addOp(op);
                }
                callback(file);
            }
        });
    };
    exports.ourtest.loader.loadFile = loadFile;
 })(typeof window != 'undefined' ? window : exports);
