(function(exports){
    exports.ourtest.adapter = {};
    exports.ourtest.adapter.request = function(op, callback){
        callback(op.data);
    };
})(typeof window != 'undefined' ? window : exports);
