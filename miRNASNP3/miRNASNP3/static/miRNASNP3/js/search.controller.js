'use strict';

angular.module('miRNASNP3')
    .controller('SearchController', SearchController);

function SearchController($scope,$http) {
    $scope.gain_hit_main = {'mir_id':'tmir','snp_id':'tsnp'};
    console.log("SearchController loaded");
$scope.fetch_results = function () {
    $http({
        url: '/api/gain_hit',
        method: 'GET',
        params: {search_ids: $scope.search_ids}

    }).then(
        function (response) {
            console.log(response);
            $scope.hit_list_array = response.data.hit_list;
        });
    $(function () {
        var tbody = "";
        //$scope.hit_list = [{'mir_id':'tmir','snp_id':'tsnp','utr3_pos':'tutr','query':'tquery','score':'tscore','energy':'tenergy','effect':'tgian'},{'mir_id':'2mir','snp_id':'2snp'}]
        $("#result").html("---dict---");
        $.each($scope.hit_list_array, function (n, value) {
            var trs = "";
            trs += "<tr><td>" + "indexes" + "</td><td>" + value.mir_id + "</td><td>" + value.snp_id + "</td></td>" + value.utr3_pos + "</td><td>" + value.query + "</td><td>" + value.score + "</td><td>" + value.energy + "</td><td>" + value.utr_map_start + "</td><td>" + value.map_utr_end + "</td><td>" + value.effect + "</td></tr>"
            tbody += trs;
        });
        $("#project").append(tbody);
    })
    }
}
