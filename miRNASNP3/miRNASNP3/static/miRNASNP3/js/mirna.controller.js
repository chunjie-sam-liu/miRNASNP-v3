'use strict';

angular.module('miRNASNP3')
    .controller('MirnaController', MirnaController);

function MirnaController($scope,$routeParams,$http,$filter,$document) {
    console.log("MirnaController loaded");
    $scope.error = 0;

    var page=1;

    $("[data-toggle='popover']").popover();
    $scope.query_mirna = $routeParams.mirna_id;
    console.log($routeParams.mirna_id);
    $scope.clear = function () {
        $scope.one = 0;
        $scope.two = 0;
        $scope.three = 0;
        $scope.four = 0;
        $scope.five = 0;
        $scope.six = 0;
    };
    $scope.one = 1;
    $scope.show_one = function (refer) {
        console.log(refer);
        $scope.clear();
        if (refer == "one") {
            $scope.one = 1;
            $scope.class_one = "ative";
        }
        if (refer == "two") {
            $scope.two = 1;
            $scope.class_two = "ative";
        }
        if (refer == "three") {
            $scope.three = 1;
            $scope.class_three = "ative";
        }
        if (refer == "four") {
            $scope.four = 1;
            $scope.class_four = "ative"
        }
        if (refer == "five") {
            $scope.five = 1;
            $scope.class_five = "ative"
        }
        if (refer == "six") {
            $scope.six = 1;
            $scope.class_six = "ative";
        }
    };
    $scope.fetch_mirna_details = function () {
        $http({
            url: '/api/mirinfo',
            method: 'GET',
            params: {search_ids: $scope.query_mirna}
        }).then(
            function (response) {
                console.log(response);
                $scope.mirna_summary_list = response.data.mirna_summary_list;
                $scope.mirna_summary_count=response.data.mirna_summary_count;
                $scope.mirna_summary_alias=$scope.mirna_summary_list.shift();
                $scope.mirna_alias=$scope.mirna_summary_list.length;
            });
    };
    $scope.fetch_mirna_details();

    $scope.fetch_mirna_expression=function(){
        $scope.mirna_expression_show=1;
        $http({
            url:'/api/mirna_expression',
            method:'Get',
            params:{mirna_id:$scope.query_mirna}
        }).then(function (response){
            console.log(response);
            $scope.mirna_expression=response.data.mirna_expression_list[0];
            $scope.mirna_expression_count=response.data.mirna_expresion_count;
            if(Number($scope.mirna_expression.exp_mean)==0){
                $scope.mirna_expression_show=0
            }
            var temp;
            var value;
            var array=[];
            var r,g,b;
            temp=$scope.mirna_expression.exp_df;
            for (var key in temp) {
                    if (temp[key]>500){
                        value=500
                    }else{
                        value = temp[key]
                    }
                    value=value/500*100-1;

                    if(value<50){
                        r = Math.floor(255*(value/50));
                        g = 255
                    }else{
                        r = 255;
                        g = Math.floor(255*((50-value%50)/50))
                    }
                    b = 0;
                    var p = "rgb("+r+","+g+","+b+")";
                    if (temp[key]){
                        array.push({"cancer_type":key,"expression":temp[key],"color":p})
                    }
                }
                console.log(array);
                $scope.mirna_profile = array;
        })
    };
    $scope.fetch_mirna_expression();



    $scope.fetch_target_gain = function (page) {
        console.log("fetch_target_gain");
        var query_gene_gain = $('#search_gene_gain').val();
    	$http({
			url:'/api/snp_seed_gain',
			method: 'GET',
			params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_gain}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.snp_seed_gain_list = response.data.snp_seed_gain_list;
                    $scope.snp_seed_gain_count=response.data.snp_seed_gain_count;
                })
            };
    $scope.fetch_target_gain(page);

    $scope.modal_gene_expression=function(exp){
        $scope.gene_expression=exp[0];
        //console.log($scope.gene_expression);
        var gene_expr = $scope.gene_expression.exp_df;
        var cancer_types=[];
        var expr=[];
        for(var cancer in gene_expr){
            cancer_types.push(cancer);
            expr.push(Number(gene_expr[cancer]))
        }
        //barplot
        var a = echarts;
        var myChart = a.init(document.getElementById('gene_expression'));
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
            params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_loss}
        }).then(
            function (response) {
                console.log(response);
                $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                $scope.snp_seed_loss_count = response.data.snp_seed_loss_count;
            });
        };
    $scope.fetch_target_loss(page);

    $scope.fetch_target_gain_mut = function (page) {
        console.log($scope.query_mirna);
    	$http({
			url:'/api/mut_seed_gain',
			method: 'GET',
			params: {mirna_id: $scope.query_mirna,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.mut_seed_gain_list = response.data.mut_seed_gain_list;
                    $scope.mut_seed_gain_count=response.data.mut_seed_gain_count;
                })
            };
    $scope.fetch_target_gain_mut(page);

    $scope.fetch_target_loss_mut = function (page) {
    	$http({
			url:'/api/mut_seed_loss',
			method: 'GET',
			params: {mirna_id: $scope.query_mirna,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.mut_seed_loss_list = response.data.mut_seed_loss_list;
                    $scope.mut_seed_loss_count=response.data.mut_seed_loss_count;
                })
            };
    $scope.fetch_target_loss_mut(page);

    $scope.fetch_enrich_result=function(){
        $http({
            url:'/api/enrich_result',
            method:'Get',
            params:{ search_ids:$scope.query_mirna}
        }).then(function (response) {
            console.log(response);
            $scope.enrich_result_list=response.data.enrich_result_list;
            $scope.enrich_count=response.data.enrich_result_count;
        })
    };
    $scope.fetch_enrich_result();


}

