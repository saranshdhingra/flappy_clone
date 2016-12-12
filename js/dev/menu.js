var menuState={
	create:function(){
		game.add.text(80,80,"Flappy Bird Game",{font:"50px Arial",fill:"#000"});
		game.add.text(80,game.world.height-80,"Press space/tap to start the game",{font:"30px Arial",fill:'#000'});

		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(this.start,this);
	    game.input.onTap.addOnce(this.start,this);

	},
	start:function(){
		game.state.start('playState');
	}
}