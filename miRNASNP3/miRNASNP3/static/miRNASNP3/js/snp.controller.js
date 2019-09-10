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
function SnpController($scope,$routeParams,$http,$filter,miRNASNP3Service,) {
    console.log("SnpController loaded");
   // console.log($scope.currentPage);
    var base_url = miRNASNP3Service.getAPIBaseUrl();

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
			$scope.class_one="active";
		}
		if (refer=="two"){
			$scope.two=1;
			$scope.class_two="active";
		}
		if (refer=="three"){
			$scope.three=1;
			$scope.class_three="active";
		}
		if (refer=="four"){
			$scope.four=1;
			$scope.class_four="active"
		}
		if (refer=="five"){
			$scope.five=1;
			$scope.class_five="active"
		}
		if (refer=="six") {
			$scope.six = 1;
			$scope.class_six = "active";
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
            url: base_url+'/api/snpinfo',
            //url:'/api/snpinfo',
            method: 'GET',
            params: {query_snp: $scope.query_snp,page:page}
        }).then(
            function (response) {
                console.log(response);
                $scope.snpinfo_list = response.data.snpinfo;
                $scope.snpinfo_count=response.data.snpinfo_count;
                var data_list=$scope.snpinfo_list
                for(var i=0;i<data_list.length;i++){
                    if(data_list[i].ref_freq=='novalue'){data_list[i].ref_freq=0}
                    if(Number(data_list[i].alt_freq)==0.0){data_list[i].alt_freq=0}
            }
                $scope.snpinfo_list=data_list
                console.log($scope.snpinfo_list)
                $scope.snpinfo_alias=$scope.snpinfo_list.shift();
                $scope.snpinfo_alias_count=$scope.snpinfo_list.length
            });
	};
	$scope.fetch_snp_details();

    $scope.fetch_target_gain = function (page) {
        console.log("fetch_target_gain");
    	$http({
            url:base_url+'/api/snp_seed_gain',
            //url:'/api/snp_seed_gain',
			method: 'GET',
			params: {snp_id: $scope.query_snp,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.snp_seed_gain_list = response.data.snp_seed_gain_list;
                    $scope.snp_seed_gain_count=response.data.snp_seed_gain_count;
                    var site_array=$scope.snp_seed_gain_list
                for(var i=0;i<site_array.length;i++){
                    if(site_array[i].expr_corelation){
                        site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                    }
                    site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                    site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                    site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                    site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                    site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                    site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                }
                })
            };
    $scope.fetch_target_gain(page);

    $(document).ready(function(){
        var flag=0;
        $('#search_gene').on('input propertychange', function() {
            var query_gene_gain = $.trim($('#search_gene').val());
            console.log(query_gene_gain)
            if (/[@#\$%\^&\*<>\.]+/g.test(query_gene_gain)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                console.log(query_gene_gain)
                $http({
                    url:base_url+'/api/snp_seed_gain',
                    //url:'/api/snp_seed_gain',
                    method: 'GET',
                    params: {snp_id: $scope.query_snp,page:page,gene:query_gene_gain}
                    }).then(
                        function (response) {
                            console.log(response);
                            $scope.snp_seed_gain_list = response.data.snp_seed_gain_list;
                            $scope.snp_seed_gain_count=response.data.snp_seed_gain_count+1;
                            var site_array=$scope.snp_seed_gain_list
                            for(var i=0;i<site_array.length;i++){
                                if(site_array[i].expr_corelation){
                                    site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                                }
                                site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                                site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                                site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                                site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                                site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                                site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                        }
                        })
            }
        });
      });

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
		var align8=site.site_info.align8;
		//var b=0;
		//for (var i=0;i<align8.length;i++){
		 //   if(align8[i]==' '){
		 //       b=b+1;
        //    }
       // }
		//if(site.strand=='-'){
           // var distance=Number(site.snp_info.distance)+b+2;
         //   var distance=align8.length-site.snp_info.distance-1;
		//    $scope.align8_pre=align8.substring(0,distance);
        //    $scope.align8_letter=align8[distance];
        //    $scope.align8_later=align8.substring(distance+1,align8.length);
        //}
		//else {
		    var distance=align8.length-site.snp_info.distance-1;
		    $scope.align8_pre=align8.substring(0,distance);
            $scope.align8_letter=align8[distance];
            $scope.align8_later=align8.substring(distance+1,align8.length);
        }
    $scope.modal_loss_site=function(site){
		$scope.modal_header="Target Loss";
		$scope.modal_site=site;
		var align8=site.site_info.align8;
		//var b=0;
		//for (var i=0;i<align8.length;i++){
		 //   if(align8[i]==' '){
		  //      b=b+1;
           // }
       // }
		//if(site.strand=='-'){
         //   var distance=align8.length-site.snp_info.distance-1;
            //var distance=Number(site.snp_info.distance)+b+2;
		 //   $scope.align8_pre=align8.substring(0,distance);
          //  $scope.align8_letter=align8[distance];
           // $scope.align8_later=align8.substring(distance+1,align8.length);
        //}
		//else {
           // var distance=Number(site.snp_info.distance)+b+2;
        var distance=align8.length-site.snp_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        $scope.align8_letter=align8[distance];
        $scope.align8_later=align8.substring(distance+1,align8.length);
        }


        $scope.modal_corelation_detail=function(cor){
            var cancer_count=0;
            var cor_sum=0;
            for(var cancer in cor.cor_df){
                if(cor.cor_df[cancer]){
                    cancer_count+=1;
                    cor_sum+=Number(cor.cor_df[cancer])
                }
            }
            //$scope.corelation=(cor_sum/cancer_count).toFixed(2);
            $scope.gene_mir=cor.mir_gene;
            console.log($scope.gene_mir)
            var temp;
            var temp_cor;
            var value;
            var array=[];
            var r,g,b;
            temp=cor.cor_df;
                for (var key in temp) {
                    if (temp[key]){
                        if(temp[key]>0){
                            temp_cor=Number(temp[key]).toFixed(2)
                        }
                        else{
                            temp_cor=Number(temp[key]*(-1)).toFixed(2)*(-1)
                        }
                        value=Number(temp_cor)+1
                        //console.log(value)
                        r=Math.floor(value*255)/2
                        g=255-r
                        b = 0;
                        var p = "rgb("+r+","+g+","+b+")";
                        array.push({"cancer_type":key,"corelation":temp_cor,"color":p})
                        }
                    }
               // console.log(array);
                $scope.corelation_detail = array; 
        }


    $scope.fetch_target_loss = function (page) {
    	$http({
        	url:base_url+'/api/snp_seed_loss',
            //url:'/api/snp_seed_loss',
            method: 'GET',
            params: {snp_id: $scope.query_snp,page:page}
        }).then(
            function (response) {
                console.log(response);
                $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                $scope.snp_seed_loss_count = response.data.snp_seed_loss_count;
                var site_array=$scope.snp_seed_loss_list
                for(var i=0;i<site_array.length;i++){
                    if(site_array[i].expr_corelation){
                        site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                    }
                    site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                    site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                    site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                    site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                    site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                    site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                }
            });
        };
    $scope.fetch_target_loss(page);

    $(document).ready(function(){
        var flag=0;
        $('#search_gene_loss').on('input propertychange', function() {
            var query_gene_loss = $.trim($('#search_gene_loss').val());
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                console.log(query_gene_loss)
                $http({
                    url:base_url+'/api/snp_seed_loss',
                    //url:'/api/snp_seed_loss',
                    method: 'GET',
                    params: {snp_id: $scope.query_snp,page:page,gene:query_gene_loss}
                    }).then(
                        function (response) {
                            console.log(response);
                            $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                            $scope.snp_seed_loss_count=response.data.snp_seed_loss_count+1;
                            var site_array=$scope.snp_seed_loss_list
                            for(var i=0;i<site_array.length;i++){
                                if(site_array[i].expr_corelation){
                                    site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                                }
                                site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                                site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                                site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                                site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                                site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                                site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                        }
                        })
            }
        });
      });

    $scope.modal_gain_site_utr=function(site){
		$scope.modal_header="Target Gain";
		$scope.modal_site=site;
		var align6=site.site_info.align6;
		//var b=0;
		//for (var i=0;i<align8.length;i++){
		 //   if(align8[i]==' '){
		 //       b=b+1;
        //    }
       // }
		//if(site.strand=='-'){
           // var distance=Number(site.snp_info.distance)+b+2;
         //   var distance=align8.length-site.snp_info.distance-1;
		//    $scope.align8_pre=align8.substring(0,distance);
        //    $scope.align8_letter=align8[distance];
        //    $scope.align8_later=align8.substring(distance+1,align8.length);
        //}
		//else {
		    var distance=Number(site.snp_info.distance_align)+3;
		    $scope.align6_pre=align6.substring(0,distance);
            $scope.align6_letter=align6[distance];
            $scope.align6_later=align6.substring(distance+1,align6.length);
        }

        $scope.modal_loss_site_utr=function(site){
            $scope.modal_header="Target Loss";
            $scope.modal_site=site;
            var align6=site.site_info.align6;
            //var b=0;
            //for (var i=0;i<align8.length;i++){
             //   if(align8[i]==' '){
             //       b=b+1;
            //    }
           // }
            //if(site.strand=='-'){
               // var distance=Number(site.snp_info.distance)+b+2;
             //   var distance=align8.length-site.snp_info.distance-1;
            //    $scope.align8_pre=align8.substring(0,distance);
            //    $scope.align8_letter=align8[distance];
            //    $scope.align8_later=align8.substring(distance+1,align8.length);
            //}
            //else {
                var distance=Number(site.snp_info.distance_align)+3;
                $scope.align6_pre=align6.substring(0,distance);
                $scope.align6_letter=align6[distance];
                $scope.align6_later=align6.substring(distance+1,align6.length);
            }


    $scope.fetch_snv_utr_loss=function(page){
        $http({
            url:base_url+'/api/snv_utr_loss',
            //url:'/api/snv_utr_loss',
            method:'Get',
            params:{snp_id:$scope.query_snp,page:page}
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_loss_list=response.data.snv_utr_loss_list;
            $scope.snv_utr_loss_count=response.data.snv_utr_loss_count;
            var site_array=$scope.snv_utr_loss_list
                for(var i=0;i<site_array.length;i++){
                    if(site_array[i].expr_corelation){
                        site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                    }
                    site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                    site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                    site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                    site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                    site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                    site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                }
        })
    };
    $scope.fetch_snv_utr_loss(page);

    $scope.fetch_snv_utr_gain=function(page){
        $http({
            url:base_url+'/api/snv_utr_gain',
            //url:'/api/snv_utr_gain',
            method:'GET',
            params:{snp_id:$scope.query_snp,page:page}
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_gain_list=response.data.snv_utr_gain_list;
            $scope.snv_utr_gain_count=response.data.snv_utr_gain_count
            var site_array=$scope.snv_utr_gain_list
                for(var i=0;i<site_array.length;i++){
                    if(site_array[i].expr_corelation){
                        site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                    }
                    site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                    site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                    site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                    site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                    site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                    site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                }
        })
    };
    $scope.fetch_snv_utr_gain(page);

    $scope.fetch_gwas_catalog=function(snp_id){
    	$http({
            url:base_url+'/api/gwas_catalog',
            //url:'/api/gwas_catalog',
			method:'GET',
			params:{search_ids:snp_id}
		}).then(
			function (response) {
				console.log(response);
				$scope.catalog_list=response.data.catalog_list;
                $scope.catalog_count=response.data.catalog_count;
                if($scope.catalog_count){
                    var data_list=$scope.catalog_list
                    var disk_allele_regex=/-([A-Z]|\?)/
                    var ci_regex=/\[(.*?)\]/
                    for(var i=0;i<data_list.length;i++){
                        var risk_allele=disk_allele_regex.exec(data_list[i].risk_allele)
                        var ci=ci_regex.exec(data_list[i].ci95)
                        console.log(risk_allele)
                        console.log(ci)
                        data_list[i].risk_allele=risk_allele[1]
                        //data_list[i].ci95=ci[0]
                    }
                    console.log(data_list)
                    console.log($scope.catalog_list)
                }
			}
		)
    };
    $scope.fetch_gwas_catalog($scope.query_snp);

    $scope.search_ld = function(){
        $http({
            url:base_url+'/api/ldinfo',
            //url:'/api/ldinfo',
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
                    console.log("Is a tag snp!")
                    $scope.ld_t=0;
                    //$scope.tag_array=$scope.catalog_list;
                    $http({
                        url:base_url+'/api/gwas_catalog',
                        //url:'/api/gwas_catalog',
                        method:'GET',
                        params:{search_ids:$scope.query_snp}
                    }).then(
                        function (response) {
                            console.log(response);
                            $scope.tag_array=response.data.catalog_list;
                            $scope.catalog_count=response.data.catalog_count;
                            if($scope.catalog_count){
                                var data_list=$scope.tag_array
                                var disk_allele_regex=/-([A-Z]|\?)/
                                var ci_regex=/\[(.*?)\]/
                                for(var i=0;i<data_list.length;i++){
                                    var risk_allele=disk_allele_regex.exec(data_list[i].risk_allele)
                                    var ci=ci_regex.exec(data_list[i].ci95)
                                    console.log(risk_allele)
                                    console.log(ci)
                                    data_list[i].risk_allele=risk_allele[1]
                                   // data_list[i].ci95=ci[0]
                                }
                                console.log(data_list)
                            }
                            console.log($scope.tag_array)
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

                    //the format of risk allele and ci95 was fixed as getting by 'http'
                    $scope.ld_array = ld_array;
                    $scope.ld_svg=$scope.ld_array;
                    // fix svg height 
                   
                    var h=$scope.ld_svg.length*(850/26)
                    $("#ld_svg").css({'height':h+'px'});
                    $("#ld_region").css({'height':h+'px'});
                    $scope.line_y=h
                        }
                    )
                    
                }
                else {
                    console.log("Is a ld snp!")
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
                            var ld_array_line={};
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
                    var disk_allele_regex=/-([A-Z]|\?)/
                    var ci_regex=/\[(.*?)\]/
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
                    
                    // fix format of risk allele and ci95
                    for (var i=0;i<tag_array.length;i++){
                        var risk_allele=disk_allele_regex.exec(tag_array[i].risk_allele)
                        var ci=ci_regex.exec(tag_array[i].ci95)
                        console.log(risk_allele)
                        console.log(ci)
                        if(risk_allele){
                            tag_array[i].risk_allele=risk_allele[1]
                        }
                        /*if(ci){
                            tag_array[i].ci95=ci[0]
                        }else{
                            tag_array[i].ci95="-"
                        }*/
                    }
                    $scope.tag_array=tag_array;
                    $scope.tag_line=tag_line;
                    // fix svg height
                    var h=$scope.ld_svg.length*(850/26)
                    $("#ld_svg").css({'height':h+'px'});
                    $("#ld_region").css({'height':h+'px'});
                    $scope.line_y=h
                    console.log("h")
                    console.log(h)
                   
                console.log("ld_array");
                console.log($scope.ld_array);
                console.log("ld_svg");
                console.log($scope.ld_svg);
                console.log("tag_array");
                console.log($scope.tag_array);
                console.log("tag_line");
                console.log($scope.tag_line);
                }
            })
    }
    $scope.search_ld();

    $scope.fetch_relate_cosmic=function(){
    	$http({
            url:base_url+'/api/cosmicinfo',
            //url:'/api/cosmicinfo',
            method: 'GET',
            params: {search_ids: $scope.query_snp,page:1}
        }).then(
            function (response) {
                console.log(response);
                $scope.rcosmic_list = response.data.cosmic_list;
                $scope.rcosmic_count = response.data.data_length
                var data_list=rcosmic_list
                for(var i=0;i<data_list.length;i++){
                    data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                }
            });
        };
    $scope.fetch_relate_clinvar=function(){
    	$http({
            url:base_url+'/api/clinvarinfo',
            //url:'/api/clinvarinfo',
            method: 'GET',
            params: {search_ids: $scope.query_snp,page:1}
        }).then(
            function (response) {
                console.log(response);
                $scope.rclinvar_list = response.data.clinvar_list;
                $scope.rclinvar_count = response.data.data_length
                var data_list=$scope.rclinvar_list
                for(var i=0;i<data_list.length;i++){
                    data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
            }});
	};
	$scope.fetch_relate_cosmic();
	$scope.fetch_relate_clinvar();
}