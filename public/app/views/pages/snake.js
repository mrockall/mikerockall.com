define([
  'namespace',
  'jquery',
  'underscore',
  'backbone',
  'svg',

  'models/snake',
  'models/grid',
  'models/input_handler',
  'models/candy',

  'views/pages/_page',
  'views/modals/snake_start_game',
  'views/modals/snake_end_game',

  'text!templates/snake.html'

], function(namespace, $, _, Backbone, SVG, Snake, Grid, InputHandler, Candy, Page, StartModal, EndModal, template){

  var app = namespace.app;

 /**
  * Snake View
  * ==========================
  * This view renders the snake on screen. It also handles
  * the interaction between the Snake, the Grid and the user.
  *
  * There are three game states, play, paused and over.
  * ==========================
  * @module  Snake
  * @return {Backbone.View}
  */
  return Page.extend({

    page_name: 'snake',
    page_title: "Snake",
    page_template: template,

    states: {
      STATE_PLAYING: 1,
      STATE_PAUSED: 2,
      STATE_GAME_OVER: 3
    },

    score: 0, // Your current score

    frame_interval: 50,

    /**
     * Setup some things for the game
     * @return {this}
     */
    _pageInit: function(options){
      this.modals = {};
      
      this.Grid = new Grid();
      this.InputHandler = new InputHandler();

      this.InputHandler.on('game:start', this.playGame, this);
      this.InputHandler.on('game:pause', this.pauseGame, this);
      this.InputHandler.on('game:restart', this.restartGame, this);
      this.InputHandler.on('game:paused', this.pauseGame, this);
      this.InputHandler.on('game:resumed', this.resumeGame, this);

      this.currentState = this.states.STATE_GAME_OVER;

      return this;
    },

    /**
     * Render the DOM element and set up the SVG canvas.
     * @return {this}
     */
    _renderPageContent: function() {

      this.$canvas = this.$el.find('.canvas');
      this.ctx = SVG(this.$canvas[0]);

      // Resize the canvas to fill browser window dynamically
      window.addEventListener('resize', _.bind(this.resizeCanvas, this), false);
      this.resizeCanvas();

      this.trigger('loaded');

      this.showStartModel();
      return this;
    },

    animate_in: function() {
      this.$el.removeClass('out');
      this.$el.fadeIn("slow");
      this.showStartModel();
    },

    animate_out: function(callback) {
      this.$el.addClass('out');
      this.hideAllModals();
      this.InputHandler.stopListening();
      this.$el.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", _.bind(function(){
        this.$el.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
        this.$el.hide();
        callback();
      }, this));
    },

    /**
     * Resize the canvas to fill the browser window
     * Called on a window resize event
     */
    resizeCanvas: function() {
      this.Grid.buildGrid(this.$canvas, this.ctx)
    },

    /**
     * Shows the start game model window
     */
    showStartModel: function() {
      this.hideAllModals();

      if(_.isUndefined(this.modals['start_model'])){
        var start_modal = new StartModal({
          $container: this.$el.find(".modal_holder"),
          input_handler: this.InputHandler
        });
        this.modals['start_model'] = start_modal;
      } else {
        this.modals['start_model'].show();
      }
    },

    /**
     * Shows the start game model window
     */
    showEndModel: function() {
      this.hideAllModals();

      if(_.isUndefined(this.modals['end_model'])){
        var end_model = new EndModal({
          $container: this.$el.find(".modal_holder"),
          input_handler: this.InputHandler,
          score: this.score
        });
        this.modals['end_model'] = end_model;
      } else {
        this.modals['end_model'].score = this.score
        this.modals['end_model'].show();
      }
    },

    /**
     * Hide all the modals
     */
    hideAllModals: function() {
      _(this.modals).each(_.bind(function(modal, index){
        modal.hide();
      }, this));
    },

    initGame: function() {
      // Reset the score
      this.score = 0;

      // Create a brand new snake
      if(this.Snake){ this.Snake.destroy(); }
      this.Snake = new Snake(this.Grid);
      this.Snake.points.Grid = this.Grid;

      // Draw the beginning scene
      this.Candy = this.randomCandy();
      this.Snake.addRandomPoint();
      this.drawFrame();
      this.InputHandler.set('lastDirection', 2);
    },

    /**
     * Start the game
     */
    playGame: function(){
      if(this.currentState === this.states.STATE_GAME_OVER){
        this.initGame();
        this.hideAllModals();
        this.currentState = this.states.STATE_PLAYING;
        this.frameIntervalId = setInterval(_.bind(this.nextFrame, this), this.frame_interval);
        this.InputHandler.startListening(); // Begin listening for events
      }
    },

    /**
     * Resume the game if it has been paused
     */
    resumeGame: function(){
      if (this.currentState === this.states.STATE_PAUSED) {
        this.frameIntervalId = setInterval(_.bind(this.nextFrame, this), this.frame_interval);
        this.currentState = this.states.STATE_PLAYING;
      }
    },

    /**
     * Pause the game if it is currently playing
     */
    pauseGame: function(){
      if (this.currentState === this.states.STATE_PLAYING) {
        clearInterval(this.frameIntervalId);
        this.currentState = this.states.STATE_PAUSED;
      }
    },

    /**
     * Ends the game.
     */
    gameOver: function() {
      this.currentState = this.states.STATE_GAME_OVER;
      clearInterval(this.frameIntervalId);
      this.showEndModel();
      this.InputHandler.stopListening();
    },

    /**
     * Restart the game
     */
    restartGame: function(){
      this.initGame();
      this.currentState = this.states.STATE_PLAYING;
      this.frameIntervalId = setInterval(_.bind(this.nextFrame, this), this.frame_interval);
      this.InputHandler.startListening(); // Begin listening for events
    },

    /**
     * Tick function. Called every 150ms or so.
     */
    nextFrame: function() {
      // If the snake can't be moved in the desired direction due to collision
      if (!this.moveSnake(this.InputHandler.lastDirection())) {

        if (this.Snake.get('collisionFramesLeft') > 0) {
          // Survives for a little longer
          this.Snake.set('collisionFramesLeft', this.Snake.get('collisionFramesLeft') - 1);
          return;
        }
        else {
          // Now it's dead
          this.Snake.alive = false;
          // And play game over scene
          this.gameOver();
          return;
        }

      } else {
        // It can move.
        this.Snake.set('collisionFramesLeft', 1);
      }

      if (!this.Candy.age()) {
        this.Candy = this.randomCandy();
      }

      // If the snake hits a candy
      if(this.Candy.get('Point').collidesWith(this.Snake.points.first())) {
        this.eatCandy();
        this.Candy = this.randomCandy();
      }

      this.drawFrame();
    },

    /**
     * Draw the objects within the game
     */
    drawFrame: function() {
      // Clear the view to make room for a new frame
      this.clear();

      // Draw the objects to the screen
      this.drawScore();
      this.drawSnake();
      this.drawCandy();
    },

    /**
     * Clear the screen
     */
    clear: function() {
      this.ctx.clear();
    },

    /**
     * Draw the snake
     */
    drawSnake: function() {

      // If there is only one point
      if (this.Snake.points.length === 1) {
        var point = this.Snake.points.first();

        this.ctx.rect(this.Grid.get('point_width'), this.Grid.get('point_height'))
                .attr({ fill: this.Snake.color })
                .x(point.get('offsetLeft'))
                .y(point.get('offsetTop'));

      } else {
        // Draw the snake
        this.Snake.points.each(_.bind(function(point, index){
          this.ctx.rect(this.Grid.get('point_width'), this.Grid.get('point_height'))
                .attr({ fill: this.Snake.color })
                .x(point.get('offsetLeft'))
                .y(point.get('offsetTop'));
        }, this));
      }
    },

    /**
     * Draw the Candy on screen
     */
    drawCandy: function() {

      // Regular Candy
      if(this.Candy.get('type') == 1 && this.Candy.blink()){
        this.ctx.circle(this.Grid.get('point_width')/2)
                .attr({ fill: this.Candy.get('color') })
                .x(this.Candy.get('Point').get('offsetLeft') + this.Grid.get('point_width')/4)
                .y(this.Candy.get('Point').get('offsetTop') + this.Grid.get('point_width')/4);

      // Massive Candy
      } else if (this.Candy.get('type') == 2 && this.Candy.blink()){
        this.ctx.circle(this.Grid.get('point_width'))
                .attr({ fill: this.Candy.get('color') })
                .x(this.Candy.get('Point').get('offsetLeft'))
                .y(this.Candy.get('Point').get('offsetTop'));

      // Shrinking Candy
      } else if (this.Candy.blink()){
        this.ctx.rect(this.Grid.get('point_width')/2, this.Grid.get('point_height')/2)
                .attr({ fill: this.Candy.get('color') })
                .x(this.Candy.get('Point').get('offsetLeft') + this.Grid.get('point_width')/4)
                .y(this.Candy.get('Point').get('offsetTop') + this.Grid.get('point_width')/4);
      }
    },

    /**
     * Draws the score
     */
    drawScore: function() {
      this.ctx.text('' + this.score)
              .font({
                family: 'Roboto',
                size: '80px',
                fill: '#404040',
                anchor: 'middle'
              })
              .x("50%", "middle")
              .y("25%", "middle");
    },

    /**
     * Move the snake. 
     * Handle self collision and wall collisions
     * @param  {Int} desiredDirection
     */
    moveSnake: function(desiredDirection){
      var head = this.Snake.points.first();

      // Make sure we're heading in a valid direction
      var newDirection = this.Snake.actualDirection(desiredDirection);

      // Move the head in the desired direction
      var newHead = this.Snake.movePoint(head, newDirection);

      // Check if the point is still inside the grid
      if (!this.Grid.insideGrid(newHead)){
        // Outside of the grid
        return false;
      }

      // Check to see if it will collide with itself
      if (this.Snake.collidesWith(newHead, true)) {
        // Can't move. Collides with itself
        return false;
      }

      this.Snake.direction = newDirection;
      this.Snake.points.unshift({
        left: newHead.get('left'),
        top: newHead.get('top')
      });

      if (this.Snake.growthLeft >= 1){
        this.Snake.growthLeft--;
      } else{
        this.Snake.points.pop();
      }
      
      return true;
    },

    /**
     * Eat the candy on the screen
     */
    eatCandy: function() {
      this.score += this.Candy.get('score');
      this.Snake.growthLeft += this.Candy.get('calories');
    },

    /**
     * Return a random candy
     * @return {Candy}
     */
    randomCandy: function() {
      // Find a new position for the candy, and make sure it's not inside the snake
      do {
        var newCandyPoint = this.Snake.points.randomPoint(this.Grid);
      } while (this.Snake.collidesWith(newCandyPoint));

      return new Candy({Point: newCandyPoint});
    }

  });
});