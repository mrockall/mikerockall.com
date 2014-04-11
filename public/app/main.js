/*global require*/
'use strict';

require.config({
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: [
          'underscore',
          'jquery'
        ],
        exports: 'Backbone'
      },
      scroll_to: {
        deps: ['jquery']
      },
      backbone_router_callbacks: {
        deps: ['backbone']
      },
      waypoints: {
        deps: ['jquery']
      }
    },
    paths: {
      jquery: '../components/jquery/dist/jquery',
      backbone: '../components/backbone/backbone',
      underscore: '../components/underscore/underscore-min',
      text: "../components/requirejs-text/text",
      svg: "../components/svg.js/dist/svg",
      hammer: "../components/hammerjs/hammer",
      scroll_to: "../components/jquery.scrollTo/jquery.scrollTo",
      imager: "../components/imager.js/dist/imager.min",
      backbone_router_callbacks: "libs/backbone-router-callbacks"
    }
});

require([
  'namespace',
  'backbone',
  'router'
], function (namespace, Backbone, Router) {

  var app = namespace.app;

  window.app = app;
  
  // Initialise the router and the header
  app.router = new Router.router();

  // Tell Backbone to route the first route!
  Backbone.history.start({ pushState: true });

  // Route all clicks through the Backbone router
  $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    var root = location.protocol + "//" + location.host + "/";

    if (href.prop.slice(0, root.length) === root) {
      evt.preventDefault();
      Backbone.history.navigate(href.attr, true);
    }
  });
});