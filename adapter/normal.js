(function(exports){
    exports.ourtest.adapter = {};
    exports.ourtest.adapter.request = function(op, callback){
        setTimeout(function(){
            callback(op.data);
        }, 1000);
    };
})(typeof window != 'undefined' ? window : exports);
