define([
    'jquery',
    'underscore',
    'backbone',
    'backbone_router_callbacks',
    'scroll_to',

    'views/pages/home',
    'views/pages/snake'
], function ($, _, Backbone, RouterCallbacks, ScrollTo, HomeView, SnakeView) {

  var $container = $('#container'),
      $loading = $('.loading');

  var router = Backbone.Router.extend({

    routes: {
      "snake": 'snake',
      "*default": 'home'
    },

    views: {},
    current_page: "",

    home: function(){
      if(!this._viewExists('home')){
        this.views['home'] = new HomeView({
          $surface_container: $container
        }).render().show();
      } else {
        this.views['home'].show();
      }

      this.current_page = 'home';
    },

    snake: function(){
      if(!this._viewExists('snake')){
        this.views['snake'] = new SnakeView({
          $surface_container: $container
        }).render().show();
      } else {
        this.views['snake'].show();
      }

      this.current_page = 'snake';
    },

    before: function() {
      if(this.views[this.current_page]){
        this.views[this.current_page].hide(_.bind(function(){
          this.trigger('route:before');
        }, this));
      } else {
        this.trigger('route:before');
      }
    },

    after: function(){
      $loading.fadeOut();
    },

    _viewExists: function(view){
      return !_.isUndefined(this.views[view]);
    }

  });
  
  return {
    router: router
  }
});