"use strict";

angular.module('miRNASNP3', ['ui.bootstrap', 'ngRoute', 'pageslide-directive', 'ui.bootstrap-slider', 'bw.paging','tableSort','ngTagsInput'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/static/miRNASNP3/pages/home.html",
                controller: "HomeController"
            })
            .when("/document", {
                templateUrl: "/static/miRNASNP3/pages/document.html",
                controller: "DocumentController"
            })
            .when("/contact", {
                templateUrl: "/static/miRNASNP3/pages/contact.html",
                controller: "ContactController"
            })
           // .when("/search",{
            //    templateUrl:"/static/miRNASNP3/pages/search.html",
            //    controller:"SearchController"
            //})
            .when("/snp",{
                templateUrl:"/static/miRNASNP3/pages/snp.html",
                controller:"SnpController"
            })
            .when("/mirna",{
                templateUrl:"/static/miRNASNP3/pages/mir.html",
                controller:"SearchController"
            })
            .when("/gene",{
                templateUrl:"/static/miRNASNP3/pages/gene.html",
                controller:"GeneController"
            })
            .when("/mutation",{
                templateUrl:"/static/miRNASNP3/pages/mutation.html",
                controller:"MutationController"
            })
            .when("/snp_relate_mutation",{
                templateUrl:"/static/miRNASNP3/pages/snp_relate_mutation.html",
                controller:"SNPMutationController"
            })
            .when("/download", {
                templateUrl: "/static/miRNASNP3/pages/download.html",
                controller: "DownloadController"
            })
            .when("/contact", {
                templateUrl: "/static/miRNASNP3/pages/contact.html",
                controller: "ContactController"
            })
            .when("/document",{
                templateUrl:"/static/miRNASNP3/pages/document.html",
                controller:"DocumentController"
            })
            .when("/tools", {
                templateUrl: "/static/miRNASNP3/pages/tools.html",
                controller: "ToolsController"
            })
            .when("/predict_result_utr",{
                templateUrl:"/static/miRNASNP3/pages/predict_result.html",
                controller:"Predict_UTR_ResultController"
            })
            .when("/predict_result_mir",{
                templateUrl:"/static/miRNASNP3/pages/predict_mir_result.html",
                controller:"Predict_MIR_ResultController"
            })
            .when("/predict_structure",{
                templateUrl:"/static/miRNASNP3/pages/predict_structure.html",
                controller:"PredictStructureController"
            })
            .when("/mutation",{
                templateUrl:"/static/miRNASNP3/pages/mutation.html",
                controller:"MutationController"
            })
            .when("/snp",{
                templateUrl:"/static/miRNASNP3/pages/snp.html",
                controller:"SnpController"
            })
            .when("/mirna",{
                templateUrl:"/static/miRNASNP3/pages/mirna.html",
                controller:"MirnaController"
            })
            .when("/mirna_summary",{
                templateUrl:"/static/miRNASNP3/pages/mirna_summary.html",
                controller:"MirSummaryController"
            })
            .when("/key",{
                templateUrl:'/static/miRNASNP3/pages/mirna_key.html',
                controller:'KeyController'
            })
            .when("/primir_summary",{
                templateUrl:"/static/miRNASNP3/pages/primir_summary.html",
                controller:'PrimirSummaryController'
            })
            .when("/premir_detail",{
                templateUrl:"/static/miRNASNP3/pages/premir_detail.html",
                controller:'PremirDetailController'
            })
           /* .when("/cosmic_summary",{
                templateUrl:"/static/miRNASNP3/pages/cosmic_summary.html",
                controller:"CosmicSummaryController"
            })
            .when("/clinvar_summary",{
                templateUrl:"/static/miRNASNP3/pages/clinvar_summary.html",
                controller:"ClinvarSummaryController"
            })*/
            .when("/mutation_summary",{
                templateUrl:"/static/miRNASNP3/pages/mutation_summary.html",
                controller:"MutationSummaryController"
            })
            .when("/snp_summary",{
                templateUrl:"/static/miRNASNP3/pages/snp_summary.html",
                controller:"SnpSummaryController"
            })
            .when("/browser",{
                templateUrl:"/static/miRNASNP3/pages/browser.html",
                controller:"BrowserController"
            })
            .when("/browserY",{
                templateUrl:"/static/miRNASNP3/pages/browserY.html",
                controller:"BrowserController"
            })
            .when("/test",{
                templateUrl:"/static/miRNASNP3/lib/fornac/dist/test.html",
            })
            .otherwise({
                redirectTo: "/404.html"
            });
    })
    .config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');
    })
    .config( [
        '$compileProvider',
        function( $compileProvider )
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|sms):/);
            // Angular v1.2 之前使用 $compileProvider.urlSanitizationWhitelist(...)
        }
    ])
.service('miRNASNP3Service',function(){
    this.getAPIBaseUrl=function () {
        return "/miRNASNP"
    }
});
