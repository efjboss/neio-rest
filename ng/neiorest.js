
'use strict';

var app = angular.module('neioREST', ['ui.bootstrap']);

var request = {
    'methods': ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
    'method':'GET',
    'url':'',
    'parameters': [
        {'key': '', 'value': '', 'active': true}
    ]
};

var RequestCtrl = function($scope, $http) {
    $scope.request = request;

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
        var data = {};

        angular.forEach($scope.request.parameters, function(entry, idx) {
            if (entry.active) {
                data[entry.key] = [entry.value];
            }
        });
    };
};

