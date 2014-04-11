define([
  'namespace',
  'jquery',
  'underscore',
  'backbone'
  
], function(namespace, $, _, Backbone){

  var app = namespace.app;

  return Backbone.View.extend({

    className: 'surface',
    page_name: "",
    page_title: "",
    page_template: null,

    initialize: function(params) {
      this.$surface_container = params.$surface_container;
      this.template = _.template(this.page_template);

      this._pageInit(params);
      return this;
    },

    _pageInit: function(){},

    render: function() {
      this.$el.append(this.template()).addClass(this.page_name.toLowerCase());
      this.$surface_container.append(this.$el);

      this.$page_content = this.$el.find(".content");

      this._renderPageContent();
      this._setPageTitle();
      return this;
    },

    _renderPageContent: function() {},

    show: function() {
      this._setPageTitle();
      this.animate_in();
      return this;
    },

    hide: function(callback) {
      this.animate_out(callback);
      return this;
    },

    animate_in: function() {},
    animate_out: function() {},

    _setPageTitle: function() {
      if(this.page_title)
        document.title = this.page_title + " | Mike Rockall [dot] com";
      else
        document.title = "Mike Rockall [dot] com";
    }

  });

});