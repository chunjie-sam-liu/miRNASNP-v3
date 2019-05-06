"use strict";

angular.module('miRNASNP3', ['ui.bootstrap', 'ngRoute', 'pageslide-directive', 'ui.bootstrap-slider', 'bw.paging'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/static/miRNASNP3/pages/home.html",
                controller: "HomeController",
            })
            .when("/document", {
                templateUrl: "/static/miRNASNP3/pages/document.html",
                controller: "DocumentController",
            })
            .when("/contact", {
                templateUrl: "/static/miRNASNP3/pages/contact.html",
                controller: "ContactController",
            })
            .when("/search",{
                templateUrl:"/static/miRNASNP3/pages/search.html",
                controller:"SearchController",
            })
            .when("/download", {
                templateUrl: "/static/miRNASNP3/pages/download.html",
                controller: "DownloadController",
            })
            .when("/contact", {
                templateUrl: "/static/miRNASNP3/pages/contact.html",
                controller: "ContactController",
            })
            .when("/tools", {
                templateUrl: "/static/miRNASNP3/pages/tools.html",
                controller: "ToolsController",
            })
            .when("/mutation",{
                templateUrl:"/static/miRNASNP3/pages/mutation.html",
                controller:"MutationController",
            })
            .when("/searchdoc",{
                templateUrl:"/static/miRNASNP3/pages/search_doc.html",
                controller:"SearchdocController"
            })
            .otherwise({
                redirectTo: "/404.html",
            });
    })
    .config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');
    });
