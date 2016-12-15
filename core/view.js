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
        "<div class='running'></div>" +
        "<div class='report'></div>" +
        "</div>";
        $('#tree').append(html);
        // run file
        $('#tree').find('.case').click(function(self){
            var dom = self.parent();
            start(dom);
            var fileName = self.val();
            typeof eventMap['run'] == 'function'
                && eventMap['run'](fileMap[fileName], {
                    addListenr:addListener,
                    report: function(type, op, msg){
                        switch (type) {
                            case 'progress':
                                progress(dom, op, msg);
                                break;
                            case 'error':
                                error(dom, op, msg);
                                break;
                            case 'debug':
                                //debug(dom, op, msg);
                                break;
                            default:
                                error(dom, op, msg);
                        }
                    },
                    finish: function(){
                        finish(dom);
                    }
                });
        });
    };
    exports.ourtest.view.renderFile = renderFile;

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

    var start = function(dom){
        dom.find('.report').html('');
        dom.find('.total').html('Total:0');
        dom.find('.passed').html('Passed:0');
        dom.find('.faild').html('Faild:0');
    };

    var progress = function(dom, op, msg){
        var passedWidth = msg.passed / msg.total * 100 + '%';
        var faildWidth = msg.faild / msg.total * 100 + '%';
        dom.find('.passed-progress').style('width', passedWidth);
        dom.find('.faild-progress').style('width', faildWidth);
        dom.find('.running').html(op.toString());
        dom.find('.total').html('Total:' + msg.total);
        dom.find('.passed').html('Passed:' + msg.passed);
        dom.find('.faild').html('Faild:' + msg.faild);
    };
    var debug = function(dom, op, msg){
        dom.find('.report').append(
            '<pre class="debug">' +
            '[debug]' + msg + '\n' +
            'op:' + op.toString() + '\n' +
            'lineNumber:' + op.lineNumber + '\n' +
            'callStack:' + '\n' +
            op.callStack.join('\n') + '\n' +
            'compareTree:' + '\n' +
            renderCompare(op.compareTree) + '\n' +
            '</pre>');
    };
    var error = function(dom, op, msg){
        dom.find('.report').append(
            '<pre class="error">' +
            '[error]' + msg + '\n' +
            'op:' + op.toString() + '\n' +
            'lineNumber:' + op.lineNumber + '\n' +
            'callStack:' + '\n' +
            op.callStack.join('\n') + '\n' +
            'compareTree:' + '\n' +
            renderCompare(op.compareTree) + '\n' +
            'error:' + op.error + '\n' +
            '</pre>');
    };
    var finish = function(dom){
        dom.find('.running').html('');
    };

    // dom selector
    var $ = function(selector, parents){
        if (typeof parents == 'undefined') {
            parents = [exports.document];
        }
        var tardom = [];
        if (typeof selector == 'undeinfed') {
            tardom = parents;
        } else if (typeof selector != 'string') {
            tardom = [];
        } else {
            for (var i = 0; i < parents.length; i++) {
                var ele = parents[i];
                var dom = [];
                if (selector[0] == '#') {
                    dom = [ele.getElementById(selector.substr(1))];
                } else if (selector[0] == '.') {
                    dom = ele.getElementsByClassName(selector.substr(1));
                } else {
                    dom = ele.getElementsByTagName(selector);
                }
                for (var j = 0; j < dom.length; j++ ) {
                    tardom.push(dom[j]);
                }
            }
        }
        return new $$(tardom);
    };
    var $$ = function(dom){
        var self = this;
        self.dom = dom;
        self.find = function(selector){
            return $(selector, self.dom);
        };
        self.eq = function(index){
            if (index >= self.dom.length) {
                return new $$([]);
            }
            return new $$([self.dom[index]]);
        };
        self.parent = function(){
            return new $$([self.dom[0].parentElement]);
        };
        self.html = function(html){
            for (var i = 0; i < self.dom.length; i++) {
                self.dom[i].innerHTML = html;
            }
            return self;
        };
        self.append = function(html){
            for (var i = 0; i < self.dom.length; i++) {
                self.dom[i].innerHTML += html;
            }
            return self;
        };
        self.prepend = function(html){
            for (var i = 0; i < self.dom.length; i++) {
                self.dom[i].innerHTML = html + self.dom[i].innerHTML;
            }
            return self;
        };
        self.style = function(key, value){
            if (typeof key == 'object'){
                var conf = key;
                for (var key in conf) {
                    var value = conf[key];
                    self.style(key, value);
                }
            } else {
                for (var i = 0; i < self.dom.length; i++) {
                    if (self.dom[i].style.hasOwnProperty(key)) {
                        self.dom[i].style[key] = value;
                    }
                }
            }
            return self;
        };
        self.val = function(value){
            if (typeof value == 'undefined') {
                return self.dom[0].value;
            } else {
                for (var i = 0; i < self.dom.length; i++) {
                    self.dom[i].value = value;
                }
                return self;
            }
        };
        self.click = function(callback){
            for (var i = 0; i < self.dom.length; i++) {
                self.dom[i].onclick = function(ele){
                    callback(new $$([ele.target]));
                };
            }
            return self;
        };
        return self;
    };
 })(typeof window != 'undefined' ? window : exports);
