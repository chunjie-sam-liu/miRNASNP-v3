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

	//$scope.fetch_gwas=function(){};


    //$scope.string2list = function (predict_info) {
      //  $scope.site_info = eval(predict_info)
   // };

    $scope.fetch_snp_details=function(){
        var page=1;
    	$http({
            url: '/api/snpinfo',
            method: 'GET',
            params: {query_snp: $scope.query_snp,page:page}
        }).then(
            function (response) {
                console.log(response);
                $scope.snpinfo_list = response.data.snpinfo;
                $scope.snpinfo_count=response.data.snpinfo_count;
                $scope.snpinfo_alias=$scope.snpinfo_list.shift();
                $scope.snpinfo_alias_count=$scope.snpinfo_list.length
            });
	};
	$scope.fetch_snp_details();

    $scope.fetch_target_gain = function (page) {
        console.log("fetch_target_gain");
        var query_gene = $('#search_gene').val();
    	$http({
			url:'/api/snp_seed_gain',
			method: 'GET',
			params: {snp_id: $scope.query_snp,page:page,gene:query_gene}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.snp_seed_gain_list = response.data.snp_seed_gain_list;
                    $scope.snp_seed_gain_count=response.data.snp_seed_gain_count;
                })
            };
    $scope.fetch_target_gain(page);

    $scope.modal_expression=function(exp,title){
        $scope.expression=exp[0];
        $scope.exp_item=title;
        console.log($scope.expression);
        var gene_expr = $scope.expression.exp_df;
        var cancer_types=[];
        var expr=[];
        for(var cancer in gene_expr){
            cancer_types.push(cancer);
            expr.push(Number(gene_expr[cancer]))
        }
        //barplot
        var a = echarts;
        var myChart = a.init(document.getElementById('expression'));
        myChart.setOption({
                color: ['#003366'],
                //graph:{
                //    color:colorPalette
                //},
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        data:cancer_types,
                        //name:'Cancer Types',
                        nameTextStyle:{
                            align:'center',
                            fontSize:12,
                            fontWeight:'bold',
                        },
                        rotate:45,
                        splitLine:{
　　　　                    show:false
　　                          },

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:'PRKM',
                        nameTextStyle:{
                            align:'left',
                            fontSize:12,
                            fontWeight:'bold',
                        },
                        splitLine:{
　　　　                    show:false
　　                          },
                        position:'bottom'
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        barGap: 0,
                        data:expr
                    },
                ],
              //  title: [
                //    {
                //        text: 'Expression level of ' + $scope.gene_expression.symbol,
                 //       left: 'center'
                 //   }
               // ]
            });
    };

	$scope.modal_gain_site=function(site){
		$scope.modal_header="Target Gain";
		$scope.modal_site=site;
		var align_5=site.site_info.align_5;
		var b=0;
		for (var i=0;i<align_5.length;i++){
		    if(align_5[i]==' '){
		        b=b+1;
            }
        }
		if(site.strand=='-'){
		    var distance=align_5.length-site.snp_info.distance;
		    $scope.align_5_pre=align_5.substring(0,distance);
            $scope.align_5_letter=align_5[distance];
            $scope.align_5_later=align_5.substring(distance+1,align_5.length);
        }
		else {
		    var distance=site.snp_info.distance+b;
		    $scope.align_5_pre=align_5.substring(0,distance);
            $scope.align_5_letter=align_5[distance];
            $scope.align_5_later=align_5.substring(distance+1,align_5.length);
        }
	};
    $scope.modal_loss_site=function(site){
		$scope.modal_header="Target Loss";
		$scope.modal_site=site;
		var align_5=site.site_info.align_5;
		var b=0;
		for (var i=0;i<align_5.length;i++){
		    if(align_5[i]==' '){
		        b=b+1;
            }
        }
		if(site.strand=='-'){
		    var distance=align_5.length-site.snp_info.distance;
		    $scope.align_5_pre=align_5.substring(0,distance);
            $scope.align_5_letter=align_5[distance];
            $scope.align_5_later=align_5.substring(distance+1,align_5.length);
        }
		else {
		    var distance=site.snp_info.distance+b;
		    $scope.align_5_pre=align_5.substring(0,distance);
            $scope.align_5_letter=align_5[distance];
            $scope.align_5_later=align_5.substring(distance+1,align_5.length);
        }
	};

    $scope.fetch_target_loss = function (page) {
        var query_gene_loss = $('#search_gene_loss').val();
    	$http({
			url:'/api/snp_seed_loss',
            method: 'GET',
            params: {snp_id: $scope.query_snp,page:page,gene:query_gene_loss}
        }).then(
            function (response) {
                console.log(response);
                $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                $scope.snp_seed_loss_count = response.data.snp_seed_loss_count;
            });
        };
    $scope.fetch_target_loss(page);

    $scope.fetch_snv_utr_loss=function(page){
        $http({
            url:'/api/snv_utr_loss',
            method:'Get',
            params:{snp_id:$scope.query_snp,page:page}
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_loss_list=response.data.snv_utr_loss_list;
            $scope.snv_utr_loss_count=response.data.snv_utr_loss_count
        })
    };
    $scope.fetch_snv_utr_loss(page);

    $scope.fetch_snv_utr_gain=function(page){
        $http({
            url:'/api/snv_utr_gain',
            method:'Get',
            params:{snp_id:$scope.query_snp,page:page}
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_gain_list=response.data.snv_utr_gain_list;
            $scope.snv_utr_gain_count=response.data.snv_utr_gain_count
        })
    };
    $scope.fetch_snv_utr_gain(page);

    $scope.fetch_gwas_catalog=function(snp_id){
    	$http({
			url:'/api/gwas_catalog',
			method:'GET',
			params:{search_ids:snp_id}
		}).then(
			function (response) {
				console.log(response);
				$scope.catalog_list=response.data.catalog_list;
				$scope.catalog_count=response.data.catalog_count;
			}
		)
	};
    $scope.fetch_gwas_catalog($scope.query_snp);
    $scope.search_ld = function(){
        $http({
            url:'/api/ldinfo',
            method:'GET',
            params:{search_ids:$scope.query_snp}
        }).then(
            function (response) {
                console.log(response);
                $scope.ld_list = response.data.ld_list;
                $scope.ld_list_lenth = response.data.ld_item_lenth;
                $scope.tag = Number($scope.ld_list[0]._id.is_tag);
                $scope.ld = Number($scope.ld_list[0]._id.is_ld);
                console.log($scope.tag);
                console.log($scope.ld);
                if ($scope.tag == '1'){
                    $scope.ld_t=0;
                	$scope.tag_array=$scope.catalog_list;
                	$scope.tag_array[0].coordinate=$scope.ld_list[0]._id.snp_chr+':'+$scope.ld_list[0]._id.snp_position;
                    var ld_region_all = $scope.ld_list[0].tag_info;
                    var ld_array = [];
                    var ld_array_line = {};
                    var min_start = Number($scope.ld_list[0]._id.snp_position) - 250000;
                    if(min_start <0){min_start = 0}
                    var max_end = Number($scope.ld_list[0]._id.snp_position )+ 250000;
                    $scope.snp_line=(Number($scope.ld_list[0]._id.snp_position)-min_start)/500-20;
                    $scope.tag_line=$scope.snp_line;
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
                    $scope.ld_svg=$scope.ld_array;
                }
                else {
                    var ld_array = []; //table
                    var ld_svg={}; //grid pic
                    var tag_array=[]; //tag table
                    var tag_line=[]; //tag_line
                    var min_start = Number($scope.ld_list[0]._id.snp_position) - 250000;
                    if (min_start < 0) {
                            min_start = 0
                        }
                    $scope.ld_t=1;
                    $scope.snp_line = (Number($scope.ld_list[0]._id.snp_position) - min_start) / 500 - 20;
                    var max_end = Number($scope.ld_list[0]._id.snp_position) + 250000;

                    for (var i = 0; i < $scope.ld_list.length; i++) {

                        console.log($scope.ld_list[i]._id.rela_tag);
                        $scope.ld_list[i].catalog_info[0].coordinate=$scope.ld_list[i]._id.snp_chr+':'+$scope.ld_list[i]._id.relate_tag_pos;
                        tag_array.push($scope.ld_list[i].catalog_info[0]);
                        var ld_region_all = $scope.ld_list[i].relate_tag_info;
                        var rela_tag_line = (Number($scope.ld_list[i]._id.relate_tag_pos) - min_start) / 500 - 20;
                        tag_line.push(rela_tag_line);
                        for (var p = 0; p < ld_region_all.length; p++) {
                            ld_array_line={};
                            if (!ld_svg[ld_region_all[p].population]) {
                                ld_svg[ld_region_all[p].population] = {};
                                ld_svg[ld_region_all[p].population]['start'] = $scope.ld_list[0]._id.snp_position;
                                ld_svg[ld_region_all[p].population]['end'] = $scope.ld_list[0]._id.snp_position;
                            }
                            //ld_svg[ld_region_all[p].population];
                            if (ld_region_all[p].relate_tag_ld_start < min_start) {
                                ld_svg[ld_region_all[p].population]['start'] = min_start
                            } else if (ld_region_all[p].relate_tag_ld_start < ld_svg[ld_region_all[p].population]['start']) {
                                ld_svg[ld_region_all[p].population]['start'] = ld_region_all[p].relate_tag_ld_start;
                            }
                            if (ld_region_all[p].relate_tag_ld_end > max_end) {
                                ld_svg[ld_region_all[p].population]['end'] = max_end
                            } else if (ld_region_all[p].relate_tag_ld_end > ld_svg[ld_region_all[p].population]['end']) {
                                ld_svg[ld_region_all[p].population]['end'] = ld_region_all[p].relate_tag_ld_end;
                            }
                            //console.log($scope.ld_list[i]._id.rela_tag);
                            ld_array_line['rela_tag']=$scope.ld_list[i]._id.rela_tag;
                            ld_array_line['d_prime'] = ld_region_all[p].d_prime;
                            ld_array_line['r2'] = ld_region_all[p].r2;
                            ld_array_line['start']=ld_region_all[p].relate_tag_ld_start;
                            ld_array_line['end']=ld_region_all[p].relate_tag_ld_end;
                            ld_array_line['population']=ld_region_all[p].population;
                            ld_array.push(ld_array_line)
                        }
                    }
                    $scope.ld_array = ld_array;
                    $scope.ld_svg=[];
                    var j=0;
                    for(p in ld_svg){
                        var ld_svg_line={};
                        ld_svg[p]['width'] = (Number(ld_svg[p]['end']) - Number(ld_svg[p]['start'])) / 500;
                        ld_svg[p]['text_y'] = 20 + 30 * j;
                        ld_svg[p]['rect_x'] = (Number(ld_svg[p]['start']) - Number(min_start)) / 500 - 20;
                        ld_svg[p]['rect_y'] = 8 + 30 * j;
                        ld_svg_line=ld_svg[p];
                        ld_svg_line['population']=p;
                        $scope.ld_svg.push(ld_svg_line);
                        console.log(j);
                        j=j+1;
                    };
                    $scope.tag_array=tag_array;
                    $scope.tag_line=tag_line;
                }
                console.log("ld_array");
                console.log($scope.ld_array);
                console.log("ld_svg");
                console.log($scope.ld_svg);
                console.log("tag_array");
                console.log($scope.tag_array);
                console.log("tag_line");
                console.log($scope.tag_line);
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