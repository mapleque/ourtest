(function(exports){
    // implement logger
    if (typeof exports.logger == 'undefined') {
        if (typeof exports.console != 'undefined') {
            exports.logger = exports.console;
        }
        if (typeof exports.alter != 'undefined') {
            exports.logger = {
                log : exports.alter,
                error : exports.alter
            };
        }
    }
    var logger = exports.logger;

    // check and init env
    if (typeof exports.ourtest != 'undefined') {
        // error report
        logger.error('there is another ourtest define, please check your envirourment');
    }
    exports.ourtest = {};
    // implement a ajax request
    var request = function(opt){
        // check url
        if (typeof opt.url == 'undefined') {
            logger.error('there must be a url property in request option');
            return;
        }
        // check method
        if (typeof opt.method == 'undefined') {
            opt.method = 'GET';
        } else if (typeof opt.method == 'string'){
            opt.method = opt.method.toUpperCase();
        }
        if (opt.method != 'GET' && opt.method != 'POST') {
            logger.error('unknow method [', opt.method, '] in request option');
            return;
        }
        var requestData = '';
        if (typeof opt.data == 'object') {
            var data = [];
            for (var key in opt.data) {
                data.push(key + '=' + JSON.stringify(opt.data[key]));
            }
            requestData = data.join('&');
        }
        var xmlHttp;
        if (exports.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (exports.XMLHttpRequest) {
            xmlHttp=new XMLHttpRequest();
        }
        var doGet = function(url, success, error){
            xmlHttp.open("GET", url);
            xmlHttp.send(null);
            xmlHttp.onreadystatechange = function() {
                if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
                    typeof success == 'function' && success(xmlHttp.responseText, xmlHttp);
                } else if (xmlHttp.readyState == 4){
                    typeof error == 'function' && error(xmlHttp.responseText, xmlHttp);
                }
            };
        };
        var doPost = function(url, data, success, error){
            xmlHttp.open("POST", url);
            xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xmlHttp.send(data);
            xmlHttp.onreadystatechange = function() {
                if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
                    typeof success == 'function' && success(xmlHttp.responseText, xmlHttp);
                } else if (xmlHttp.readyState == 4){
                    typeof error == 'function' && error(xmlHttp.responseText, xmlHttp);
                }
            };
        };
        switch (opt.method) {
            case 'GET':
                var url = opt.url;
                if (requestData != '') {
                    if (url.indexOf('?') >= 0) {
                        url += '&' + requestData;
                    } else {
                        url += '?' + requestData;
                    }
                }
                doGet(url, opt.success, opt.error);
                break;
            case 'POST':
                doPost(opt.url, requestData, opt.success, opt.error);
                break;
        }
    };
    exports.ourtest.request = request;
    // implement a require for browser
    var require = function(files, callback){
        var namespace = {};
        var total = 0;
        var fileObjs = {};
        if (files instanceof Array) {
            total = files.length;
            for (var i = 0; i < total; i++) {
                fileObjs[i] = files[i];
            }
        } else {
            for (var i in files) {
                total++;
            }
            fileObjs = files;
        }
        var finish = 0;
        var end = function(){
            finish++;
            if (finish >= total) {
                callback(namespace);
            }
        };
        for (var i in fileObjs) {
            (function(key, file){
                request({
                    url: file,
                    success: function(resp){
                        // add source url for debug
                        namespace[key] = eval(resp + '\n//# sourceURL=ourtest/' + file);
                        end();
                    }
                });
            })(i, fileObjs[i]);
        }
    };
    exports.ourtest.require = require;
    require([
        'core/view.js',
        'core/util.js',
        'core/model.js',
        'core/loader.js'
    ], function(){
        require({
            runtime : 'config/runtime.js',
            cases : 'config/cases.js'
        }, function(ns){
            require([
                ns.runtime.adapter
            ], function(){
                for (var i = 0; i < ns.cases.length; i++) {
                    exports.ourtest.loader.loadFile(ns.cases[i], function(file){
                        exports.ourtest.view.renderFile(file);
                        typeof chanel == 'object'
                            && typeof chanel.finish == 'function'
                            && chanel.finish();
                    });
                }
            });
        });

        // run cases interact
        exports.ourtest.view.addListener('run', function(file, chanel){
            file.run(chanel);
        });
    });
 })(typeof window != 'undefined' ? window : exports);
