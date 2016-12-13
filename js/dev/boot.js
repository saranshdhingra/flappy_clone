var bootState={
	create:function(){
		//initial stage settings
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		game.stage.backgroundColor = '#71c5cf';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('loadState');
		// game.add.plugin(Phaser.Plugin.Debug);
	}
}