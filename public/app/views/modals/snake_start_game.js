define([
  'namespace',
  'jquery',
  'underscore',
  'backbone',

  'text!templates/modals/snake_start.html'
], function(namespace, $, _, Backbone, template){

  var app = namespace.app;

  return Backbone.View.extend({

    className: 'modal md-effect-3',
    modal_name: '',
    raw_template: template,

    initialize: function(options) {
      this.$container = options.$container;
      this.template = _.template(this.raw_template);
      this.input_handler = options.input_handler;

      return this.render();
    },

    events: {
      'click .return_home': 'return_home',
      'click .play': 'start_game'
    },

    render: function() {
      this.$el.append(this.template()).addClass(this.modal_name);
      this.$container.append(this.$el);

      this.$page_content = this.$el.find(".content");

      this.show();      

      return this;
    },

    show: function() {
      if(!this.$el.hasClass('md-show')){
        this.delegateEvents();
        window.addEventListener("keydown", _.bind(this.isEnter, this), true);

        // Add a little delay to give the animation time.
        setTimeout(_.bind(function(){
          this.$el.addClass('md-show');
        }, this), 200);
      }
    },

    hide: function() {
      if(this.$el.hasClass('md-show')){
        window.removeEventListener("keydown", _.bind(this.isEnter, this), true);
        this.undelegateEvents();

        this.$el.removeClass('md-show');
      }
    },

    isEnter: function(ev) {
      if(ev.keyCode == 13){
        this.start_game(ev);
      }
    },

    start_game: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      this.hide();
      this.input_handler.trigger('game:start');
    },

    return_home: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      this.hide();
      app.router.navigate('/', {trigger: true});
    }

  });
});