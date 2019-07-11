'use strict';

angular.module('miRNASNP3')
    .controller('SearchController', SearchController)
.directive('ngX1',function () {
    return function (scope, elem, attrs) {
        attrs.$observe('ngX1',function(x1){
            elem.attr('x1',x1);
        });
    };
})
.directive('ngX2',function () {
    return function (scope, elem, attrs) {
        attrs.$observe('ngX2',function(x2){
            elem.attr('x2',x2);
        });
    };
});

function SearchController($scope,$http,$filter,$rootScope) {
    console.log("SearchController loaded");
    $scope.search_ids = $rootScope.search_ids;
    var page = 1;

    $scope.string2list = function (predict_info) {
        $scope.site_info = eval(predict_info)
    };
    if ($scope.search_ids){
        $http({
            url: '/api/snpinfo',
            method: 'GET',
            params: {search_ids: $scope.search_ids}
        }).then(
            function (response) {
                console.log(response);
                $scope.snpinfo_list = response.data.snpinfo
                $scope.snpinfo = $scope.snpinfo_list[0]
            }
        );
    $http({
            url: '/api/mirinfo',
            method: 'GET',
            params: {search_ids: $scope.search_ids}
        }).then(
            function (response) {
                console.log(response);
                $scope.mirinfo = response.data.mirinfo
            })
    }

    $scope.search_target_gain = function (page) {
            $scope.$watch($scope.page,function (newValue,oldValue) {
                page = newValue;
                $http({
                url: '/api/gain_hit',
                method: 'GET',
                params: {search_ids: $scope.search_ids, page: page, per_page: 30}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.gain_hit_list = response.data.gain_hit_list;
                    $scope.record_count = response.data.data_lenth;
                })
            })

    };

    $scope.search_target_loss = function (page) {
        $scope.$watch($scope.page,function(newValue,oldValue){
            page = newValue;
            $http({
            url: '/api/loss_hit',
            method: 'GET',
            params: {search_ids: $scope.search_ids,page: $scope.page, per_page: 30}
        }).then(
            function (response) {
                console.log(response);
                $scope.loss_hit_list = response.data.loss_hit_list;
                $scope.record_count = $scope.data_lenth
            });
        })

    };
    $scope.search_ld = function(){
        $http({
            url:'/api/ldinfo',
            method:'GET',
            params:{search_ids:$scope.search_ids}
        }).then(
            function (response) {
                console.log(response);
                $scope.ld_list = response.data.ld_list;
                $scope.tag = $scope.ld_list[0]._id.is_tag;
                if ($scope.ld_list[0]._id.is_tag == '1'){
                    var ld_region_all = $scope.ld_list[0].tag_info;
                    var ld_array = [];
                    var ld_array_line = {};
                    var min_end = Number($scope.ld_list[0]._id.snp_position) - 250000;
                    if(min_end <0){min_end = 0}
                    var max_start = Number($scope.ld_list[0]._id.snp_position )+ 250000;
                    for (var p=0;p<ld_region_all.length;p++){
                        ld_array_line = {};
                        ld_array_line['id'] = p;
                        ld_array_line['population'] = ld_region_all[p].population;
                        ld_array_line['start'] = ld_region_all[p].ld_start;
                        if(ld_array_line['start']>max_start){ld_array_line['start']=max_start}
                        ld_array_line['end'] = ld_region_all[p].ld_end;
                        if (ld_array_line['end']<min_end){ld_array_line['end']=min_end}
                        ld_array_line['width'] = (Number(ld_region_all[p].ld_start)-Number(ld_region_all[p].ld_end))/500;
                        ld_array_line['text_y'] =20+30*p;
                        ld_array_line['rect_x'] = (Number(ld_array_line['end'])-Number(min_end))/500-20;
                        ld_array_line['rect_y'] = 8+30*p;
                        ld_array.push(ld_array_line)
                    }
                    $scope.ld_array = ld_array;
                }
                else{

                }

            })
    }
}

