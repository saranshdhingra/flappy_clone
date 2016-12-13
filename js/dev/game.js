var config={
	PIPE_VELOCITY:-200,
	PIPE_TIMER:1500,
	BIRD_GRAVITY:1000,
	BIRD_JUMP:-350,
	PIPE_VERTICAL_GAP:100,
	NAME:"Anonymous"
}


var game = new Phaser.Game(640,360,Phaser.AUTO);

game.state.add('bootState',bootState);
game.state.add('loadState',loadState);
game.state.add('menuState',menuState);
game.state.add('playState',playState);
game.state.start('bootState');