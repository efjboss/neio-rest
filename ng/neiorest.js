
'use strict';

var app = angular.module('neioREST', ['ui.bootstrap', 'ngSanitize']);

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
    };
}

var response = defaultResponse();


var RequestCtrl = function($scope, $http, $sanitize, $sce) {
    $scope.request = request;
    $scope.response = response;

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

    $scope.query = function() {

        angular.forEach($scope.request.parameters, function(entry, idx) {
            if (entry.active) {
                var key = entry.key;
                var val = entry.value;

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
            }
        });

        console.log(request);

        $http.post('../api/query.php', request)
            .success(function(data) {
                $scope.response.content = data.content;
                $scope.response.headers = [];
                angular.forEach(data.headers, function(val, key) {
                    $scope.response.headers.push({'header': key, 'content': val});
                });
                //var content = $sanitize(data.content);
                //var type = $sanitize(data.headers['content_type']);
                //$sce.trustAsHtml($scope.response.preview);
                $scope.response.preview = $sce.trustAsHtml('<iframe height="500px" class="col-xs-12" type"content" src="data:' + data.headers['content_type'] + ',' + encodeURIComponent(data.content) + '"></iframe>');
            })
            .error(function(data) {
                console.log('error');
            });
    };
};

var ResponseCtrl = function($scope) {
    $scope.response = response;
};
