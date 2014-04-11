define([
  'namespace',
  'jquery',
  'underscore',
  'backbone',

  'models/point',

  'collections/points'
], function(game, $, _, Backbone, Point, Points){

  // Snake directions
  var directions = {
    UP: 1,
    DOWN: -1,
    RIGHT: 2,
    LEFT: -2
  }

 /**
  * Snake Model
  * ======================
  * [description]
  * ======================
  * @module Snake
  * @return {Backbone.Model}
  */
  return Backbone.Model.extend({

    defaults: {
      collisionFramesLeft: 1
    },

    growthLeft: 0,

    color: '#276448',

    /**
     * Set some variables and initialise the collection 
     * to contain the Points.
     */
    initialize: function() {
      this.alive = true;
      this.points = new Points();
      this.direction = directions.LEFT;
    },

    /**
     * Adds a random point to the snake.
     * This is used to start the game.
     */
    addRandomPoint: function() {
      this.points.addRandomPoint();
    },

    /**
     * Check if any of this objects points collides with an external point
     * @param {Boolean} simulateMovement Simulates the removal of the end point
     * @return {Boolean} Returns true if any collision occurs, false otherwise
     */
    collidesWith: function(point, simulateMovement){

     // This addresses a bug where the snake couldn't move to a point which
     // is not currently free, but will be in the next frame
      if (simulateMovement && this.growthLeft === 0){
        range = this.points.length - 1;
      } else {
        range = this.points.length;
      }

      for (var i = 0; i < range; i++) {
        if (point.collidesWith(this.points.at(i))){
          return true;
        }
      }

      return false;
    },

    /**
     * If the player tries to move the snake in the opposite direction
     * we need to ignore that.
     * @param  {Int} desiredDirection The direction the player would like to move
     * @return {Int} The direction the player can move
     */
    actualDirection: function(desiredDirection){
      if (this.points.length === 1){
        return desiredDirection;

      } else if (this._oppositeDirections(this.direction, desiredDirection)) {

        // Continue moving in the snake's current direction ignoring the player
        return this.direction;
      }else {

        // Obey the player and move in that direction
        return desiredDirection;
      }
    },

    /**
     * Moves a point a certain direction
     * @param  {Point} oldPoint  The Point
     * @param  {Int}   direction The direction to move the point
     * @return {Point} The point after the move has taken place
     */
    movePoint: function(oldPoint, direction){
      var newPoint;
      switch (direction) {
      case directions.LEFT:
        newPoint = new Point({
          left: oldPoint.get('left')-1, 
          top: oldPoint.get('top')
        });
        break;
      case directions.UP:
        newPoint = new Point({
          left: oldPoint.get('left'), 
          top: oldPoint.get('top')-1
        });
        break;
      case directions.RIGHT:
        newPoint = new Point({
          left: oldPoint.get('left')+1, 
          top: oldPoint.get('top')
        });
        break;
      case directions.DOWN:
        newPoint = new Point({
          left: oldPoint.get('left'), 
          top: oldPoint.get('top')+1
        });
        break;
      }
      return newPoint;
    } ,

    /**
     * Returns the sign of a number
     * @param  {Int} number
     * @return {Int} + -> 1 , - -> -1, 0 -> 0
     */
    _sign: function(number){
      if(number > 0)
        return 1;
      else if (number < 0)
        return -1;
      else if (number === 0)
        return 0;
      else
        return undefined;
    },

    /**
     * Helper function to find if two directions are in opposite to each other
     * @return {Boolean} Returns true if the directions are in opposite to each other, false otherwise
     */
    _oppositeDirections: function(direction1, direction2){
      // @see Declaration of directions to understand.
      // E.g. UP is defined as 1 while down is defined as -1
      if (Math.abs(direction1) == Math.abs(direction2) && this._sign(direction1 * direction2) == -1) {
        return true;
      } else {
        return false;
      }
    }

  });

});