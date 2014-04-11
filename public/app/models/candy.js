define([
  'namespace',
  'jquery',
  'underscore',
  'backbone'
], function(game, $, _, Backbone){

  return Backbone.Model.extend({

    defaults: {
      score: 5,     // Increment in score when eaten by snake
      calories: 1,    // How much growth the snake gains if it eats this candy
      radius: 1,    // Radius of the candy, relative to config.pointSize
      color: '#000',     // Color of the candy
      decrement: 1,   // If greater than 0, the radius of the candy will shrink...
      minRadius: 1   // until it reaches this minimum value. Then it will disappear
    },

    types: {
      REGULAR: 1,
      MASSIVE: 2,
      SHRINKING: 3
    },

    initialize: function(opts) {
      var type = this.types.SHRINKING;

      // Determine the type
      var probabilitySeed = Math.random();
      if (probabilitySeed < 0.50){
        type = this.types.REGULAR;
      } else if (probabilitySeed < 0.75){
        type = this.types.MASSIVE;
      }

      this.set('type', type);

      // Setup the Candy depending on the type
      switch (type) {
      case this.types.REGULAR:
        this.set('score', 5);
        this.set('age', 200);
        this.set('calories', 3);
        this.set('radius', 0.3);
        this.set('color', '#888');
        break;
      case this.types.MASSIVE:
        this.set('score', 15);
        this.set('age', 100);
        this.set('calories', 5);
        this.set('radius', 0.45);
        this.set('color', '#888');
        break;
      case this.types.SHRINKING:
        this.set('score', 50);
        this.set('age', 75);
        this.set('calories', 1);
        this.set('radius', 0.45);
        this.set('color', '#888');
        break;
      }

      return this;
    },

    age: function(){
      this.set('age', this.get('age') - 1);
      if (this.get('age') < 1){
        return false;
      } else{
        return true;
      }
    },

    blink: function() {
      return !(this.get('age') < 40 && this.get('age')%4 == 0);
    }

  });

});