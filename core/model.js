(function(exports){
    exports.ourtest.File = function(fileName){
        this.name = fileName;
        var ops = [];
        var runOp = function(ops, chanel, index){
            if (!index) {
                index = 0;
            }
            if (index >= ops.length) {
                typeof chanel.finish == 'function' && chanel.finish();
                return;
            }
            ops[index].run(chanel, function(op){
                typeof chanel.report == 'function'
                    && chanel.report('progress', op, {
                        total:ops.length,
                        passed: index + 1
                    });
                runOp(ops, chanel, index+1);
            });
        };
        this.addOp = function(op){
            ops.push(op);
        };
        this.run = function(chanel){
            runOp(ops, chanel);
        };
    };

    exports.ourtest.Op = function(opt){
        var self = this;
        self.opt = opt;
        (function(opt){
            self.url = opt.url;
            self.callStack = opt.callStack;
            self.lineNumber = opt.lineNumber;
        })(opt);
        self.run = function(chanel, callback){
            if (typeof exports.ourtest.adapter == 'undefined'
                || typeof exports.ourtest.adapter.request != 'function') {
                chanel.report('error', self, 'adapter not found');
                callback(self);
                return;
            }
            exports.ourtest.adapter.request(self, function(resp){
                chanel.report('debug', self, resp);
                // TODO compare with assert
                callback(self);
            });
        };
    };
 })(typeof window != 'undefined' ? window : exports);
