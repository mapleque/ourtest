(function(exports){
    exports.ourtest.File = function(fileName){
        var self = this;
        self.name = fileName;
        self.progress = {};

        var ops = [];
        var runOp = function(ops, chanel, index){
            if (!index) {
                index = 0;
            }
            if (index >= ops.length) {
                typeof chanel.finish == 'function' && chanel.finish();
                return;
            }
            ops[index].run(chanel, function(op, success){
                if (success) {
                    self.progress.passed++;
                } else {
                    self.progress.faild++;
                }
                typeof chanel.report == 'function'
                    && chanel.report('progress', op, self.progress);
                runOp(ops, chanel, index+1);
            });
        };
        self.addOp = function(op){
            ops.push(op);
        };
        self.run = function(chanel){
            self.progress = {
                total : ops.length,
                passed : 0,
                faild : 0
            };
            runOp(ops, chanel);
        };
    };

    exports.ourtest.Op = function(opt){
        var self = this;
        self.opt = opt;
        if (typeof opt == 'object') {
            if (typeof opt.parallel != 'undefined') {
                self.type = 'parallel';
            } else if (typeof opt.sleep != 'undefined') {
                self.type = 'stop';
            } else if (typeof opt.stop != 'undefined') {
                self.type = 'stop';
            } else if (typeof opt.req != 'undefined') {
                self.type = 'req';
                self.url = opt.req.url;
                self.method = opt.req.method;
                self.callStack = opt.req.callStack;
                self.lineNumber = opt.req.lineNumber;
                self.data = opt.data || {};
                self.assert = opt.assert;
                self.header = opt.header;
                self.contentType = opt.contentType;
                self.dataType = opt.dataType;
                self.dataPredeal = opt.dataPredeal;
                self.assertPredeal = opt.assertPredeal;
                self.compareTree = {};
            } else {
                self.type = 'unknown';
            }
        }

        self.run = function(chanel, callback){
            switch (self.type) {
                case 'req':
                    runReq(chanel, callback);
                    break;
                default:
                    chanel.report('error', self, 'unknown op type');
                    callback(self, false);
                    return;
            }
        };
        var compare = function(a, b){
            var tree = {};
            if (typeof a == 'function') {
                a = a(b);
            }
            if (typeof b == 'function') {
                b = b(a);
            }
            if (typeof a == 'string' && typeof b == 'string') {
                tree.left = a;
                tree.right = b;
                tree.result = a == b;
                return tree;
            } else if (typeof a == 'number' && typeof b == 'number') {
                tree.left = a;
                tree.right = b;
                tree.result = a == b;
                return tree;
            } else if (typeof a == 'object' && typeof b == 'object') {
                var child = {};
                var result = true;
                for (var i in a) {
                    var ret = compare(a[i],b[i]);
                    if (!ret.result) {
                        result = false;
                    }
                    child[i] = {
                        left : a[i],
                        right : b[i],
                        result : ret.result
                    };
                }
                for (var i in b) {
                    if (!child.hasOwnProperty(i)) {
                        var ret = compare(a[i],b[i]);
                        if (!ret.result) {
                            result = false;
                        }
                        child[i] = {
                            left : a[i],
                            right : b[i],
                            result : ret.result
                        };
                    }
                }
                tree.child = child;
                tree.result = result;
                return tree;
            } else {
                tree.left = typeof a;
                tree.right = typeof b;
                tree.result = false;
                return tree;
            }
        };
        var assert = function(){
            if (typeof self.assert == 'undefined') {
                return true;
            } else if (typeof self.assert == 'boolean') {
                return self.assert;
            } else {
                var ret = compare(self.response, self.assert);
                self.compareTree = ret;
                return ret.result;
            }
        };

        var runReq = function(chanel, callback){
            if (typeof exports.ourtest.adapter == 'undefined'
                || typeof exports.ourtest.adapter.request != 'function') {
                chanel.report('error', self, 'adapter not found');
                callback(self, false);
                return;
            }

            exports.ourtest.adapter.request(self, function(resp){
                self.response = resp;
                if (typeof self.assertPredeal == 'function') {
                    self.response = self.assertPredeal(resp);
                }
                var ret = assert();
                chanel.report('debug', self, JSON.stringify(resp));
                callback(self, ret);
            });
        };
    };
 })(typeof window != 'undefined' ? window : exports);
