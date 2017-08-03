angular.module('app', [
    'ionic', 'services', 'info.ctrl', 'list.ctrl'
  ])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state("info", {
        url: "/info",
        views: {
          "content": {
            templateUrl: "views/info/p.html",
            controller: "infoCtrl"
          }
        }
      })
      .state("list", {
        url: "/list",
        views: {
          "content": {
            templateUrl: "views/list/p.html",
            controller: "listCtrl"
          }
        }
      });
    $urlRouterProvider.otherwise("/info");
  })
  .filter("wicon", function () {
    var icons = {
      "晴": "wi-day-sunny",
      "阴": "wi-night-cloudy",
      "多云": "wi-cloudy",
      "小雨": "wi-showers",
      "中雨": "wi-hail",
      "中到大雨": "wi-rain-wind",
      "阵雨": "wi-sleet",
      "雷阵雨": "wi-storm-showers",
      "大雨": "wi-rain"
    };
    return function (type) {
      return icons[type];
    };
  })
