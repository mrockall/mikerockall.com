define([
  'namespace',
  'jquery',
  'underscore',
  'backbone'
], function(game, $, _, Backbone){

  return Backbone.Model.extend({

    defaults: {
      left: 0,
      top: 0
    },

    initialize: function(opts) {
      if(opts.left) this.set('left', opts.left);
      if(opts.top) this.set('top', opts.top);

      this.on('change:left', this.updateOffset, this);
      this.on('change:top', this.updateOffset, this);

      this.updateOffset();
    },

    /**
     * Update the offsets whenever the left or right changes..
     */
    updateOffset: function(Grid) {
      if(!_.isUndefined(Grid)){
        this.set('offsetLeft', this.get('left')*Grid.get('point_width'));
        this.set('offsetTop', this.get('top')*Grid.get('point_height'));
      }
      if(!_.isUndefined(this.collection)){
        this.set('offsetLeft', this.get('left')*this.collection.Grid.get('point_width'));
        this.set('offsetTop', this.get('top')*this.collection.Grid.get('point_height'));
      }
    },

    /**
     * Does this point collide with another?
     * @param  {Point} otherPoint
     * @return {Boolean} Does it collide?
     */
    collidesWith: function(otherPoint){
      if (otherPoint.get('left') == this.get('left') && otherPoint.get('top') == this.get('top'))
        return true;
      else
        return false;
    }

  });

});