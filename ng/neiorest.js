
'use strict';

var app = angular.module('neioREST', ['ui.bootstrap', 'hljs', 'ngSanitize']);

function defaultRequest() {
    return {
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


var neioRESTCtrl = function($scope, $http, $sanitize, $sce, $timeout) {
    $scope.request = request;
    $scope.response = response;
    $scope.progress = {
        value: 0,
        type: 'primary',
        collapsed: true
    };

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

                $scope.progress.value = 100;
                $scope.finish();
            })
            .error(function(data) {
            });

        $scope.finish();

    };
};
