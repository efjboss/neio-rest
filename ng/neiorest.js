'use strict';

var app = angular.module('neioREST', ['ui.bootstrap', 'hljs', 'ngSanitize']);

function defaultRequest() {
    return {
        name: '',
        method:'GET',
        url:'',
        parameters: [
            {key: '', value: '', active: true}
        ],
        headers: [
            {key: '', value: '', active: true}
        ]
    };
}

var request = defaultRequest();

function defaultResponse() {
    return {
        status: 0,
        content: '',
        preview: '',
        headers: [],
        collapsed: true
    };
}

var response = defaultResponse();

function defaultMessage() {
    return {
        content: 'foo',
        type: 'danger'
    };
}

var neioRESTCtrl = function($scope, $http, $sanitize, $sce, $timeout) {
    $scope.methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'];
    $scope.httpHeaders = [
        'Accept',
        'Accept-Charset',
        'Accept-Encoding',
        'Accept-Language',
        'Accept-Datetime'
    ];


    $scope.request = request;
    $scope.response = response;
    $scope.progress = {
        value: 0,
        type: 'primary',
        collapsed: true
    };
    $scope.messages = [];
    $scope.templates = [];
    $scope.templatePreview = null;

    $scope.warn = function(message) {
        $scope.messages.push({content: message, type: 'danger'});
    };

    $scope.inform = function(message) {
        $scope.messages.push({content: message, type: 'info'});
    };

    $scope.closeMessage = function(index) {
        $scope.messages.splice(index, 1);
    }

    $scope.setMethod = function(method) {
        $scope.request.method = method;
    };

    $scope.addParameter = function(index, parameter) {
        $scope.request.parameters.splice(index + 1, 0, {'key': '', 'value': '', 'active': true});
    };

    $scope.removeParameter = function(index, parameter) {
        if ($scope.request.parameters.length == 1) {
            parameter.key = '';
            parameter.value = '';
            parameter.active = true;
        } else {
            $scope.request.parameters.splice(index, 1);
        }
    }

    $scope.addHeader = function(index, header) {
        $scope.request.headers.splice(index + 1, 0, {'key': '', 'value': '', 'active': true});
    };

    $scope.removeHeader = function(index, header) {
        if ($scope.request.headers.length == 1) {
            parameter.key = '';
            parameter.value = '';
            parameter.active = true;
        } else {
            $scope.request.headers.splice(index, 1);
        }
    }


    $scope.toggleActive = function(parameter) {
        parameter.active = !parameter.active;
    }

    $scope.loadTemplate = function(template) {
        $scope.request.name = template.name;
        $scope.request.method = template.method;
        $scope.request.url = template.url;
        $scope.request.parameters = template.parameters;
        $scope.request.headers = template.headers || [{'key': '', 'value': '', 'active': true}];

        $scope.templatePreview = null;
    }

    $scope.addTemplate = function(name) {
        $scope.request.name = name;
        $http.post('../api/save.php', request)
            .success(function(data) {
                if (data.status == 'success') {
                    $scope.templates.push(data.data);
                    $scope.inform('Template saved');
                } else {
                    $scope.warn('Template could not be saved: ' + data.message);
                }
            })
            .error(function(data) {
                $scope.warn('Template could not be saved');
            });
    };

    $scope.deleteTemplate = function(index, template) {
        $http.post('../api/delete.php', template)
            .success(function(data) {
                if (data['status'] == 'success') {
                    $scope.inform(data['message']);
                    $scope.templates.splice(index, 1);
                    if ($scope.templatePreview && template.name == $scope.templatePreview.name) {
                        $scope.templatePreview = null;
                    }
                } else {
                    $scope.warn(data['message'])
                }
            })
            .error(function(data) {
                $scope.warn('Error in deleting template');
            });
    };

    $scope.previewTemplate = function(index, template) {
        $scope.templatePreview = template;
    };

    $scope.finish = function() {
        $timeout(function() {
            $scope.progress.type = 'success';
            $scope.progress.collapsed = true;
            $scope.response.collapsed = false;
        }, 500);
        $timeout(function() {
            $scope.progress.value = 0;
            $scope.progress.type = 'primary';
        }, 1000);
    };

    $scope.query = function() {
        $scope.progress.collapsed = false;
        $scope.response = defaultResponse();
        $scope.responseIsJson = false;

        var requestParams = {};
        var requestHeaders = [];

        angular.forEach($scope.request.headers, function(entry, idx) {
            if (entry.active) {
                if (entry.key.match(/:$/)) {
                    requestHeaders.push(entry.key + ' ' + entry.value);
                } else {
                    requestHeaders.push(entry.key + ': ' + entry.value);
                }
            }
        });

        angular.forEach($scope.request.parameters, function(entry, idx) {
            if (entry.active) {
                var key = entry.key;
                var val = entry.value;

                $scope.progress.value = 25;

                if (requestParams[key]) {
                    var o = requestParams[key];
                    if (Array.isArray(o)) {
                        o.push(val);
                    } else {
                        o = [o, val];
                    }
                } else {
                    requestParams[key] = val;
                }
                $scope.progress.value = 50;
            }
        });

        var requestData = {
            name: $scope.request.name,
            method: $scope.request.method,
            url: $scope.request.url,
            headers: requestHeaders,
            data: requestParams
        };

        $http.post('../api/query.php', requestData)
            .success(function(data) {
                $scope.progress.value = 75;

                $scope.response.headers = [];

                angular.forEach(data.headers, function(val, key) {
                    $scope.response.headers.push({'header': key, 'content': val});
                });
                if (data.headers.content_type.match('application/json')) {
                    $scope.responseIsJson = true;
                    $scope.response.content = angular.fromJson(data.content);
                } else {
                    $scope.response.content = data.content;
                }

                $scope.response.preview = $sce.trustAsHtml('<iframe height="500px" ' +
                                                               'class="col-xs-12" ' +
                                                               'type"content" ' +
                                                               'src="data:' +
                                                                    data.headers['content_type'] +
                                                                    ',' +
                                                                    encodeURIComponent(data.content) +
                                                            '">' +
                                                            '</iframe>');

                $scope.progress.value = 100;
                $scope.finish();
            })
            .error(function(data) {
                $scope.finish();
            });
    };

    $http.get('../api/list.php')
        .success(function (data) {
            $scope.templates = data;
        })
        .error(function (data) {
            $scope.warn('Could not get a list of templates');
        });

};
