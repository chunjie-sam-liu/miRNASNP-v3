"use strict";
angular.module('miRNASNP3')
    .controller('ToolsController', ToolsController);

function ToolsController($scope) {
    console.log("ToolsController loaded");
    $scope.predict = function () {
        alert("Predict!");
    }
    $scope.load = function () {
        alert("Example!");
    }
}

