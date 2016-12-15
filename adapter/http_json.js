(function(exports){
    exports.ourtest.adapter = {};
    exports.ourtest.adapter.request = function(op, callback){
        request({
            url:op.url,
            method:op.method,
            data:op.data,
            success:function(resp){
                try {
                    callback(JSON.parse(resp), true);
                } catch(e){
                    callback(e, false)
                }
            },
            error: function(msg){
                callback(msg, false);
            }
        });
    };
})(typeof window != 'undefined' ? window : exports);
