(function(exports){
    exports.ourtest.view = {};
    // event map:
    // load:function(caseFile)
    // run:function(cases, chanel)
    var eventMap = {};
    var addListener = function(key, method){
        eventMap[key] = method;
    };
    exports.ourtest.view.addListener = addListener;
    var fileMap = {};
    var renderFile= function(file){
        fileMap[file.name] = file;
        // file view
        var html = "" +
        "<div>" +
        "<input type='submit', value='" + file.name + "' id='run'>" +
        "<div id='report'></div>" + 
        "</div>"
        exports.document.getElementById('tree').innerHTML = html;
        // run file
        exports.document.getElementById('run').onclick = function(){
            var fileName = exports.document.getElementById('run').value;
            typeof eventMap['run'] == 'function'
                && eventMap['run'](fileMap[fileName], {
                    addListenr:addListener,
                    report: function(type, op, msg){
                        switch (type) {
                            case 'progress':
                                report(op, msg);
                                break;
                            case 'error':
                                error(op, msg);
                                break;
                            case 'debug':
                                error(op, msg);
                                break;
                            default:
                                error(op, msg);
                        }
                    },
                    finish: function(){
                        finish();
                    }
                });
        };
    };
    exports.ourtest.view.renderFile = renderFile;

    var initPage = function(){
        // init page view
        var html = "" +
            "<div>" +
            "config your case file or path here " +
            "<input type='text' id='file' value='cases/basic.js'>" +
            "<input type='submit' value='load' id='load'>" +
            "</div>" +
            "<div id='tree'></div>";
        exports.document.getElementById('content').innerHTML = html;
        // load event
        exports.document.getElementById('load').onclick = function(){
            var file = exports.document.getElementById('file').value;
            typeof eventMap['load'] == 'function' && eventMap['load'](file)
        };
    };
    exports.ourtest.view.initPage = initPage;

    var report = function(op, msg){
        exports.document.getElementById('report').innerHTML
            += '<p>[report]' + op.url + ' ' + msg.passed+ '/' + msg.total;
    };
    var error = function(op, msg){
        exports.document.getElementById('report').innerHTML
            += '<p>[error]' + op.url + ':' + msg;
    };
    var finish = function(){
        exports.document.getElementById('report').innerHTML
            += '<p>[finish]';
    };
 })(typeof window != 'undefined' ? window : exports);
