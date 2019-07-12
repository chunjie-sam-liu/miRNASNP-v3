"use strict";

angular.module('miRNASNP3')
    .controller('SnpController', SnpController)
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
function SnpController($scope,$routeParams,$http,$filter) {
    console.log("SnpController loaded");
    console.log($scope.currentPage);
    $scope.error=0;
    $("[data-toggle='popover']").popover();

   // var base_url=miRNASNP3Service.getAPIBaseUrl();
    $scope.query_snp=$routeParams.snp_id;
    console.log($routeParams.snp_id);
	var page=1;

	$scope.clear=function(){
		$scope.one=0;
		$scope.two=0;
		$scope.three=0;
		$scope.four=0;
		$scope.five=0;
		$scope.six=0;
		$scope.seven=0;
	};
	$scope.one=1;
	$scope.show_one=function(refer){
		console.log(refer);
		$scope.clear()
		if (refer=="one"){
			$scope.one=1;
			$scope.class_one="ative";
		}
		if (refer=="two"){
			$scope.two=1;
			$scope.class_two="ative";
		}
		if (refer=="three"){
			$scope.three=1;
			$scope.class_three="ative";
		}
		if (refer=="four"){
			$scope.four=1;
			$scope.class_four="ative"
		}
		if (refer=="five"){
			$scope.five=1;
			$scope.class_five="ative"
		}
		if (refer=="six") {
			$scope.six = 1;
			$scope.class_six = "ative";
		}
		if (refer=="seven"){
			$scope.seven = 1;
			$scope.class_seven = "active";
		}
	};

	$scope.fetch_gwas=function(){};


    $scope.string2list = function (predict_info) {
        $scope.site_info = eval(predict_info)
    };

    $scope.fetch_snp_details=function(){
    	$http({
            url: '/api/snpinfo',
            method: 'GET',
            params: {query_snp: $scope.query_snp}
        }).then(
            function (response) {
                console.log(response);
                $scope.snpinfo_list = response.data.snpinfo
                $scope.snpinfo = $scope.snpinfo_list[0]
            }
        );
	};
	$scope.fetch_snp_details();

    $scope.fetch_target_gain = function (page) {
    	$http({
			url:'/api/gain_target_seed',
			method: 'GET',
			params: {search_ids: $scope.query_snp,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.gain_target_list = response.data.gain_target_list;
                    $scope.gain_count=response.data.gain_target_count[0].count;
                    var ltl = $scope.gain_target_list;
                    for (var i = 0; i <=ltl.length; i++) {
                    var site_count = ltl[i].site_num;
                    //console.log(site_count);
                    for (var j = 0; j < site_count; j++) {
                        var line=[];
                        var ns = ltl[i].site_info[j].align.split('#');
                        ltl[i].site_info[j].align = ns;
                        }
                }
                $scope.gain_target_list = ltl
            });
    };
    $scope.fetch_target_gain();
	$scope.modal_gain_site=function(item){
		$scope.modal_header="Target Gain";
		$scope.modal_site=item;
		console.log(item)
	};
    $scope.modal_loss_site=function(item){
        $scope.modal_header="Target Loss";
        $scope.modal_site=item;
    };

    $scope.fetch_target_loss = function (page) {
        $http({
            url: '/api/loss_target_seed',
            method: 'GET',
            params: {search_ids: $scope.query_snp, page: page}
        }).then(
            function (response) {
                console.log(response);
                $scope.loss_target_list = response.data.loss_target_list;
                $scope.loss_count = response.data.loss_target_count[0].count;
                var ltl = $scope.loss_target_list;
                //console.log("change align!");
                for (var i = 0; i <=ltl.length; i++) {
                    var site_count = ltl[i].site_num;
                    //console.log(site_count);
                    for (var j = 0; j < site_count; j++) {
                        var line=[];
                        var ns = ltl[i].site_info[j].align.split('#');
                        /*
                        var se = ns[0].split(' ');
                        var w = Number(se[1]) - Number(se[0]);
                        var w1=w;
                        while(w1){
                            se[0].push(' ');
                            w1=w1-1;
                        }
                        se[0].push(se[se.length-1]);
                        line[0] =ns[0];
                        line[1]=''.join(se[0]);
                        line[2]=ns[2];
                        var w3=w-ns[3].length+1;
                        while(w3){
                            ns[3].unshift(' ');
                            w3=w3-1;
                        }
                        line[3]=''.join(ns[3]);
                        var w4=w-ns[4].length+1;
                        while(w4){
                            ns[4].unshift(' ');
                            w4=w4-1
                        }
                        line[4]=''.join(ns[4]);
                         */
                        ltl[i].site_info[j].align = ns;
                        //console.log(ltl[i].site_info[j].align);
                        //console.log("align str exe")
                    }
                }
                $scope.loss_target_list = ltl
            });
    };
    $scope.fetch_target_loss(page);

    $scope.fetch_snvutr_loss=function(page){
        $http({
            url:'/api/snvutr_loss',
            method:'Get',
            params:{search_ids:$scope.query_snp,page:page}
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_loss_list=response.data.snv_utr_loss_list;
            $scope.snv_utr_loss_count=response.data.snv_utr_loss_count
        })
    };
    $scope.fetch_snvutr_loss(page);

    $scope.fetch_gwas_catalog=function(search_ids){
    	$http({
			url:'/api/gwas_catalog',
			method:'GET',
			params:{search_ids:search_ids}
		}).then(
			function (response) {
				console.log(response);
				$scope.catalog_list=response.data.catalog_list;
				$scope.catalog_count=response.data.catalog_count;
			}
		)
	};
    $scope.search_ld = function(){
        $http({
            url:'/api/ldinfo',
            method:'GET',
            params:{search_ids:$scope.query_snp}
        }).then(
            function (response) {
                console.log(response);
                $scope.ld_list = response.data.ld_list;
                $scope.ld_list_lenth=response.data.ld_item_lenth;
                $scope.tag = $scope.ld_list[0]._id.is_tag;
                $scope.ld=$scope.ld_list[0]._id.is_ld;
                if ($scope.tag == '1'){
                	$scope.fetch_gwas_catalog($scope.query_snp);
                    var ld_region_all = $scope.ld_list[0].tag_info;
                    var ld_array = [];
                    var ld_array_line = {};
                    var min_start = Number($scope.ld_list[0]._id.snp_position) - 250000;
                    if(min_start <0){min_start = 0}
                    var max_end = Number($scope.ld_list[0]._id.snp_position )+ 250000;
                    $scope.snp_line=(Number($scope.ld_list[0]._id.snp_position)-min_start)/500-20;
                    for (var p=0;p<ld_region_all.length;p++){
                        ld_array_line = {};
                        ld_array_line['id'] = p;
                        ld_array_line['population'] = ld_region_all[p].population;
                        ld_array_line['start'] = ld_region_all[p].ld_start;
                        if(ld_array_line['start']<min_start){ld_array_line['start']=min_start}
                        ld_array_line['end'] = ld_region_all[p].ld_end;
                        if (ld_array_line['end']>max_end){ld_array_line['end']=max_end}
                        ld_array_line['width'] = (Number(ld_region_all[p].ld_end)-Number(ld_region_all[p].ld_start))/500;
                        ld_array_line['text_y'] =20+30*p;
                        ld_array_line['rect_x'] = (Number(ld_array_line['start'])-Number(min_start))/500-20;
                        ld_array_line['rect_y'] = 8+30*p;
                        ld_array.push(ld_array_line)
                    }
                    $scope.ld_array = ld_array;
                }
                else{

                }

            })
    };
    $scope.search_ld();

    $scope.fetch_relate_cosmic=function(){
    	$http({
			url:'/api/cosmicinfo',
            method: 'GET',
            params: {search_ids: $scope.query_snp,page:1}
        }).then(
            function (response) {
                console.log(response);
                $scope.rcosmic_list = response.data.cosmic_list;
                $scope.rcosmic_count = response.data.data_length
            });
        };
    $scope.fetch_relate_clinvar=function(){
    	$http({
			url:'/api/clinvarinfo',
            method: 'GET',
            params: {search_ids: $scope.query_snp,page:1}
        }).then(
            function (response) {
                console.log(response);
                $scope.rclinvar_list = response.data.clinvar_list;
                $scope.rclinvar_count = response.data.data_length
            });
	};
	$scope.fetch_relate_cosmic();
	$scope.fetch_relate_clinvar();
}