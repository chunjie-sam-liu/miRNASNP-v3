'use strict';

angular.module('miRNASNP3')
    .controller('MirnaController', MirnaController);

function MirnaController($scope,$routeParams,$http,$filter,$document,miRNASNP3Service) {
    console.log("MirnaController loaded");
    $scope.error = 0;

    var page=1;
    var base_url = miRNASNP3Service.getAPIBaseUrl();

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
            //url: base_url+'/api/mirinfo',
            url:'/api/mirinfo',
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
            //url:base_url+'/api/mirna_expression',
            url:'/api/mirna_expression',
            method:'GET',
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
        console.log($scope.query_mirna);
        var query_gene_gain = $('#search_gene_gain').val();
    	$http({
			//url:base_url+'/api/snp_seed_gain',
            url:'/api/snp_seed_gain',
			method: 'GET',
			params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_gain}
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

   $scope.fetch_target_loss = function (page) {
        var query_gene_loss = $('#search_gene_loss').val();
    	$http({
            //url:base_url+'/api/snp_seed_loss',
            url:'/api/snp_seed_loss',
            method: 'GET',
            params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_loss}
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


    $scope.modal_gain_site_mut=function(site){
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
		    var distance=align8.length-site.mut_info.distance-1;
		    $scope.align8_pre=align8.substring(0,distance);
            $scope.align8_letter=align8[distance];
            $scope.align8_later=align8.substring(distance+1,align8.length);
        }
    $scope.modal_loss_site_mut=function(site){
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
        var distance=align8.length-site.mut_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        $scope.align8_letter=align8[distance];
        $scope.align8_later=align8.substring(distance+1,align8.length);
        }

    $scope.fetch_target_gain_mut = function (page) {
        console.log($scope.query_mirna);
    	$http({
            //url:base_url+'/api/mut_seed_gain',
            url:'/api/mut_seed_gain',
			method: 'GET',
			params: {mirna_id: $scope.query_mirna,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.mut_seed_gain_list = response.data.mut_seed_gain_list;
                    $scope.mut_seed_gain_count=response.data.mut_seed_gain_count;
                    var site_array=$scope.mut_seed_gain_list
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
    $scope.fetch_target_gain_mut(page);

    $scope.fetch_target_loss_mut = function (page) {
    	$http({
            //url:base_url+'/api/mut_seed_loss',
            url:'/api/mut_seed_loss',
			method: 'GET',
			params: {mirna_id: $scope.query_mirna,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.mut_seed_loss_list = response.data.mut_seed_loss_list;
                    $scope.mut_seed_loss_count=response.data.mut_seed_loss_count;
                    var site_array=$scope.mut_seed_loss_list
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
    $scope.fetch_target_loss_mut(page);

    $scope.fetch_enrich_result=function(){
        $http({
            //url:base_url+'/api/enrich_result',
            url:'/api/enrich_result',
            method:'GET',
            params:{mirna_id:$scope.query_mirna}
        }).then(function (response) {
            console.log(response);
            $scope.enrich_result_list=response.data.enrich_result_list;
            $scope.enrich_result_count=response.data.enrich_result_count;
        })
    };
    $scope.fetch_enrich_result();

    $scope.enrichment_view=function(filename){
        $scope.enrich_filename=filename;
        console.log($scope.enrich_filename)
    }


}

