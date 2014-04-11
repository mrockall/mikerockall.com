define([
  'namespace',
  'jquery',
  'underscore',
  'backbone'
], function(game, $, _, Backbone){

  return Backbone.Model.extend({

    defaults: {
      grid_width: 30,
      grid_height: 30,
      point_height: 20,
      point_width: 20
    },

    /**
     * Dynamically build the grid based on the window size.
     * @param  {jQuery Obj} $canvas The canvas DOM element
     * @param  {SVG Object} ctx     The SVG document
     */
    buildGrid: function($canvas, ctx) {
      this.$canvas = $canvas;
      this.ctx = ctx;

      this.$canvas.hide();

      var grid_width = Math.floor((window.innerWidth - 20)/this.get('point_width')),
          grid_height = Math.floor((window.innerHeight - 20)/this.get('point_height'));

      this.set('grid_width', grid_width);
      this.set('grid_height', grid_height);

      var canvas_width = grid_width*this.get('point_width'),
          canvas_height = grid_height*this.get('point_height');

      this.ctx.size(canvas_width, canvas_height);

      var margin_top = Math.floor((window.innerHeight - canvas_height)/2),
          margin_left = Math.floor((window.innerWidth - canvas_width)/2);

      this.$canvas.css({marginTop: margin_top + "px", marginLeft: margin_left + "px"})
                  .fadeIn();
    },

    /**
     * Checks if a point is inside the grid.
     * @param  {Point} point The point
     * @return {Boolean} Whether the point is inside the grid
     */
    insideGrid: function(point){
      if (point.get('left') < 0 || point.get('top') < 0 ||
          point.get('left') >= this.get('grid_width') || 
          point.get('top') >= this.get('grid_height')){
        return false;
      }
      else {
        return true;
      }
    }

  });

});