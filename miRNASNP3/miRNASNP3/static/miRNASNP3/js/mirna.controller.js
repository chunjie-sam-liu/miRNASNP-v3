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
        $scope.enrich_dot=0;
        $scope.enrich_cnet=0;
        $scope.enrich_emap=0;
        $scope.enrich_table=0;
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
        if(refer=="enrich_dot"){
            $scope.enrich_dot=1;
            $scope.class_enrich_dot="active";
        }
        if(refer=="enrich_cnet"){
            $scope.enrich_cnet=1;
            $scope.class_enrich_cnet="active";
        }
        if(refer=="enrich_emap"){
            $scope.enrich_emap=1;
            $scope.class_enrich_emap="active";
        }
        if(refer=="enrich_table"){
            $scope.enrich_table=1;
            $scope.class_enrich_table="active";
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
            $scope.mirna_expression_count=response.data.mirna_expression_count;
            $scope.mirna_expression_show=1
            if($scope.mirna_expression_count==0){
                $scope.mirna_expression_show=0
            }else if(Number($scope.mirna_expression.exp_mean)==0){
                $scope.mirna_expression_show=0
            }
            console.log($scope.mirna_expression.exp_mean)
            var temp;
            var value;
            var array=[];
            var r,g,b;
            temp=$scope.mirna_expression.exp_df;
            console.log($scope.mirna_expression_show)
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
        console.log("fetch target gain!")
        console.log(page)
        //console.log($scope.query_mirna);
            $http({
                //url:base_url+'/api/snp_seed_gain',
                url:'/api/snp_seed_gain',
                method: 'GET',
                params: {mirna_id: $scope.query_mirna,page:page}
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
        }
    $scope.fetch_target_gain(page);

    
        //console.log(query_item);
        $(document).ready(function(){
            var flag=0;
            $('#search_gene_gain').on('input propertychange', function() {
                var query_gene_gain = $('#search_gene_gain').val();
                console.log(query_gene_gain)
                if (/[@#\$%\^&\*<>\.]+/g.test(query_gene_gain)) {
                    alert("Invalid input");
                    flag = 1;
                    history.back();
                }
                if(flag==0){
                    console.log(query_gene_gain)
                    $http({
                        //url:base_url+'/api/snp_seed_gain',
                        url:'/api/snp_seed_gain',
                        method: 'GET',
                        params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_gain}
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
            $http({
                //url:base_url+'/api/snp_seed_loss',
                url:'/api/snp_seed_loss',
                method: 'GET',
                params: {mirna_id: $scope.query_mirna,page:page}
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
        }
       
    $scope.fetch_target_loss(page);

    $(document).ready(function(){
        var flag=0;
        $('#search_gene_loss').on('input propertychange', function() {
            var query_gene_loss = $('#search_gene_loss').val();
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                $http({
                    //url:base_url+'/api/snp_seed_loss',
                    url:'/api/snp_seed_loss',
                    method: 'GET',
                    params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_loss}
                }).then(
                    function (response) {
                        console.log(response);
                        $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                        $scope.snp_seed_loss_count = response.data.snp_seed_loss_count+1;
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
            }
        });
      });

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

    $(document).ready(function(){
        var flag=0;
        $('#search_gene_gain_mut').on('input propertychange', function() {
            var query_gene_gain = $('#search_gene_gain_mut').val();
            console.log(query_gene_gain)
            if (/[@#\$%\^&\*<>\.]+/g.test(query_gene_gain)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                console.log(query_gene_gain)
                $http({
                    //url:base_url+'/api/snp_seed_gain',
                    url:'/api/mut_seed_gain',
                    method: 'GET',
                    params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_gain}
                    }).then(
                        function (response) {
                            console.log(response);
                            $scope.mut_seed_gain_list = response.data.mut_seed_gain_list;
                            $scope.mut_seed_gain_count=response.data.mut_seed_gain_count+1;
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
            }
        });
      });

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

    $(document).ready(function(){
        var flag=0;
        $('#search_gene_loss_mut').on('input propertychange', function() {
            var query_gene_loss = $('#search_gene_loss_mut').val();
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                console.log(query_gene_loss)
                $http({
                    //url:base_url+'/api/snp_seed_gain',
                    url:'/api/mut_seed_loss',
                    method: 'GET',
                    params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_loss}
                    }).then(
                        function (response) {
                            console.log(response);
                            $scope.mut_seed_loss_list = response.data.mut_seed_loss_list;
                            $scope.mut_seed_loss_count=response.data.mut_seed_loss_count+1;
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
            var data_list=$scope.enrich_result_list
            for(var j=0;j<data_list.length;j++){
                for(var i=0;i<data_list[j].csv_table.length;i++){
                    data_list[j].csv_table[i].pvalue_fix=Number(data_list[j].csv_table[i].pvalue).toExponential(3)
                    data_list[j].csv_table[i].qvalue_fix=Number(data_list[j].csv_table[i].qvalue).toExponential(3)
                    data_list[j].csv_table[i].padjust_fix=Number(data_list[j].csv_table[i].padjust).toExponential(3)
                }
            }
        })
    };
    $scope.fetch_enrich_result();

    $scope.enrichment_view=function(e){
        $scope.enrich_item=e
        $scope.csv_table=e.csv_table
        console.log($scope.csv_table)
        $scope.show_dot=0;
        $scope.show_cnet=0;
        $scope.show_emap=0;
        $scope.show_table=1;
        if(e.dot_file){$scope.show_dot=1}
        if(e.chet_file){$scope.show_cnet=1}
        if(e.emap_file){$scope.show_emap=1}
        //console.log($scope.enrich_filename)
    }


}

