define([
  'namespace',
  'jquery',
  'underscore',
  'backbone',

  'text!templates/modals/snake_end.html'
], function(namespace, $, _, Backbone, template){

  var app = namespace.app;

  return Backbone.View.extend({

    className: 'modal md-effect-3',
    modal_name: 'snake_end',
    raw_template: template,

    initialize: function(options) {
      this.$container = options.$container;
      this.template = _.template(this.raw_template);
      this.input_handler = options.input_handler;
      this.score = options.score;

      return this.render();
    },

    events: {
      'click .return_home': 'return_home',
      'click .restart': 'restart_game'
    },

    render: function() {
      this.$el.append(this.template()).addClass(this.modal_name);
      this.$container.append(this.$el);

      this.$page_content = this.$el.find(".content");

      this.show();      

      return this;
    },

    show: function() {
      this.delegateEvents();

      this.update_score();
      setTimeout(_.bind(function(){
        this.$el.addClass('md-show');
      }, this), 200);
    },

    hide: function() {
      this.undelegateEvents();

      this.$el.removeClass('md-show');
    },

    update_score: function() {
      this.$el.find('.your_score').text(this.score);
    },

    restart_game: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      this.hide();
      this.input_handler.trigger('game:restart');
    },

    return_home: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      this.hide();
      app.router.navigate('/', {trigger: true});
    }

  });
});