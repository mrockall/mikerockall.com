define([
  'namespace',
  'jquery',
  'underscore',
  'backbone',

  'models/point'
], function(app, $, _, Backbone, Point){

  return Backbone.Collection.extend({
    model: Point,

    addRandomPoint: function() {
      this.add({
        left: this.randomInteger(0, this.Grid.get('grid_width')-1),
        top: this.randomInteger(0, this.Grid.get('grid_height')-1)
      });
    },

    randomPoint: function(){
      var point = new this.model({
        left: this.randomInteger(0, this.Grid.get('grid_width') - 1),
        top: this.randomInteger(0, this.Grid.get('grid_height') - 1)
      });
      point.updateOffset(this.Grid);
      return point;
    },

    randomInteger: function(min, max){
      var randomNumber = min + Math.floor(Math.random() * (max + 1));
      return randomNumber;
    }
  });
});