'use strict;'

angular.module('miRNASNP3')
    .controller('KeyController', KeyController);

function KeyController($scope,$routeParams,$http,$filter,$window,miRNASNP3Service) {
    console.log("KeyController loaded");
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    $scope.query_mirna = $routeParams.mirna_id;
    $scope.fetch_mirna_list=function(){
        $http({
            url:base_url+'/api/mirna_key',
            //url:+base_url+'/api/mirna_key',
            method:'GET',
            params:{mirna_id:$scope.query_mirna}
        }).then(function (response) {
            console.log(response);
            $scope.mirna_key_list=response.data.mirna_key_list;
            if ($scope.mirna_key_list.length==0){
                $scope.error=1;
            }
            else {
                var mirna_key = [];
                for (var i = 0; i < $scope.mirna_key_list.length; i++) {
                    mirna_key.push($scope.mirna_key_list[i].mir_id)
                }
                mirna_key.sort();
                var mirna_key_uniq = [];
                for (var i = 0; i < mirna_key.length; i++) {
                    if (mirna_key[i] !== mirna_key[i - 1]) {
                        mirna_key_uniq.push(mirna_key[i])
                    }
                }
                if (mirna_key_uniq.length == 1) {
                    $scope.option_key = 0;
                    window.open("#!/mirna?mirna_id=" + $scope.query_mirna, "_self")
                } else {
                    $scope.option_key = 1;
                    $scope.mirna_keys = mirna_key_uniq;
                }
            }
        })
    };
    $scope.fetch_mirna_list()
}

