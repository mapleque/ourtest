(function(exports){
    exports.ourtest.adapter = {};
    exports.ourtest.adapter.request = function(op, callback){
        request({
            url:url,
            method:method,
            data:data,
            success:function(resp){
                callback(resp, true);
            },
            error: function(msg){
                callback(msg, false);
            }
        });
    };
})(typeof window != 'undefined' ? window : exports);
