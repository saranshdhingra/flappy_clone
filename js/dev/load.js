var loadState={
	preload:function(){
		var name = prompt("Please enter your name", "Anonymous"),
			loadingLabel=game.add.text(80,150,'Loading...',{font:'30px Courier',fill:'#fff'});

		config.NAME=name;

		this.load.image('bird','assets/images/bird.png');
		this.load.image('close','assets/images/close.png');
		this.load.image('pipe_up','assets/images/pipe_up.png');
		this.load.image('pipe_down','assets/images/pipe_down.png');
		this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');
		game.load.json('highscore', 'high.json');
	},
	create:function(){
		game.state.start('menuState');
	}
}