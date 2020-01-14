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
   function up(x,y){return x[1]-y[1]}
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $scope.error=0;
    $("[data-toggle='popover']").popover();

   // var base_url=miRNASNP3Service.getAPIBaseUrl();
    $scope.query_snp=$routeParams.snp_id;
    console.log($routeParams.snp_id);
	var page=1;
    var one=$routeParams.one;
    var two=$routeParams.two;
    var three=$routeParams.three;
    var four=$routeParams.four;
    var five=$routeParams.five;
    var location=$routeParams.location
		
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

    console.log('two')
    console.log(two)
    console.log('three')
    console.log(three)
    if(one){$scope.show_one('one');$('#one').addClass('active')}
    else if(two){$scope.show_one('two');$('#two').addClass('active')}
    else if(three){$scope.show_one('three');$('#three').addClass('active')}
    else if(four){$scope.show_one('four');$('#four').addClass('active')}
    else if(five){$scope.show_one('five');$('#five').addClass('active')}
    else if(six){$scope.show_one('six');$('#six').addClass('active')}

	//$scope.fetch_gwas=function(){};

    //$scope.string2list = function (predict_info) {
      //  $scope.site_info = eval(predict_info)
   // };

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

    $scope.fetch_snp_details_seed=function(){
        var page=1;
    	$http({
            //url:base_url+ base_url+'/api/snp_summary',
            url:base_url+'/api/snp_summary_seed',
            method: 'GET',
            params: {snp_id: $scope.query_snp}
        }).then(
            function (response) {
                console.log(response);
                $scope.snp_summary_list = response.data.snp_seed_list;
                $scope.snp_summary_count=response.data.snp_seed_count;
                var data_list=$scope.snp_summary_list
                $scope.has_alt_freq=0
                $scope.position_list=[]
                for(var i=0;i<data_list.length;i++){
                    if(data_list[i].ref_freq=='novalue'){data_list[i].ref_freq=0}
                    if(Number(data_list[i].alt_freq)==0.0){data_list[i].alt_freq=0}
                    if(Number(data_list[i].ref_freq)==0.0){data_list[i].ref_freq=0}
                    if(data_list[i].location=='Seed'){$scope.head_identifier='miRNA';
                        data_list[i].location='Seed';
                        $scope.identifier_url="http://www.mirbase.org/textsearch.shtml?q="+data_list[i].mature_id;
                        data_list[i].identifier=data_list[i].mature_id
                    }
                   // if(data_list[i].location=='UTR3'){$scope.head_identifier='Gene';data_list[i].location="3'UTR";$scope.identifier_url="https://www.genecards.org/cgi-bin/carddisp.pl?gene="+data_list[i].identifier}
                   // if(data_list[i].location=='pre-miRNA'){$scope.head_identifier='miRNA';$scope.identifier_url="http://www.mirbase.org/textsearch.shtml?q="+data_list[i].identifier}
                   // if(data_list[i].location=='mature'){$scope.head_identifier='miRNA';$scope.identifier_url="http://www.mirbase.org/textsearch.shtml?q="+data_list[i].identifier}
                    $scope.position_list.push(data_list[i].snp_chr+':'+data_list[i].snp_position)
                }
                for(var i=0;i<data_list.length;i++){
                    if(data_list[i].alt_freq!='NA'){
                        $scope.has_alt_freq=1
                    }
                }
                var pl=distinct($scope.position_list)
                $scope.snp_position_list=''
                for(let p of pl){
                    $scope.snp_position_list+=p+','
                }
                if(data_list.length>1){
                    $scope.snp_alt=''
                    $scope.alt_freq=''
                    for(var i=0;i<data_list.length;i++){
                        $scope.snp_alt+=String(data_list[i].curalt)+','
                        if($scope.has_alt_freq){
                            if(data_list[i].alt_freq){
                                $scope.alt_freq=$scope.alt_freq+String(data_list[i].alt_freq)+','
                            }else{
                                $scope.alt_freq+='-,'
                            }
                        }
                        
            }
            $scope.snp_alt=$scope.snp_alt.substring(0,$scope.snp_alt.length-1)
            $scope.alt_freq=$scope.alt_freq.substring(0,$scope.alt_freq.length-1)
            console.log($scope.snp_position_list)
            $scope.snp_position_list=$scope.snp_position_list.substring(0,$scope.snp_position_list.length-1)
        }else{
            $scope.snp_alt=data_list[0].curalt
            $scope.alt_freq=data_list[0].alt_freq
            $scope.snp_position_list=$scope.snp_position_list.substring(0,$scope.snp_position_list.length-1)
        }
            
                
                $scope.snp_summary_list=data_list
                console.log($scope.snp_summary_list)
                $scope.snp_summary_alias=$scope.snp_summary_list.shift();
               // $scope.snp_summary_alias_count=$scope.snp_summary_list.length
            });
    };
    $scope.fetch_snp_detail_utr=function(){
        var page=1;
    	$http({
            //url:base_url+ base_url+'/api/snp_summary',
            url:base_url+'/api/snp_summary_utr3',
            method: 'GET',
            params: {snp_id: $scope.query_snp}
        }).then(
            function (response) {
                console.log(response);
                $scope.snp_summary_list = response.data.snp_utr3_list;
                $scope.snp_summary_count=response.data.snp_utr3_count;
                var data_list=$scope.snp_summary_list
                $scope.has_alt_freq=0
                $scope.position_list=[]
                $scope.snp_alt=''
                for(var i=0;i<data_list.length;i++){
                   // if(data_list[i].ref_freq=='novalue'){data_list[i].ref_freq=0}
                    //if(Number(data_list[i].alt_freq)==0.0){data_list[i].alt_freq=0}
                    //if(Number(data_list[i].ref_freq)==0.0){data_list[i].ref_freq=0}
                    if(data_list[i].location=='UTR3'){$scope.head_identifier='Gene';
                        data_list[i].location="3'UTR";
                        $scope.identifier_url="https://www.genecards.org/cgi-bin/carddisp.pl?gene="+data_list[i].gene;
                        data_list[i].identifier=data_list[i].gene
                    }
                   // if(data_list[i].location=='UTR3'){$scope.head_identifier='Gene';data_list[i].location="3'UTR";$scope.identifier_url="https://www.genecards.org/cgi-bin/carddisp.pl?gene="+data_list[i].identifier}
                   // if(data_list[i].location=='pre-miRNA'){$scope.head_identifier='miRNA';$scope.identifier_url="http://www.mirbase.org/textsearch.shtml?q="+data_list[i].identifier}
                   // if(data_list[i].location=='mature'){$scope.head_identifier='miRNA';$scope.identifier_url="http://www.mirbase.org/textsearch.shtml?q="+data_list[i].identifier}
                    $scope.position_list.push(data_list[i].snp_chr+':'+data_list[i].snp_position)
                }
               
                for(var i=0;i<data_list.length;i++){
                    if(data_list[i].alt_freq!='NA'){
                        $scope.has_alt_freq=1
                    }
                }
                var pl=distinct($scope.position_list)
                $scope.snp_position_list=''
                for(let p of pl){
                    $scope.snp_position_list+=p+','
                }
                if(data_list.length>1){
                    $scope.snp_alt=''
                    $scope.alt_freq=''
                    for(var i=0;i<data_list.length;i++){
                        $scope.snp_alt+=String(data_list[i].curalt)+','
                        if($scope.has_alt_freq){
                            if(data_list[i].alt_freq!='NA'){
                                $scope.alt_freq=$scope.alt_freq+String(data_list[i].alt_freq)+','
                            }else{
                                $scope.alt_freq+='-,'
                            }
                        }
                        
            }
            $scope.snp_alt=$scope.snp_alt.substring(0,$scope.snp_alt.length-1)
            $scope.alt_freq=$scope.alt_freq.substring(0,$scope.alt_freq.length-1)
            console.log($scope.snp_position_list)
            $scope.snp_position_list=$scope.snp_position_list.substring(0,$scope.snp_position_list.length-1)
        }else{
            $scope.snp_alt=data_list[0].curalt
            $scope.alt_freq=data_list[0].alt_freq
            $scope.snp_position_list=$scope.snp_position_list.substring(0,$scope.snp_position_list.length-1)
        }
            
                
                $scope.snp_summary_list=data_list
                console.log($scope.snp_summary_list)
                $scope.snp_summary_alias=$scope.snp_summary_list.shift();
               // $scope.snp_summary_alias_count=$scope.snp_summary_list.length
            });
    }

    if(location=='Seed'){$scope.fetch_snp_details_seed();}
    if(location=='UTR3'){$scope.fetch_snp_detail_utr();}

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
                    $scope.snp_seed_gain_list=response.data.snp_seed_gain_list
                    $scope.snp_seed_gain_count=response.data.snp_seed_gain_count
                    var site_array=$scope.snp_seed_gain_list
                   /*var site_array = response.data.snp_seed_gain_list;
                    $scope.snp_seed_gain_count=0
                    for(var i=0;i<response.data.snp_seed_gain_count.length;i++){
                        $scope.snp_seed_count+=response.data.snp_seed_gain_count[i].count
                    }
                for(var i=0;i<site_array.length;i++){
                    $scope.snp_seed_gain_list[i]=site_array[i]._id
                    var ref_number=$scope.snp_seed_gain_list[i].ref_seq[0].split('_')[1]
                    var acc=$scope.snp_seed_gain_list[i].ref_seq[0]
                    for(var i=0;i<$scope.snp_seed_gain_list[i].ref_seq.length;i++){
                        var ref_number_cur=$scope.snp_seed_gain_list[i].ref_seq[i].split('_')[1]
                        if(Number(ref_number_cur)<Number(ref_number)){
                            ref_number=ref_number_cur
                            acc=$scope.snp_seed_gain_list[i].ref_seq[i]
                        }
                    }
                    site_array[i].utr_info['acc']=acc*/
                    for(var i=0;i<site_array.length;i++){
                    site_array[i].has_cor=1
                    if(site_array[i].expr_corelation){
                        site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                    }
                    if(site_array[i].mirna_expression[0]){
                        if(Number(site_array[i].mirna_expression[0].exp_mean)==0){site_array[i].mirna_expression[0]=0;site_array[i].has_cor=0}
                    }else{site_array[i].has_cor=0}
                    if(site_array[i].gene_expression[0]){
                        if(Number(site_array[i].gene_expression[0].exp_mean)==0){site_array[i].gene_expression[0]=0;site_array[i].has_cor=0} 
                    }else{site_array[i].has_cor=0}
                    site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                    site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                    site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                    site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                    site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                    site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                }
                $scope.snp_seed_gain_list=site_array
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
                                site_array[i].has_cor=1
                                if(site_array[i].expr_corelation){
                                    site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                                }
                                if(site_array[i].mirna_expression[0]){
                                    if(Number(site_array[i].mirna_expression[0].exp_mean)==0){site_array[i].mirna_expression[0]=0;site_array[i].has_cor=0}
                                }else{site_array[i].has_cor=0}
                                if(site_array[i].gene_expression[0]){
                                    if(Number(site_array[i].gene_expression[0].exp_mean)==0){site_array[i].gene_expression[0]=0;site_array[i].has_cor=0} 
                                }else{site_array[i].has_cor=0}
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

    $scope.modal_expression=function(exp,title,expr_type){ 
        echarts.init(document.getElementById('expression')).dispose();
        var myChart = echarts.init(document.getElementById('expression'));
        var series_list=[]
        $scope.expression=exp[0];
        $scope.exp_item=title;
        console.log($scope.expression);
        if(expr_type=='gene'){
            var expression_unit='RSEM'
        }
        if(expr_type=='miRNA'){
            var expression_unit='RSEM'
        }
        var gene_expr = $scope.expression.exp_df;
        var cancer_types=['cancer_type'];
        var expr=[expression_unit];
       
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
                    name:expression_unit,
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
        if(site.snp_info.curalt.length==1){
         var align8=site.site_info.align8;
		var distance=align8.length-site.snp_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        $scope.align8_letter=align8[distance];
        $scope.align8_later=align8.substring(distance+1,align8.length);
        }else{
            if(site.strand=='-'){
                var align8=site.site_info.align8;
                var distance=align8.length-site.snp_info.distance-1;
                var curalt_len=site.snp_info.curalt.length
                $scope.align8_pre=align8.substring(0,distance);
                $scope.align8_letter=align8.substring(distance,distance+curalt_len);
                $scope.align8_later=align8.substring(distance+curalt_len,align8.length);
            }else{
                var align8=site.site_info.align8;
                var distance=align8.length-site.snp_info.distance-1;
                var curalt_len=site.snp_info.curalt.length
                $scope.align8_pre=align8.substring(0,distance-curalt_len);
                $scope.align8_letter=align8.substring(distance-curalt_len,distance);
                $scope.align8_later=align8.substring(distance,align8.length);
            }
        }
        }
    $scope.modal_loss_site=function(site){
        $scope.modal_header="Target loss";
        $scope.target_gain=0;
        $scope.target_loss=1;
		$scope.modal_site=site;
        var align8=site.site_info.align8;
        var align7=site.site_info.align7;
        console.log(align7)
        var distance=align8.length-site.snp_info.distance-1;
        if(site.snp_info.ref.length==1){
            $scope.align8_pre=align8.substring(0,distance);
            $scope.align8_letter=align8[distance]
            $scope.align8_later=align8.substring(distance+1,align8.length);
            $scope.align7_pre=align7.substring(0,distance);
            console.log($scope.align7_pre)
            $scope.align7_letter='X';
            $scope.align7_later=align7.substring(distance+1,align7.length);
        }else{
            var ref_len=site.snp_info.ref.length
            distance+=1
            if(site.strand=="-"){
                $scope.align8_pre=align8.substring(0,distance-ref_len);
                $scope.align8_letter=align8.substring(distance-ref_len,distance)
                $scope.align8_later=align8.substring(distance,align8.length);
                $scope.align7_pre=align7.substring(0,distance-ref_len);
                $scope.align7_letter= ('X').repeat(ref_len);
                $scope.align7_later=align7.substring(distance,align7.length);
            }else{
                $scope.align8_pre=align8.substring(0,distance-ref_len);
                $scope.align8_letter=align8.substring(distance-ref_len,distance)
                $scope.align8_later=align8.substring(distance,align8.length);
                $scope.align7_pre=align7.substring(0,distance-ref_len);
                $scope.align7_letter= ('X').repeat(ref_len);
                $scope.align7_later=align7.substring(distance,align7.length);
            }}
            console.log(site)
        }



          $scope.echart_correlation=function(cor){
            $scope.gene_mir=cor.mir_gene.split('_')[0]+" correlates with "+cor.mir_gene.split('_')[1]+" across 33 cancer types in TCGA.";
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
               /* toolbox: {
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

   /* $scope.modal_gain_site_utr=function(site){
        $scope.modal_header="Target gain";
        $scope.target_gain=1
        $scope.target_loss=0
		$scope.modal_site=site;
        var align6=site.site_info.align6;
       // if(site.site_info.align_1){
        //    var distance=Number(site.snp_info.distance_align)+1;
        //}else{
            var distance=Number(site.snp_info.distance_align)+3;
        //}
		    $scope.align6_pre=align6.substring(0,distance);
            $scope.align6_letter=align6[distance];
            $scope.align6_later=align6.substring(distance+1,align6.length);
        }*/

    $scope.modal_gain_site_utr=function(site){
        $scope.modal_header="Target gain"
        $scope.target_gain=1
        $scope.target_loss=0
        $scope.modal_site=site
        var d_start=Number(site.site_info.align_1.split(' ')[0])
        var distance=Number(site.site_info.distance)-d_start+1
        if(site.snp_info.curalt.length==1){
            $scope.align6_pre=site.site_info.align6.substring(0,Number(site.site_info.alt_start)+3)
            $scope.align6_letter=site.site_info.align6.substring(Number(site.site_info.alt_start)+3,Number(site.site_info.alt_end)+3)
            $scope.align6_later=site.site_info.align6.substring(Number(site.site_info.alt_end)+3,site.site_info.align6.length)
            console.log($scope.modal_site.site_info.alt_display)
        }else{
            var curalt_len=site.snp_info.curalt.length
            if(site.utr_info.strand=='-'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+1-curalt_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3-curalt_len+1,Number(distance)+3+1)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }else{
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3+1)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3+1,Number(distance)+1+curalt_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1+curalt_len,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }
        }
        
    }

    $scope.modal_loss_site_utr=function(site){
        $scope.modal_header="Target loss";
        if(site.site_info.loc_start){site.site_info.alt_start=site.site_info.loc_start}
        if(site.site_info.loc_end){site.site_info.alt_start=site.site_info.loc_end}
        $scope.target_loss=1
        $scope.target_gain=0
        $scope.modal_site=site;
        var d_start=Number(site.site_info.align_1.split(' ')[0])
        if(site.site_info.distance==0){
            site.site_info.distance=site.site_info.alt_start
        }
        if(site.snp_info.ref.length==1){
            var distance=Number(site.site_info.distance)-d_start
            $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
            $scope.align6_letter=site.site_info.align6[distance+3]
            $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1,site.site_info.align6.length)
            $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
            $scope.align7_letter='X'
            $scope.align7_later=site.site_info.align7.substring(Number(distance)+3+1,site.site_info.align7.length)
        }
        else{
            var distance=Number(site.site_info.distance)-d_start+1
            var ref_len=site.snp_info.ref.length
            if(site.utr_info.strand=='+'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3,Number(distance)+ref_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+ref_len,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
                $scope.align7_letter=('X').repeat(ref_len)
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+ref_len+3,site.site_info.align7.length)
            }else{
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)-ref_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)-ref_len+3,Number(distance)+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)-ref_len+3)
                $scope.align7_letter=('X').repeat(Number(ref_len))
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+3,site.site_info.align7.length)
            }
        }
    }
      /*  $scope.modal_loss_site_utr=function(site){
            $scope.modal_header="Target Loss";
            $scope.target_loss=1
            $scope.target_gain=0
            $scope.modal_site=site;
            var align6=site.site_info.align6;
            var align7=site.site_info.align7;
            //if(site.site_info.align_1){
            //    var distance=Number(site.snp_info.distance_align)+1;
            //}else{
                var distance=Number(site.snp_info.distance_align)+3;
            //}
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
            }*/
    


    $scope.fetch_snv_utr_loss=function(page){
        $http({
            //url:base_url+base_url+'/api/snv_utr_loss',
            url:base_url+'/api/snv_utr_loss',
            method:'Get',
            params:{snp_id:$scope.query_snp,page:page}
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_loss_list=response.data.utr_loss_list;
            $scope.snv_utr_loss_count=response.data.utr_loss_count;
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
            $scope.snv_utr_gain_list=response.data.utr_gain_list;
            $scope.snv_utr_gain_count=response.data.utr_gain_count
            var site_array=$scope.snv_utr_gain_list
                for(var i=0;i<site_array.length;i++){
                    site_array[i].has_cor=1
                    /*if(site_array[i].expr_corelation){
                        site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                    }*/
                    if(site_array[i].mirna_expression[0]){
                        if(Number(site_array[i].mirna_expression[0].exp_mean)==0){site_array[i].mirna_expression[0]=0;site_array[i].has_cor=0}
                    }else{site_array[i].has_cor=0}
                    if(site_array[i].gene_expression[0]){
                        if(Number(site_array[i].gene_expression[0].exp_mean)==0){site_array[i].gene_expression[0]=0;site_array[i].has_cor=0} 
                    }else{site_array[i].has_cor=0}
                    
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
            //url:base_url+base_url+'/api/gwas_catalog',
            url:base_url+'/api/gwas_catalog',
			method:'GET',
			params:{search_ids:snp_id}
		}).then(
			function (response) {
				console.log(response);
				$scope.catalog_list=response.data.catalog_list;
                $scope.catalog_count=response.data.catalog_count;
                if($scope.catalog_count){
                    var tag_array=$scope.catalog_list
                    var disk_allele_regex=/-([A-Z]|\?)/
                    var ci_regex=/\[(.*?)\]/
                    for(var i=0;i<tag_array.length;i++){
                        var risk_allele=disk_allele_regex.exec(tag_array[i].risk_allele)
                        var ci=ci_regex.exec(tag_array[i].ci95)
                        console.log(risk_allele)
                        console.log(ci)
                        if(risk_allele){
                            if(risk_allele[1]){tag_array[i].risk_allele=risk_allele[1].replace(/NR/g,"")}
                            
                        }
                        if(ci && ci[1]!='NR')
                        {
                            if(tag_array[i].ci95){tag_array[i].ci95=tag_array[i].ci95.replace(/NR/g,"")}
                        }else{
                            tag_array[i].ci95=''
                        }
                        if(tag_array[i].risk_allele_fre){tag_array[i].risk_allele_fre=tag_array[i].risk_allele_fre.replace(/NR/g,"")}
                        if(tag_array[i].risk_allele_fre){tag_array[i].risk_allele_fre=Number(tag_array[i].risk_allele_fre).toFixed(4)}
                        if(tag_array[i].or_beta){tag_array[i].or_beta=Number(tag_array[i].or_beta).toFixed(4)}
                        if(tag_array[i].reported_gene){tag_array[i].reported_gene=tag_array[i].reported_gene.replace(/NR/g,"")}
                        //tag_array[i].tag_chr= tag_array[i].coordinate.split(':')[0]
                        //tag_array[i].tag_position= tag_array[i].coordinate.split(':')[1]
                    }
                    console.log(tag_array)
                    console.log($scope.catalog_list)
                }
			}
		)
    };
    $scope.fetch_gwas_catalog($scope.query_snp);

    $scope.search_ld = function(){
        $http({
            //url:base_url+base_url+'/api/ldinfo',
            url:base_url+'/api/ldinfo',
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
                        //url:base_url+base_url+'/api/gwas_catalog',
                        url:base_url+'/api/gwas_catalog',
                        method:'GET',
                        params:{search_ids:$scope.query_snp}
                    }).then(
                        function (response) {
                            console.log(response);
                            var tag_array=response.data.catalog_list;
                            $scope.catalog_count=response.data.catalog_count;
                            if($scope.catalog_count){
                                var data_list=tag_array
                                var disk_allele_regex=/-([A-Z]|\?)/
                                var ci_regex=/\[(.*?)\]/
                                for(var i=0;i<data_list.length;i++){
                                    var risk_allele=disk_allele_regex.exec(data_list[i].risk_allele)
                                    var ci=ci_regex.exec(data_list[i].ci95)
                                    console.log(risk_allele)
                                    console.log(ci)
                                    if(risk_allele){
                                        if(risk_allele[1]){tag_array[i].risk_allele=risk_allele[1].replace(/NR/g,"")}     
                                    }
                                    if(ci && ci[1]!='NR')
                                    {
                                        if(tag_array[i].ci95){tag_array[i].ci95=tag_array[i].ci95.replace(/NR/g,"")}
                                    }else{
                                        tag_array[i].ci95=''
                                    }
                                    if(tag_array[i].risk_allele_fre){tag_array[i].risk_allele_fre=tag_array[i].risk_allele_fre.replace(/NR/g,"")}
                                    if(tag_array[i].risk_allele_fre){tag_array[i].risk_allele_fre=Number(tag_array[i].risk_allele_fre).toFixed(4)}
                                    if(tag_array[i].or_beta){tag_array[i].or_beta=Number(tag_array[i].or_beta).toFixed(4)}
                                    if(tag_array[i].reported_gene){tag_array[i].reported_gene=tag_array[i].reported_gene.replace(/NR/g,"")}
                                   // data_list[i].ci95=ci[0]
                                   //tag_array[i].tag_chr= tag_array[i].coordinate.split(':')[0]
                                   //tag_array[i].tag_position= tag_array[i].coordinate.split(':')[1]
                                }
                                console.log(data_list)
                            }
                            $scope.tag_array=tag_array
                            console.log($scope.tag_array)
                    console.log("coordinate:")
                    $scope.tag_array[0].coordinate=$scope.ld_list[0]._id.snp_chr+':'+$scope.ld_list[0]._id.snp_position;
                    console.log($scope.tag_array[0].coordinate)
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
                        if(ld_array_line['start']=='Inf'){ld_array_line['start']=''}
                        ld_array_line['end'] = ld_region_all[p].ld_end;
                        if (ld_array_line['end']>max_end){ld_array_line['end']=max_end}
                        if(ld_array_line['end']=='-Inf'){ld_array_line['end']=''}
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
                    console.log("ld_array:")
                    console.log(ld_array)
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
                    var ld_array_dict={};
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
                            console.log(p)
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
                            //ld_array_line['rela_tag']=$scope.ld_list[i]._id.rela_tag;
                            //ld_array_line['d_prime'] = ld_region_all[p].d_prime;
                            //ld_array_line['r2'] = ld_region_all[p].r2;
                            //ld_array_line['start'] = ld_svg[ld_region_all[p].population]['start'];
                            //ld_array_line['end'] = ld_svg[ld_region_all[p].population]['end'];
                            ld_array_dict[ld_region_all[p].population]={}
                            ld_array_dict[ld_region_all[p].population]['start']=ld_svg[ld_region_all[p].population]['start'];
                            ld_array_dict[ld_region_all[p].population]['end']=ld_svg[ld_region_all[p].population]['end'];
                            //ld_array.push(ld_array_line) 
                            console.log(ld_region_all[p].population)      
                        }
                    }
                    for (p in ld_array_dict){
                        var ld_array_line={}
                        ld_array_line['population']=p
                        ld_array_line['start']=ld_array_dict[p]['start']
                        ld_array_line['end']=ld_array_dict[p]['end']
                        ld_array.push(ld_array_line)
                    }
                    $scope.ld_array = ld_array
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
                            if(risk_allele[1]){tag_array[i].risk_allele=risk_allele[1].replace(/NR/g,"")}
                            
                        }
                        if(ci && ci[1]!='NR')
                        {
                            if(tag_array[i].ci95){tag_array[i].ci95=tag_array[i].ci95.replace(/NR/g,"")}
                        }else{
                            tag_array[i].ci95=''
                        }
                        if(tag_array[i].risk_allele_fre){tag_array[i].risk_allele_fre=tag_array[i].risk_allele_fre.replace(/NR/g,"")}
                        if(tag_array[i].risk_allele_fre){tag_array[i].risk_allele_fre=Number(tag_array[i].risk_allele_fre).toFixed(4)}
                        if(tag_array[i].or_beta){tag_array[i].or_beta=Number(tag_array[i].or_beta).toFixed(4)}
                        if(tag_array[i].reported_gene){tag_array[i].reported_gene=tag_array[i].reported_gene.replace(/NR/g,"")}
                        tag_array[i].tag_chr= tag_array[i].coordinate.split(':')[0]
                        tag_array[i].tag_position= tag_array[i].coordinate.split(':')[1]
                       
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
            } )
    }
    $scope.search_ld();

    
}
