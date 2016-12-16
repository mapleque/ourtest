(function(exports){
    exports.ourtest.adapter = {};
    exports.ourtest.adapter.request = function(op, callback){
        var data = op.processData(op.data);
        if (typeof op.dataPredeal == 'function'){
            op.dataPredeal(data);
        }
        var resp = data;
        setTimeout(function(){
            if (typeof op.assertPredeal == 'function') {
                resp= op.assertPredeal(resp);
            }
            callback(resp, true);
        }, 1000);
    };
})(typeof window != 'undefined' ? window : exports);
