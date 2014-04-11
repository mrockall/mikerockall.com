define([
  'namespace',
  'jquery',
  'underscore',
  'backbone',
  'imager',

  'views/pages/_page',

  'text!templates/home.html'

], function(namespace, $, _, Backbone, Imager, Page, template){

  var app = namespace.app;

  return Page.extend({

    page_name: 'home',
    page_template: template,

    _renderPageContent: function() {
      this.$paths = $('.title path');
      this.$paths.hide();

      new Imager({ availableWidths: [480, 767, 980] });
    },

    animate_in: function() {
      this.$el.removeClass('out');
      setTimeout(_.bind(this.animate_header_text, this), 500);
    },

    animate_out: function(callback) {
      this.$el.addClass('out');
      this.$el.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", _.bind(function(){
        this.$el.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
        callback();
      }, this));
    },

    animate_header_text: function() {
      var wub, wlb, fub, flb, w, r, ef;
      wub = 1000;
      wlb = 400;
      fub = 220;
      flb = 40;

      this.$el.find('.job').addClass('fadeInUp')
                           .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(ev){
                              $(this).css('opacity', 1);
                           });

      w = window.innerWidth;
      if(w > wub) w = wub
      if(w < wlb) w = wlb

      r = (w-wlb)/(wub-wlb);

      af = flb + Math.floor(r*(fub-flb));

      this.$paths.show().each(_.bind(function(index, path){

        var current_frame = 0,
            total_frames = Math.random() * ((af+30) - af) + af,
            length = path.getTotalLength(),
            handle = 0;

        // Clear any previous transition
        path.style.transition = path.style.WebkitTransition = 'none';

        // Set up the starting positions
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = length;
        path.style.fill = 'rgba(255,255,255,0)';
        
        // Create a function to draw each individual frame using requestAnimationFrame
        // Makes for a smoother animation with no frame drops.
        // Props to: // http://product.voxmedia.com/post/68085482982/polygon-feature-design-svg-animations-for-fun-and
        var draw = _.bind(function(){
          var progress = current_frame/total_frames;
          if (progress >= 1) {
            window.cancelAnimationFrame(handle);
          } else {
            current_frame++;
            path.style.strokeDashoffset = Math.floor(length * (1 - progress));
            path.style.fill = 'rgba(255,255,255,'+progress+')';
            handle = window.requestAnimationFrame(draw);
          }
        }, {
          current_frame: current_frame,
          total_frames: total_frames,
          handle: handle,
          path: path,
          length: length
        });

        draw();
      }, this));
    }

  });

});