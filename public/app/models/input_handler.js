define([
  'namespace',
  'jquery',
  'underscore',
  'backbone',
  'hammer'
], function(game, $, _, Backbone, Hammer){

  return Backbone.Model.extend({

    defaults: {
      listening: false,
      lastDirection: 2
    },

    directions: {
      UP: 1,
      DOWN: -1,
      RIGHT: 2,
      LEFT: -2
    },

    // Key codes for the arrow keys on a keyboard
    arrowKeys: [37, 38, 39, 40],

    initialize: function() {
      _.bindAll(this, 'handleKeyDown', 'disableKeyPress', 'pauseFn', 'resumeFn');
      return this;
    },

    // Returns the last direction pressed
    lastDirection: function(){
      return this.get('lastDirection');
    },

    // Start listening for player events
    startListening: function(){
      if (!this.get('listening')) {
        window.addEventListener("keydown", this.handleKeyDown, true);
        window.addEventListener("keypress", this.disableKeyPress, true);
        window.addEventListener("blur", this.pauseFn, true);
        window.addEventListener("focus", this.resumeFn, true);
        Hammer(window).on('swipe drag', _.bind(this.handleSwipe, this));
        this.set({listening: true});
      }
    },

    // Stop listening for events. Typically called at game end
    stopListening: function(){
      if (this.get('listening')) {
        window.removeEventListener("keydown", this.handleKeyDown, true);
        window.removeEventListener("keypress", this.disableKeyPress, true);
        window.removeEventListener("blur", this.pauseFn, true);
        window.removeEventListener("focus", this.resumeFn, true);
        Hammer(window).off('swipe drag');
        this.set('listening', false);
      }
    },

    // Handles a key press
    handleKeyDown: function(event){
      // If the key pressed is an arrow key
      if (this.arrowKeys.indexOf(event.keyCode) >= 0) {
        event.preventDefault();
        switch (event.keyCode) {
        case 37:
          this.set('lastDirection', this.directions.LEFT);
          break;
        case 38:
          this.set('lastDirection', this.directions.UP);
          break;
        case 39:
          this.set('lastDirection', this.directions.RIGHT);
          break;
        case 40:
          this.set('lastDirection', this.directions.DOWN);
          break;
        }
      }
    },

    disableKeyPress: function(event){
      // If the key pressed is an arrow key
      if (this.arrowKeys.indexOf(event.keyCode) >= 0) {
        event.preventDefault();
      }
    },

    handleSwipe: function(ev){
      ev.stopPropagation();
      ev.preventDefault();
      ev.gesture.stopPropagation();
      ev.gesture.preventDefault();
      alert('swipe or drag');

      switch (event.gesture.direction) {
      case 'left':
        this.set('lastDirection', this.directions.LEFT);
        break;
      case 'up':
        this.set('lastDirection', this.directions.UP);
        break;
      case 'right':
        this.set('lastDirection', this.directions.RIGHT);
        break;
      case 'down':
        this.set('lastDirection', this.directions.DOWN);
        break;
      }
    },

    pauseFn: function(){
      this.trigger('game:paused');
    },

    resumeFn: function(){
      this.trigger('game:resumed');
    }

  });

});