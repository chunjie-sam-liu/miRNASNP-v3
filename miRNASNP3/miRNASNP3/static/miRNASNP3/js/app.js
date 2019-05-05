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
            .when("/test", {
                templateUrl: "/static/miRNASNP3/pages/test.html",
                controller: "TestController",
            })
            .when("/test2", {
                templateUrl: "/static/miRNASNP3/pages/test2.html",
                controller: "Test2Controller",
            })
            .when("/test3", {
                templateUrl: "/static/miRNASNP3/pages/test3.html",
                controller: "Test3Controller",
            })
            .otherwise({
                redirectTo: "/404.html",
            });
    })
    .config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');
    });
