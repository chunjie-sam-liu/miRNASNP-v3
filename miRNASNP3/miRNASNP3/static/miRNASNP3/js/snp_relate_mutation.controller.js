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
    $scope.query_snp=$routeParams.snp_id;
    var location=$routeParams.location;
    console.log($routeParams.snp_id);
    console.log(location)
	var page=1;

    var one=$routeParams.one;
    var two=$routeParams.two;
    var three=$routeParams.three;
    var four=$routeParams.four;
    var five=$routeParams.five;

	$scope.clear=function(){
		$scope.one=0;
		$scope.two=0;
		$scope.three=0;
		$scope.four=0;
		$scope.five=0;
		$scope.six=0;
	};
	
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
    
    function distinct(a) {
        let arr = a
        let result = []
        let obj = {}
        for (let i of arr) {
            if (!obj[i]) {
                result.push(i)
                obj[i] = 1
            }
        }
        return result
        }

    if(one){$scope.show_one('one');$('#one').addClass('active')}
    else if(two){$scope.show_one('two');$('#two').addClass('active')}
    else if(three){$scope.show_one('three');$('#three').addClass('active')}
    else if(four){$scope.show_one('four');$('#four').addClass('active')}
    else if(five){$scope.show_one('five');$('#five').addClass('active')}

    $scope.fetch_mutation_details=function(){
    var page=1;
    	switch(location){
            case 'mirseed':
                {
                $http({
                    url:base_url+'/api/mutation_summary_seed',
                    method:'GET',
                    params:{mut_id:$scope.query_mutation}
                }).then(function(response){
                    console.log(response)
                    $scope.initial=0;
                    $scope.mutation_summary_list=response.data.mutation_seed_list;
                    $scope.mutation_summary_count=response.data.mutation_seed_count[0].count;
                    var data_list=$scope.mutation_summary_list
                for(var i=0;i<data_list.length;i++){
                    data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                    if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                    if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                    //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                    data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                    data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                    data_list[i].head_identifier='miRNA'
                }
                $scope.mutation_alias=$scope.mutation_summary_list.shift();
                console.log($scope.mutation_alias)
                $scope.mutation_alias_count=$scope.mutation_summary_list.length
                console.log($scope.mutation_alias_count)
                })
                break;
            }
            case 'mature':
                {
                    $http({
                        url:base_url+'/api/mutation_summary_mature',
                        method:'GET',
                        params:{mut_id:$scope.query_mutation}
                    }).then(function(response){
                        console.log(response)
                        $scope.initial=0;
                        $scope.mutation_summary_list=response.data.mutation_mature_list;
                        $scope.mutation_summary_count=response.data.mutation_mature_count[0].count;
                        var data_list=$scope.mutation_summary_list
                    for(var i=0;i<data_list.length;i++){
                        data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                        if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                        if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                        //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                        //data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                        //data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                        data_list[i].head_identifier='miRNA'
                    }
                    $scope.mutation_alias=$scope.mutation_summary_list.shift();
                    console.log($scope.mutation_alias)
                    $scope.mutation_alias_count=$scope.mutation_summary_list.length
                    console.log($scope.mutation_alias_count)
                    })
                    break;  
                }
            case 'pre-miRNA':
                {
                    $http({
                        url:base_url+'/api/mutation_summary_premir',
                        method:'GET',
                        params:{mut_id:$scope.query_mutation}
                    }).then(function(response){
                        console.log(response)
                        $scope.initial=0;
                        $scope.mutation_summary_list=response.data.mutation_premir_list;
                        $scope.mutation_summary_count=response.data.mutation_premir_count[0].count;
                        var data_list=$scope.mutation_summary_list
                    for(var i=0;i<data_list.length;i++){
                        data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                        if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                        if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                        //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                        //data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                        //data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                        data_list[i].head_identifier='miRNA'
                    }
                    $scope.mutation_alias=$scope.mutation_summary_list.shift();
                    console.log($scope.mutation_alias)
                    $scope.mutation_alias_count=$scope.mutation_summary_list.length
                    console.log($scope.mutation_alias_count)
                    })
                    break; 
                }
            case 'UTR3':
                {
                    $http({
                        url:base_url+'/api/mutation_summary_utr3',
                        method:'GET',
                        params:{mut_id:$scope.query_mutation}
                    }).then(function(response){
                        console.log(response)
                        $scope.initial=0;
                        $scope.mutation_summary_list=response.data.mutation_utr3_list;
                        $scope.mutation_summary_count=response.data.mutation_utr3_count[0].count;
                        var data_list=$scope.utr3_list
                    for(var i=0;i<data_list.length;i++){
                        data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                        if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                        if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                        if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                        data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                        data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                        data_list[i].head_identifier='Gene'
                    }
                    $scope.mutation_alias=$scope.mutation_summary_list.shift();
                    console.log($scope.mutation_alias)
                    $scope.mutation_alias_count=$scope.mutation_summary_list.length
                    console.log($scope.mutation_alias_count)
                    })  
                }
    }
    }
	$scope.fetch_mutation_details();

    $scope.fetch_target_gain = function (page) {
        console.log("fetch_target_gain");
        var flag=0;
        var query_gene_gain = $.trim($('#search_gene').val());
            console.log(query_gene_gain)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
    	$http({
            //url:base_url+base_url+'/api/snp_seed_gain',
            url:base_url+'/api/snp_seed_gain',
			method: 'GET',
			params: {snp_id: $scope.query_snp,page:page,gene:query_gene_gain}
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
                    if(site_array[i].utr_info.acc.length>1){
                        var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                        site_array[i].utr_info.acc=deduplicate_arr
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
            };
    $scope.fetch_target_gain(page);

    $(document).ready(function(){
        var flag=0;
        $('#search_gene').on('input propertychange', function() {
            $scope.currentPage_seedgain=1
            var query_gene_gain = $.trim($('#search_gene').val());
            console.log(query_gene_gain)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                console.log(query_gene_gain)
                $http({
                    //url:base_url+base_url+'/api/snp_seed_gain',
                    url:base_url+'/api/snp_seed_gain',
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
                                if(site_array[i].utr_info.acc.length>1){
                                    var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                                    site_array[i].utr_info.acc=deduplicate_arr
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
        echarts.init(document.getElementById('expression')).dispose();
        var myChart = echarts.init(document.getElementById('expression'));
        var series_list=[]
        $scope.expression=exp[0];
        $scope.exp_item=title;
        console.log($scope.expression);
        var gene_expr = $scope.expression.exp_df;
        var cancer_types=['cancer_type'];
        var expr=['RPKM'];
       
        for(var cancer in gene_expr){
            var source_data={}
            var labelOption={}
            if(gene_expr[cancer]&&Number(gene_expr[cancer])!=0){
                labelOption = {
                    normal: {
                        show: true,
                        position: 'top',
                        distance: 5,
                        align: 'left',
                        verticalAlign: 'middle',
                        rotate: 90,
                        formatter:'{name|{a}}',
                        fontSize: 8,
                        rich: {
                            name: {
                                color:'#000000',
                                textBorderColor: '#000000'
                            }
                        }
                    }
                };
                source_data['data']=[gene_expr[cancer]]
                series_list.push(source_data)
                cancer_types.push(cancer)
                expr.push(gene_expr[cancer])
                source_data['label']=labelOption;
                source_data['name']=cancer;
                source_data['type']='bar';
                source_data['barGap']=0.2;
                source_data['barWidth']=23
            }
            
        }
        //source_data_expr.sort(up)
        console.log(series_list)
        
        myChart.setOption({
            //dataset:{
            //    source:[cancer_types,expr]
            //},
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show:false},
                   
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name:'RPKM',
                    nameTextStyle:{
                        align:'left',
                        fontSize:12,
                        fontWeight:'bold',
                    }}
                ],
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: series_list,
                color: ['#600000','#ff79bc','#930093','#b15bff','#000093','#46a3ff','#005757','#1afd9c','#007500',
                        '#b7ff4a','#737300','#ffdc35','#ff8000','#ff9d6f','#984b4b','#c2c287','#408080','5a5aad',
                        '#6c3365','	#ff5151','#820041','#ff00ff','#3a006f','#0000c6','#66b3ff','#00a600','#ce0000',
                        '#b15bff','#00db00','#796400','#004b97','#f9f900','#bb3d00'],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                series: series_list,
                grid:{
                    x:45,
                    y:35,
                    x2:30,
                    y2:20,
                    borderWidth:1
                   },
            });
    };
    var RULE1={
        'A':'U',
        'T':'A',
        'C':'G',
        'G':'C',
        'N':'N'
    }
	$scope.modal_gain_site=function(site){
        $scope.modal_header="Target Gain";
        $scope.target_gain=1;
        $scope.target_loss=0;
		$scope.modal_site=site;
		var align8=site.site_info.align8;
		var distance=align8.length-site.snp_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        $scope.align8_letter=align8[distance];
        $scope.align8_later=align8.substring(distance+1,align8.length);
        }
    $scope.modal_loss_site=function(site){
        $scope.modal_header="Target Loss";
        $scope.target_gain=0;
        $scope.target_loss=1;
		$scope.modal_site=site;
        var align8=site.site_info.align8;
        var align7=site.site_info.align7;
        console.log(align7)
        var distance=align8.length-site.snp_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        if(site.strand=='-'){
            $scope.align8_letter=RULE1[site.snp_info.curalt]
        }else{
            $scope.align8_letter=site.snp_info.curalt;
        }
        $scope.align8_later=align8.substring(distance+1,align8.length);
        $scope.align7_pre=align7.substring(0,distance);
        console.log($scope.align7_pre)
        $scope.align7_letter='X';
        $scope.align7_later=align7.substring(distance+1,align7.length);
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
            $scope.gene_mir=cor.mir_gene.split('_')[0]+" correlates with "+cor.mir_gene.split('_')[1];
            var c=echarts;
            c.init(document.getElementById('correlation')).dispose();
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
                min:-1,
                max:1,
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
                /*toolbox: {
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
                },*/
            color:'#0000c6',
            
            series: [
                {
                 type: 'bar',
                    encode: {
                    x:'correlation',
                    y:'cancer_types' 
                },
                barWidth:10,
                barGap:2
            }],
    };
            cor_echart.setOption(option)
        }



    $scope.fetch_target_loss = function (page) {
        var flag=0;
        var query_gene_loss = $.trim($('#search_gene_loss').val());
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
    	$http({
        	//url:base_url+base_url+'/api/snp_seed_loss',
            url:base_url+'/api/snp_seed_loss',
            method: 'GET',
            params: {snp_id: $scope.query_snp,page:page,gene:query_gene_loss}
        }).then(
            function (response) {
                console.log(response);
                $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                $scope.snp_seed_loss_count = response.data.snp_seed_loss_count;
                var site_array=$scope.snp_seed_loss_list
                for(var i=0;i<site_array.length;i++){
                    site_array[i].has_cor=1
                    if(site_array[i].expr_corelation){
                        if(site_array[i].expr_corelation=='Not significant'){site_array[i].expr_corelation="0.00"}
                        else{site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)}
                    }
                    if(site_array[i].mirna_expression[0]){
                        if(Number(site_array[i].mirna_expression[0].exp_mean)==0){site_array[i].mirna_expression[0]=0;site_array[i].has_cor=0}
                    }else{site_array[i].has_cor=0}
                    if(site_array[i].gene_expression[0]){
                        if(Number(site_array[i].gene_expression[0].exp_mean)==0){site_array[i].gene_expression[0]=0;site_array[i].has_cor=0} 
                    }else{site_array[i].has_cor=0}
                    if(site_array[i].utr_info.acc.length>1){
                        var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                        site_array[i].utr_info.acc=deduplicate_arr
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
        };
    $scope.fetch_target_loss(page);

    $(document).ready(function(){
        var flag=0;
        $('#search_gene_loss').on('input propertychange', function() {
            $scope.currentPage_seedloss=1
            var query_gene_loss = $.trim($('#search_gene_loss').val());
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                console.log(query_gene_loss)
                $http({
                    //url:base_url+base_url+'/api/snp_seed_loss',
                    url:base_url+'/api/snp_seed_loss',
                    method: 'GET',
                    params: {snp_id: $scope.query_snp,page:page,gene:query_gene_loss}
                    }).then(
                        function (response) {
                            console.log(response);
                            $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                            $scope.snp_seed_loss_count=response.data.snp_seed_loss_count+1;
                            var site_array=$scope.snp_seed_loss_list
                            for(var i=0;i<site_array.length;i++){
                                site_array[i].has_cor=1
                                if(site_array[i].expr_corelation){
                                    if(site_array[i].expr_corelation=='Not significant'){site_array[i].expr_corelation="0.00"}
                                else{site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)}
                                }
                                if(site_array[i].mirna_expression[0]){
                                    if(Number(site_array[i].mirna_expression[0].exp_mean)==0){site_array[i].mirna_expression[0]=0;site_array[i].has_cor=0}
                                }else{site_array[i].has_cor=0}
                                if(site_array[i].gene_expression[0]){
                                    if(Number(site_array[i].gene_expression[0].exp_mean)==0){site_array[i].gene_expression[0]=0;site_array[i].has_cor=0} 
                                }else{site_array[i].has_cor=0}
                                if(site_array[i].utr_info.acc.length>1){
                                    var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                                    site_array[i].utr_info.acc=deduplicate_arr
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
        $scope.target_gain=1
        $scope.target_loss=0
		$scope.modal_site=site;
		var align6=site.site_info.align6;
		    var distance=Number(site.snp_info.distance_align)+3;
		    $scope.align6_pre=align6.substring(0,distance);
            $scope.align6_letter=align6[distance];
            $scope.align6_later=align6.substring(distance+1,align6.length);
        }

        $scope.modal_loss_site_utr=function(site){
            $scope.modal_header="Target Loss";
            $scope.target_loss=1
            $scope.target_gain=0
            $scope.modal_site=site;
            var align6=site.site_info.align6;
            var align7=site.site_info.align7;
                var distance=Number(site.snp_info.distance_align)+3;
                $scope.align6_pre=align6.substring(0,distance);
                if(site.utr_info.strand=='-'){
                    $scope.align6_letter=RULE1[site.snp_info.curalt]
                }else{
                    $scope.align6_letter=site.snp_info.curalt;
                }
                $scope.align6_later=align6.substring(distance+1,align6.length);
                $scope.align7_pre=align7.substring(0,distance);
                $scope.align7_letter='X';
                $scope.align7_later=align7.substring(distance+1,align7.length);
            }


    $scope.fetch_snv_utr_loss=function(page){
        $http({
            //url:base_url+base_url+'/api/snv_utr_loss',
            url:base_url+'/api/snv_utr_loss',
            method:'Get',
            params:{snp_id:$scope.query_snp,page:page}
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_loss_list=response.data.snv_utr_loss_list;
            $scope.snv_utr_loss_count=response.data.snv_utr_loss_count;
            var site_array=$scope.snv_utr_loss_list
                for(var i=0;i<site_array.length;i++){
                    site_array[i].has_cor=1
                    if(site_array[i].expr_corelation){
                        if(site_array[i].expr_corelation=='Not significant'){site_array[i].expr_corelation="0.00"}
                        else{site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)}
                    }
                    if(site_array[i].mirna_expression[0]){
                        if(Number(site_array[i].mirna_expression[0].exp_mean)==0){site_array[i].mirna_expression[0]=0;site_array[i].has_cor=0}
                    }else{site_array[i].has_cor=0}
                    if(site_array[i].gene_expression[0]){
                        if(Number(site_array[i].gene_expression[0].exp_mean)==0){site_array[i].gene_expression[0]=0;site_array[i].has_cor=0} 
                    }else{site_array[i].has_cor=0}
                    if(site_array[i].utr_info.acc.length>1){
                        var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                        site_array[i].utr_info.acc=deduplicate_arr
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
            //url:base_url+base_url+'/api/snv_utr_gain',
            url:base_url+'/api/snv_utr_gain',
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
                    if(site_array[i].utr_info.acc.length>1){
                        var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                        site_array[i].utr_info.acc=deduplicate_arr
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
    }
//end-------------------------