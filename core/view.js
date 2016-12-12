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
        "<div id='" + file.name + "'>" +
        "<input type='submit' value='" + file.name + "' class='case'>" +
        "<span class='total'></span>" +
        "<span class='passed'></span>" +
        "<span class='faild'></span>" +
        "<div class='progress'>" +
        "<span class='passed-progress'></span>" +
        "<span class='faild-progress'></span>" +
        "</div>" +
        "<div class='report'></div>" +
        "</div>"
        exports.document.getElementById('tree').innerHTML = html;
        // run file
        exports.document.getElementsByClassName('case')[0].onclick = function(){
            start();
            var fileName = exports.document.getElementsByClassName('case')[0].value;
            typeof eventMap['run'] == 'function'
                && eventMap['run'](fileMap[fileName], {
                    addListenr:addListener,
                    report: function(type, op, msg){
                        switch (type) {
                            case 'progress':
                                progress(op, msg);
                                break;
                            case 'error':
                                error(op, msg);
                                break;
                            case 'debug':
                                //debug(op, msg);
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

    var renderCompare = function(tree, prefix){
        if (typeof prefix == 'undefined') {
            prefix = '    ';
        }
        var table = [];
        if (tree.child) {
            for (var key in tree.child) {
                table.push(renderCompare(tree.child[key], prefix + '    '));
            }
        } else if (typeof tree.result != 'undefined'){
            table.push('    ' + (tree.result? 'O': 'X') + prefix + tree.left + '    ' + tree.right);
        } else {
            return prefix + 'no compare property';
        }
        return table.join('\n');
    };

    var start = function(){
        exports.document.getElementsByClassName('report')[0].innerHTML = '';
    };

    var progress = function(op, msg){
        var passedWidth = msg.passed / msg.total * 100 + '%';
        var faildWidth = msg.faild / msg.total * 100 + '%';
        exports.document.getElementsByClassName('passed-progress')[0].style = 'width:' + passedWidth;
        exports.document.getElementsByClassName('faild-progress')[0].style = 'width:' + faildWidth;
        exports.document.getElementsByClassName('total')[0].innerHTML = 'Total:' + msg.total;
        exports.document.getElementsByClassName('passed')[0].innerHTML = 'Passed:' + msg.passed;
        exports.document.getElementsByClassName('faild')[0].innerHTML = 'Faild:' + msg.faild;
    };
    var debug = function(op, resp){
        exports.document.getElementsByClassName('report')[0].innerHTML +=
            '<pre class="debug">' +
            '[debug]' + op.url + ':' + resp + '\n' +
            'lineNumber:' + op.lineNumber + '\n' +
            'callStack:' + '\n' +
            op.callStack.join('\n') + '\n' +
            'compareTree:' + '\n' +
            renderCompare(op.compareTree) + '\n' +
            '</pre>';
    };
    var error = function(op, msg){
        exports.document.getElementsByClassName('report')[0].innerHTML +=
            '<pre class="error">' +
            '[error]' + op.url + ':' + msg + '\n' +
            'lineNumber:' + op.lineNumber + '\n' +
            'callStack:' + '\n' +
            op.callStack.join('\n') + '\n' +
            'compareTree:' + '\n' +
            renderCompare(op.compareTree) + '\n' +
            '</pre>';
    };
    var finish = function(){
    };
 })(typeof window != 'undefined' ? window : exports);
