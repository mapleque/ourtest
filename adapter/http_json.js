(function(exports){
    exports.ourtest.adapter = {};
    exports.ourtest.adapter.request = function(op, callback){
        var data = op.processData(op.data);
        if (typeof op.dataPredeal == 'function'){
            op.dataPredeal(data);
        }
        request({
            url:op.url,
            method:op.method,
            data:data,
            success:function(resp){
                try {
                    resp = JSON.parse(resp);
                    if (typeof op.assertPredeal == 'function') {
                        resp= op.assertPredeal(resp);
                    }
                    callback(resp, true);
                } catch(e){
                    callback(e, false, resp)
                }
            },
            error: function(msg){
                callback(msg, false);
            }
        });
    };
})(typeof window != 'undefined' ? window : exports);
