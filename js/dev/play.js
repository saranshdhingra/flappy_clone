var playState={
	create:function(){
		//objects in game settings
		this.bird = game.add.sprite(100, 50, 'bird');
		this.bird.checkWorldBounds = true;
		this.bird.events.onOutOfBounds.add(this.out_of_bounds,this);
		this.pipes = game.add.group();
		this.pipeSet = game.add.group();	//single set containing up and down pipes
		this.timer = game.time.events.loop(config.PIPE_TIMER, this.addPipeColumn, this);
		this.score = 0;
		this.labelScore = game.add.bitmapText(game.world.width/2, 10,"flappyfont","0");
		this.labelScore.anchor.setTo(0.5,0);
		// this.background = this.game.add.sprite(0,0,'background');


		//anchor settings
		this.bird.anchor.setTo(0.5);

		//calculations
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = config.BIRD_GRAVITY;

		//input settings
		this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);	//kind of preventdefault
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	    this.spaceKey.onDown.add(this.bird_jump, this);
	    //touch
	    game.input.onTap.add(this.bird_jump,this);
		
	},
	update:function(){

		//check for collision
		game.physics.arcade.overlap(this.bird, this.pipes, this.out_of_bounds, null, this);

		if (this.bird.angle < 20)
		    this.bird.angle += 2.5;	//keeping this increment small will make the game slow(at least on my laptop)
	},
	bird_jump:function(){
		if(this.bird.alive && !this.bird.falling){
			this.bird.body.velocity.y = config.BIRD_JUMP;
			game.add.tween(this.bird).to( { angle: -20 }, 100).start();

			//maybe put this in update?
			//compute score
			//score is computed based on the x params of the bird and pipes
			this.pipes.forEach(function(pipe){
				//only use pipe_up
				if(pipe.computed == undefined)
					return;

				//count the score if it has not already been counted and when the bird crosses the pipe
				if(pipe.computed===false && pipe.left< this.bird.left){
					this.score+=1;
					this.labelScore.text = this.score;
					pipe.computed=true;
				}
			}.bind(this));

		}


	},
	addPipeColumn: function(){
		var x=game.world.width;
		//recycling
		var old_pipe_up=this.pipes.getFirstExists(false);
		if(!old_pipe_up)
			var pipe_up = game.add.sprite(x, 0, 'pipe_up');
		else{
			var pipe_up=old_pipe_up;
			pipe_up.reset(x,0);
		}

		var old_pipe_down=this.pipes.getFirstExists(false);
		if(!old_pipe_down)
			var pipe_down = game.add.sprite(x, game.world.height, 'pipe_down');
		else{
			var pipe_down=old_pipe_down;
			pipe_down.reset(x,game.world.height);
		}

	    // Create a pipe at the position x and y
	    var min_gap = config.PIPE_VERTICAL_GAP;	//min gap between the 2 pipes for the bird to fly through

	    //change the top and bottom of the pipes
	    var total_height=pipe_up.height + min_gap + pipe_down.height,
		    //takke min(diff,pip_up.height) because in screens where diff is greater than pipe_up.h,
		    // the pipe will be much above the screen
	    	diff=Math.min(total_height - game.world.height,pipe_up.height),
	    	p1y=getRandomInt(Math.floor(diff/4),diff-min_gap/10),
	    	p2y=pipe_up.height - p1y + min_gap;

	    //can't do shit if screen height is too big
	    if(diff < 0){
	    	this.game_end();
	    	return;
	    }

	    pipe_up.top = -1*p1y;
	    pipe_down.top = p2y;

	    //score computation
	    pipe_up.computed=false;

	    // Add the pipe to our previously created group
	    this.pipes.add(pipe_up);
	    this.pipes.add(pipe_down);

	    // Enable physics on the pipe 
	    game.physics.arcade.enable(pipe_up);
	    game.physics.arcade.enable(pipe_down);

	    // Add velocity to the pipe to make it move left
	    pipe_up.body.velocity.x = config.PIPE_VELOCITY; 
	    pipe_down.body.velocity.x = config.PIPE_VELOCITY; 

	    // Automatically kill the pipe when it's no longer visible 
	    pipe_up.checkWorldBounds = true;
	    pipe_down.checkWorldBounds = true;
	    pipe_up.outOfBoundsKill = true;
	    pipe_down.outOfBoundsKill = true;
	},
	out_of_bounds:function(){
		if(this.bird.top > game.world.height){
			this.game_end();
		}

		if(!this.bird.falling){
			//make the bird fall
			this.bird.falling=true;
			//remove the timer for adding more pipes
			game.time.events.remove(this.timer);
			//stop the pipes
			this.pipes.forEach(function(pipe){
				pipe.body.velocity.x=0;
			});
		}
	},
	restart_game:function(){
		game.state.start('playState');
	},
	game_end:function(){
		this.bird.kill();
		
		//simply add an image to signify the game is fucking over
		this.close = game.add.sprite(game.world.centerX,game.world.centerY, 'close');
		this.close.anchor.setTo(0.5);

		//pressing space will restart the game
		this.spaceKey.onDown.addOnce(this.restart_game,this);
		game.input.onTap.addOnce(this.restart_game,this);

		//send the highscore to the server
		post('score.php',{name:config.NAME,score:this.score});
	}
};


//helper functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function post(path, params) {
   var http = new XMLHttpRequest(),
		data = new FormData();
   http.open("POST", path, true);

   params=Object.keys(params).map(function(k) {
       return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
   }).join('&');

   //Send the proper header information along with the request
   http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

   http.onreadystatechange = function() {//Call a function when the state changes.
       if(http.readyState == 4 && http.status == 200) {
           console.log(http.responseText);
       }
   }
   http.send(params);
}