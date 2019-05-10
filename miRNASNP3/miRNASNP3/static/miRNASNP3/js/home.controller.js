"use strict";

angular.module('miRNASNP3')
    .controller('HomeController', HomeController);

function HomeController($scope,$http,$rootScope) {
    console.log("HomeController loaded");
    $scope.search_query = function (){
        $http({
        url: '/api/gain_hit',
        method: 'GET',
        params: {search_ids: $scope.search_ids}

    }).then(
        function (response) {
            console.log(response);
            $rootScope.hit_list = response.data.hit_list;
        });
    }
     $scope.fetch_hit_list = function () {
        $http({
            url: '/api/gain_hit',
            method: 'GET',
            params: {page: 1, per_page: 30}
        }).then(
            function (response) {
                console.log(response);
                $scope.hit_list = response.data.hit_list;
            }
        )};

    $scope.fetch_hit_list();
}


