//@ sourceURL=ourtest/main.js
(function(exports){
    // implement logger
    if (typeof exports.logger == 'undefined') {
        if (typeof exports.console != 'undefined') {
            exports.logger = exports.console;
        }
        if (typeof exports.alter != 'undefined') {
            exports.logger = {
                log : exports.alter
            };
        }
    }
    var logger = exports.logger;

    // check and init env
    if (typeof exports.ourtest != 'undefined') {
        // error report
        logger.log('there is another ourtest define, please check your envirourment');
    }
    exports.ourtest = {};
    // implement a require for browser
    var require = function(file){
    };
    exports.ourtest.require = require;
    require('core/view.js');
    require('core/util.js');
    require('core/op.js');
    require('core/case.js');
    require('core/load.js');
 })(typeof window != 'undefined' ? window : exports);
