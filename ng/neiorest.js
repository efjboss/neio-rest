
'use strict';

var app = angular.module('neioREST', ['ui.bootstrap', 'hljs', 'ngSanitize']);

function defaultRequest() {
    return {
        name: '',
        methods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
        method:'GET',
        url:'',
        parameters: [
            {key: '', value: '', active: true}
        ],
        data: {},
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
    $scope.request = request;
    $scope.response = response;
    $scope.progress = {
        value: 0,
        type: 'primary',
        collapsed: true
    };
    $scope.messages = [];
    $scope.templates = [];

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

    $scope.toggleActive = function(parameter) {
        parameter.active = !parameter.active;
    }

    $scope.addTemplate = function(name) {
        $scope.request.name = name;
        $http.post('../api/save.php', request)
            .success(function(data) {
                console.log(data);
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
    }

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
    }

    $scope.query = function() {
        $scope.progress.collapsed = false;

        $scope.request.data = {};

        angular.forEach($scope.request.parameters, function(entry, idx) {
            if (entry.active) {
                var key = entry.key;
                var val = entry.value;

                $scope.progress.value = 25;

                if ($scope.request.data[key]) {
                    var o = $scope.request.data[key];
                    if (Array.isArray(o)) {
                        o.push(val);
                    } else {
                        o = [o, val];
                    }
                } else {
                    $scope.request.data[key] = val;
                }
                $scope.progress.value = 50;
            }
        });

        $http.post('../api/query.php', request)
            .success(function(data) {
                $scope.progress.value = 75;

                $scope.response.content = data.content;
                $scope.response.headers = [];
                angular.forEach(data.headers, function(val, key) {
                    $scope.response.headers.push({'header': key, 'content': val});
                });

                $scope.response.preview = $sce.trustAsHtml('<iframe height="500px" ' +
                                                               'class="col-xs-12" ' +
                                                               'type"content" ' +
                                                               'src="data:' +
                                                                    data.headers['content_type'] +
                                                                    ',' +
                                                                    encodeURIComponent(data.content) +
                                                            '">' +
                                                            '</iframe>');

                $scope.request.data = {};

                $scope.progress.value = 100;
                $scope.finish();
            })
            .error(function(data) {
            });

        $scope.finish();

    };

    $http.get('../api/list.php')
        .success(function (data) {
            $scope.templates = data;
        })
        .error(function (data) {
            $scope.warn('Could not get a list of templates');
        });

};
