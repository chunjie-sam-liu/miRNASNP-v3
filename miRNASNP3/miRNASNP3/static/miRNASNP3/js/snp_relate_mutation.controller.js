"use strict";

angular.module('miRNASNP3')
    .controller('SNPMutationController', SNPMutationController);

function SNPMutationController($scope,$routeParams,$http,miRNASNP3Service) {
    console.log("SNPMutationController loaded")
    var base_url = miRNASNP3Service.getAPIBaseUrl();

//copy------------------------

    $("[data-toggle='popover']").popover();

   // var base_url=miRNASNP3Service.getAPIBaseUrl();
    $scope.query_mutation=$routeParams.mut_id;
    $scope.query_snp=$routeParams.snp_id
    console.log($routeParams.snp_id);
	var page=1;

	$scope.clear=function(){
		$scope.one=0;
		$scope.two=0;
		$scope.three=0;
		$scope.four=0;
		$scope.five=0;
		$scope.six=0;
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
	};

    $scope.fetch_mutation_details=function(){
        var page=1;
    	$http({
            url: base_url+'/api/mutation_summary',
            //url:'/api/mutation_summary',
            method: 'GET',
            params: {mut_id:$scope.query_mutation,page:page}
        }).then(
            function (response) {
                console.log(response);
                $scope.mutation_summary_list=response.data.mutation_summary_list;
                $scope.mutation_summary_count=response.data.mutation_summary_count[0].count;
                var data_list=$scope.mutation_summary_list
                for(var i=0;i<data_list.length;i++){
                data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                if(data_list[i].resource=="clinvar"){data_list[i].resource="ClinVar"}
                if(data_list[i].resource=="cosmic"){data_list[i].resource="COSMIC"}
            }
                $scope.mutation_alias=$scope.mutation_summary_list.shift();
                console.log($scope.mutation_alias)
                $scope.mutation_alias_count=$scope.mutation_summary_list.length
                console.log($scope.mutation_alias_count)
            });
	};
	$scope.fetch_mutation_details();

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
        var source_data_expr=[]
        // var cancer_types=[];
        // var expr=[];
         for(var cancer in gene_expr){
             source_data_expr.push([cancer,gene_expr[cancer]])
             //cancer_types.push(cancer);
             //expr.push(Number(gene_expr[cancer]))
         }
         source_data_expr.sort(up)
        //barplot
        var a = echarts;
        var myChart = a.init(document.getElementById('expression'));
        myChart.setOption({
            dataset:{
                source:source_data_expr
            },
                color: ['#ce0000'],
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
                        //magicType: {show: true, type: ['line', 'bar']},
                        //restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        //data:cancer_types,
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
                       // data:expr
                    },
                ],
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
        var distance=align8.length-site.snp_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        $scope.align8_letter=align8[distance];
        $scope.align8_later=align8.substring(distance+1,align8.length);
        }


       /* $scope.modal_corelation_detail=function(cor){
            var cancer_count=0;
            var cor_sum=0;
            for(var cancer in cor.cor_df){
                if(cor.cor_df[cancer]){
                    cancer_count+=1;
                    cor_sum+=Number(cor.cor_df[cancer])
                }
            }
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
                        
                        r=Math.floor(value*255)/2
                        g=255-r
                        b = 0;
                        var p = "rgb("+r+","+g+","+b+")";
                        array.push({"cancer_type":key,"corelation":temp_cor,"color":p})
                        }
                    }
               
                $scope.corelation_detail = array; 
        }*/

        function up(x,y){return x[1]-y[1]}
          $scope.echart_correlation=function(cor){
            $scope.gene_mir=cor.mir_gene;
            var c=echarts;
            var cor_echart=c.init(document.getElementById('correlation'));
            var source_data=[]
            //var source_data=[["cancer_types", "correlation"]]
            //cor.cor_df.sort(up)
            console.log(cor.cor_df)
            for(var cancer in cor.cor_df){
                if(cor.cor_df[cancer]){
                    var item=[cancer,Number(cor.cor_df[cancer])]
                    source_data.push(item)
                }
            }
            source_data.sort(up)
            source_data.unshift(["cancer_types", "correlation"])
            console.log(source_data)
           
            var option = {
                dataset: {
                    source:source_data
                },
               
                xAxis:{name:'Correlation',
                nameTextStyle:{
                    align:'right',
                    fontSize:12,
                    fontWeight:'bold',
                },
                type:'value',
                splitLine:{
                    show:false
                    　　}
                },
                yAxis:{
                    type:'category',
                axisLine:{
                    show:true
                },
                
                /*splitLine:{
                    show:false
                    　　}*/},
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
                        //dataView: {show: true, readOnly: false},
                        //magicType: {show: true, type: ['line', 'bar']},
                        //restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
            color:'#0000c6',
            
           series: [
            {
             type: 'bar',
                encode: {
                x:'correlation',
                y:'cancer_types' 
            },
        }],
    };
            cor_echart.setOption(option)
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
		var distance=Number(site.snp_info.distance_align)+3;
		$scope.align6_pre=align6.substring(0,distance);
        $scope.align6_letter=align6[distance];
        $scope.align6_later=align6.substring(distance+1,align6.length);
        }

        $scope.modal_loss_site_utr=function(site){
            $scope.modal_header="Target Loss";
            $scope.modal_site=site;
            var align6=site.site_info.align6;
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


//end-------------------------



}