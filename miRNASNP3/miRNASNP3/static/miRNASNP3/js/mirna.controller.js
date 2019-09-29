'use strict';

angular.module('miRNASNP3')
    .controller('MirnaController', MirnaController);

function MirnaController($scope,$routeParams,$http,$filter,$document,miRNASNP3Service) {
    console.log("MirnaController loaded");

    function up(x,y){return x[1]-y[1]}
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
    $scope.enrich_clear=function(){
        $scope.enrich_dot=0;
        $scope.enrich_cnet=0;
        $scope.enrich_emap=0;
        $scope.enrich_table=0;
    }
    $scope.show_enrich=function(refer){
        $scope.enrich_clear();
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
    }
    $scope.fetch_mirna_details = function () {
        $http({
           url:base_url+'/api/mirinfo',
           // url:base_url+'/api/mirinfo',
            method: 'GET',
            params: {search_ids: $scope.query_mirna}
        }).then(
            function (response) {
                console.log(response);
                $scope.mirna_summary_list = response.data.mirna_summary_list;
                $scope.mirna_summary_count=response.data.mirna_summary_count;
                if($scope.mirna_summary_list.length>1){
                    $scope.mirna_table=1
                }else{
                    $scope.mirna_table=0
                }
                $scope.mirna_summary_alias=$scope.mirna_summary_list[0]
            });
    };
    $scope.fetch_mirna_details();

    $scope.fetch_mirna_expression=function(){
        $scope.mirna_expression_show=1;
        $http({
           url:base_url+'/api/mirna_expression',
           // url:base_url+'/api/mirna_expression',
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
            /*console.log($scope.mirna_expression.exp_mean)
            var temp;
            var value;
            var array=[];
            var r,g,b;
            temp=$scope.mirna_expression.exp_df;
            console.log($scope.mirna_expression_show)
            for (var key in temp) {
                value=Number(temp[key])
                if(value!=0){
                if(min_value){
                    if(value<min_value){
                        min_value=value
                    }
                }else{
                    var min_value= value
                }
                if(max_value){
                    if (value>max_value){
                        max_value=value
                    }
                }else{
                    var max_value=value
                }
                }}
            console.log(min_value)
            console.log(max_value)
            var w= max_value-min_value
            console.log(w)
            for (var key in temp) {
                if(w==0){
                    r=255
                    g=255
                    b=0
                    }else{
                    value=Number(temp[key])
                    if(value<w/2){
                        r = Math.floor((510/w)*(value-min_value));
                        g = 255
                    }else{
                        r = 255;
                        g = Math.floor((510/w)*(max_value-value))
                    }
                    b = 0;
                }
                    var p = "rgb("+r+","+g+","+b+")";
                    if (Number(temp[key])!=0){
                        array.push({"cancer_type":key,"expression":temp[key],"color":p})
                    }
                }
            
                console.log(array);
                $scope.mirna_profile = array;*/
                if($scope.mirna_expression_show==1){

                    echarts.init(document.getElementById('mirna_expression')).dispose();
                    var myChart = echarts.init(document.getElementById('mirna_expression'));
                    var series_list=[]
                    
            //console.log($scope.gene_expression);
                var mirna_expr = $scope.mirna_expression.exp_df;
               // $scope.exp_item=title;
                
                var cancer_types=['cancer_type'];
                var expr=['RPKM'];
               
                for(var cancer in mirna_expr){
                    var source_data={}
                    var labelOption={}
                    if(mirna_expr[cancer]&&Number(mirna_expr[cancer])!=0){
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
                        source_data['data']=[mirna_expr[cancer]]
                        series_list.push(source_data)
                        cancer_types.push(cancer)
                        expr.push(mirna_expr[cancer])
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
                    })
                }
        })
    };
    $scope.fetch_mirna_expression();




    $scope.fetch_target_gain = function (page) {
        console.log("fetch target gain!")
        console.log(page)
        //console.log($scope.query_mirna);
        var flag=0;
                var query_gene_gain = $.trim($('#search_gene_gain').val());
                console.log(query_gene_gain)
                if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
                    alert("Invalid input");
                    flag = 1;
                    history.back();
                }
                if(flag==0){
            $http({
               url:base_url+'/api/snp_seed_gain',
               // url:base_url+'/api/snp_seed_gain',
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
                }
        }
    $scope.fetch_target_gain(page);

    
        //console.log(query_item);
        $(document).ready(function(){
            var flag=0;
            console.log($scope.currentPage_gain)
            $('#search_gene_gain').on('input propertychange', function() {
                $scope.currentPage_gain=1;
                var query_gene_gain = $.trim($('#search_gene_gain').val());
                console.log(query_gene_gain)
                if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
                    alert("Invalid input");
                    flag = 1;
                    history.back();
                }
                if(flag==0){
                    console.log(query_gene_gain)
                    $http({
                       url:base_url+'/api/snp_seed_gain',
                       // url:base_url+'/api/snp_seed_gain',
                        method: 'GET',
                        params: {mirna_id: $scope.query_mirna,page:1,gene:query_gene_gain}
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

    

        $scope.modal_gene_expression=function(exp){ 
            echarts.init(document.getElementById('gene_expression')).dispose();
            var myChart = echarts.init(document.getElementById('gene_expression'));
            var series_list=[]
            $scope.gene_expression=exp[0];
        //console.log($scope.gene_expression);
            var gene_expr = $scope.gene_expression.exp_df;
           // $scope.exp_item=title;
            
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
            $scope.align8_letter=RULE1[site.snp_info.curalt];
        }else{
            $scope.align8_letter=site.snp_info.curalt;
        }
       
        $scope.align8_later=align8.substring(distance+1,align8.length);
        $scope.align7_pre=align7.substring(0,distance);
        console.log($scope.align7_pre)
        $scope.align7_letter='X';
        $scope.align7_later=align7.substring(distance+1,align7.length);
        }

   $scope.fetch_target_loss = function (page) {
    var flag=0
    var query_gene_loss = $.trim($('#search_gene_loss').val());
    console.log(query_gene_loss)
    if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
        alert("Invalid input");
        flag = 1;
        history.back();
    }
    if(flag==0){
            $http({
               url:base_url+'/api/snp_seed_loss',
               // url:base_url+'/api/snp_seed_loss',
                method: 'GET',
                params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_loss}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                    $scope.snp_seed_loss_count = response.data.snp_seed_loss_count;
                    var site_array=$scope.snp_seed_loss_list
                    for(var i=0;i<site_array.length;i++){
                        site_array[i].has_cor=1
                        if(site_array[i].expr_corelation){
                            console.log(site_array[i].expr_corelation)
                            if(site_array[i].expr_corelation=='Not significant'){site_array[i].expr_corelation="0.00"}
                            else{site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)}
                        }
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
        }
       
    $scope.fetch_target_loss(page);

    $(document).ready(function(){
        var flag=0;
        $('#search_gene_loss').on('input propertychange', function() {
            $scope.currentPage_loss=1
            var query_gene_loss = $.trim($('#search_gene_loss').val());
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                $http({
                   url:base_url+'/api/snp_seed_loss',
                   // url:base_url+'/api/snp_seed_loss',
                    method: 'GET',
                    params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_loss}
                }).then(
                    function (response) {
                        console.log(response);
                        $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                        $scope.snp_seed_loss_count = response.data.snp_seed_loss_count+1;
                        var site_array=$scope.snp_seed_loss_list
                        for(var i=0;i<site_array.length;i++){
                            site_array[i].has_cor=1
                            if(site_array[i].expr_corelation){
                                if(site_array[i].expr_corelation=='Not significant'){site_array[i].expr_corelation="0.00"}
                                else{site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)}
                                }
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
        });
      });

   /* $scope.modal_corelation_detail=function(cor){
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
    }*/


    $scope.modal_gain_site_mut=function(site){
        $scope.modal_header="Target Gain";
        $scope.target_gain=1;
        $scope.target_loss=0;
		$scope.modal_site=site;
		var align8=site.site_info.align8;
		var distance=align8.length-site.mut_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        $scope.align8_letter=align8[distance];
        $scope.align8_later=align8.substring(distance+1,align8.length);
        }
    $scope.modal_loss_site_mut=function(site){
        $scope.modal_header="Target Loss";
        $scope.target_gain=0;
        $scope.target_loss=1
		$scope.modal_site=site;
        var align8=site.site_info.align8;
        var align7=site.site_info.align7;
        var distance=align8.length-site.mut_info.distance-1;
        $scope.align8_pre=align8.substring(0,distance);
        if(site.strand=='-'){
            $scope.align8_letter=RULE1[site.mut_info.curalt];
        }else{
            $scope.align8_letter=site.mut_info.curalt;
        }
        $scope.align8_later=align8.substring(distance+1,align8.length);
        $scope.align7_pre=align7.substring(0,distance);
        console.log($scope.align7_pre)
        $scope.align7_letter='X';
        $scope.align7_later=align7.substring(distance+1,align7.length);
        }

    $scope.fetch_target_gain_mut = function (page) {
        var flag=0
        console.log($scope.query_mirna);
        var query_gene_gain = $.trim($('#search_gene_gain_mut').val());
            console.log(query_gene_gain)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
    	$http({
           url:base_url+'/api/mut_seed_gain',
           // url:base_url+'/api/mut_seed_gain',
			method: 'GET',
			params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_gain}
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
                    if((/^COSN[0-9]+*/).test(site_array[i].mut_id)){site_array[i].mut_url="https://cancer.sanger.ac.uk/cosmic/search?q="+site_array[i].mut_id}
                }
                })
            }
            };
    $scope.fetch_target_gain_mut(page);

    $(document).ready(function(){
        var flag=0;
        $('#search_gene_gain_mut').on('input propertychange', function() {
            $scope.currentPage_mutgain=1
            var query_gene_gain = $.trim($('#search_gene_gain_mut').val());
            console.log(query_gene_gain)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                console.log(query_gene_gain)
                $http({
                   url:base_url+'/api/snp_seed_gain',
                   // url:base_url+'/api/mut_seed_gain',
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
                                if((/^COSN[0-9]+*/).test(site_array[i].mut_id)){site_array[i].mut_url="https://cancer.sanger.ac.uk/cosmic/search?q="+site_array[i].mut_id}
                        }
                        })
            }
        });
      });

    $scope.fetch_target_loss_mut = function (page) {
        var flag=0
        var query_gene_loss = $.trim($('#search_gene_loss_mut').val());
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
    	$http({
           url:base_url+'/api/mut_seed_loss',
           // url:base_url+'/api/mut_seed_loss',
			method: 'GET',
			params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_loss}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.mut_seed_loss_list = response.data.mut_seed_loss_list;
                    $scope.mut_seed_loss_count=response.data.mut_seed_loss_count;
                    var site_array=$scope.mut_seed_loss_list
                for(var i=0;i<site_array.length;i++){
                        site_array[i].has_cor=1
                        if(site_array[i].expr_corelation){
                            if(site_array[i].expr_corelation=='Not significant'){site_array[i].expr_corelation="0.00"}
                            else{site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)}
                        }
                        if(site_array[i].gene_expression[0]){
                            if(Number(site_array[i].gene_expression[0].exp_mean)==0){site_array[i].gene_expression[0]=0;site_array[i].has_cor=0} 
                        }else{site_array[i].has_cor=0}
                    site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                    site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                    site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                    site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                    site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                    site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                    if((/^COSN[0-9]+*/).test(site_array[i].mut_id)){site_array[i].mut_url="https://cancer.sanger.ac.uk/cosmic/search?q="+site_array[i].mut_id}
                }
                })
            }
            };
    $scope.fetch_target_loss_mut(page);

    $(document).ready(function(){
        var flag=0;
        $('#search_gene_loss_mut').on('input propertychange', function() {
            $scope.currentPage_mutloss=1
            var query_gene_loss = $.trim($('#search_gene_loss_mut').val());
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if(flag==0){
                console.log(query_gene_loss)
                $http({
                   url:base_url+'/api/snp_seed_gain',
                   // url:base_url+'/api/mut_seed_loss',
                    method: 'GET',
                    params: {mirna_id: $scope.query_mirna,page:page,gene:query_gene_loss}
                    }).then(
                        function (response) {
                            console.log(response);
                            $scope.mut_seed_loss_list = response.data.mut_seed_loss_list;
                            $scope.mut_seed_loss_count=response.data.mut_seed_loss_count+1;
                            var site_array=$scope.snp_seed_gain_list
                            for(var i=0;i<site_array.length;i++){
                                site_array[i].has_cor=1
                                if(site_array[i].expr_corelation){
                                    if(site_array[i].expr_corelation=='Not significant'){site_array[i].expr_corelation="0.00"}
                                    else{site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)}
                                }
                                if(site_array[i].gene_expression[0]){
                                    if(Number(site_array[i].gene_expression[0].exp_mean)==0){site_array[i].gene_expression[0]=0;site_array[i].has_cor=0} 
                                }else{site_array[i].has_cor=0}
                                site_array[i].site_info.dg_binding=Number(site_array[i].site_info.dg_binding).toFixed(2)
                                site_array[i].site_info.dg_duplex=Number(site_array[i].site_info.dg_duplex).toFixed(2)
                                site_array[i].site_info.dg_open=Number(site_array[i].site_info.dg_open).toFixed(2)
                                site_array[i].site_info.prob_exac=Number(site_array[i].site_info.prob_exac).toFixed(2)
                                site_array[i].site_info.tgs_score=Number(site_array[i].site_info.tgs_score).toFixed(2)
                                site_array[i].site_info.tgs_au=Number(site_array[i].site_info.tgs_au).toFixed(2)
                                if((/^COSN[0-9]+*/).test(site_array[i].mut_id)){site_array[i].mut_url="https://cancer.sanger.ac.uk/cosmic/search?q="+site_array[i].mut_id}
                        }
                        })
            }
        });
      });
    
    $scope.fetch_enrich_result=function(){
        $http({
           url:base_url+'/api/enrich_result',
           // url:base_url+'/api/enrich_result',
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
                    if((/^rs/).test(data_list[j].variate_id)){
                        data_list[j].variate_url="https://www.ncbi.nlm.nih.gov/snp/?term="+data_list[j].variate_id
                    }else{
                        data_list[j].variate_url="https://cancer.sanger.ac.uk/cosmic/search?q="+data_list[j].variate_id
                    }
                }
            }
        })
    };
    $scope.fetch_enrich_result();
    $scope.enrich_init=function(){
        $scope.show_dot=0;
        $scope.show_cnet=0;
        $scope.show_emap=0;
        $scope.show_table=0;
    }
    $scope.enrich_init()

    $scope.enrichment_view=function(e){
        console.log('enrichment result')
        $scope.enrich_item=e
        $scope.csv_table=e.csv_table
        console.log($scope.csv_table)
        $scope.enrich_clear()
        $scope.show_dot=0;
        $scope.show_cnet=0;
        $scope.show_emap=0;
        $scope.show_table=1;
        $scope.enrich_table=1;
        if(e.dot_file){$scope.show_dot=1}
       
        $('#enrich_table').addClass('active')
        $("#enrich_dot").removeClass('active')
       // if(e.chet_file){$scope.show_cnet=1}
       // if(e.emap_file){$scope.show_emap=1}
        //console.log($scope.enrich_filename)
    }


}

