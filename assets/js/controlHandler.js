/*
This class is responsible for linking the user inputs (x and y coordinates of the pointer) 
to actions in the game (placing a wall, moving, switching control mode)
*/
class ControlHandler {
    constructor(game){
        this.game = game;
	}
	
	keyPress(code) {
		//The player 1 can control his pawn with the arrows
		if(this.game.current_player_id == 0){
			//Switch control mode (enter)
			if(code == 13) {
				this.switchControlMode();
			}
			//Move up
			if(code == 38) {
				this.game.move(0,-1);
				this.game.move(0,-2);
			}
			//Move down
			else if(code == 40) {
				this.game.move(0,1);
				this.game.move(0,2);
			}
			//Move left
			else if(code == 37) {
				this.game.move(-1,0);
				this.game.move(-2,0);
			}
			//Move right
			else if(code == 39) {
				this.game.move(1,0);
				this.game.move(2,0);
			}
		//The player 2 can control his paw with the zsqd / wasd keys
		}else {
			//Switch control mode (space)
			if(code == 32) {
				this.switchControlMode();
			}
			//Move down
			if(code == 83) {
				this.game.move(0,1);
				this.game.move(0,2);
			}
			//Move up (z or w)
			else if(code == 90 || code == 87) {
				this.game.move(0,-1);
				this.game.move(0,-2);
			}
			//Move left
			else if(code == 65 || code == 81) {
				this.game.move(-1,0);
				this.game.move(-2,0);
			}
			//Move right
			else if(code == 68) {
				this.game.move(1,0);
				this.game.move(2,0);
			}
		}
	}

    click(mouse_x,mouse_y) {
		var coordinates = this.getPlateCoordinates(mouse_x,mouse_y);
		var x = coordinates.x;
		var y = coordinates.y;
		var player = game.players[game.current_player_id];

		//if click on current player switch control mode
		if(player.x == x && player.y == y) {
			this.switchControlMode();
			return;
		}

		//Wall mode
		if(this.game.control_mode == "wall") {
			var wall = this.getWallCoordinates(mouse_x,mouse_y);
			this.game.place(wall.orientation,wall.x,wall.y,1);
		}

		//Move mode
		if(this.game.control_mode == "move") {
			var dx = x - player.x;
			var dy = y - player.y;
			this.game.move(dx,dy);
		}
	}

	hover(mouse_x,mouse_y) {
		if(this.game.control_mode == "wall"){
			var pos = this.getWallCoordinates(mouse_x,mouse_y)
			this.game.place(pos.orientation,pos.x,pos.y,-1)
		}
	}

	getPlateCoordinates(x,y) {
		var case_height = this.game.renderer.canvas.height / this.game.size
		var case_width = this.game.renderer.canvas.width / this.game.size
		
		var board_x = Math.floor(x/case_height)
		var board_y = Math.floor(y/case_width)

		return {
			x: board_x,
			y: board_y
		}
	}

	getWallCoordinates(x,y) {
		var case_height = this.game.renderer.case_height;
		var case_width = this.game.renderer.case_width;
		
		var vertical = Math.abs(Math.round(x/case_height)-x/case_height)
		var horizontal   = Math.abs(Math.round(y/case_width)-y/case_width)
		if(vertical < horizontal) {
			var wall_x = Math.floor(x/case_width - 0.5)
			var wall_y = Math.floor(y/case_height)
			var orientation = 'v';
		}else{
			var wall_x = Math.floor(x/case_width)
			var wall_y = Math.floor(y/case_height - 0.5)
			var orientation = 'h';
		}
		
		return {
			x: wall_x,
			y: wall_y,
			orientation: orientation
		};
	}

	switchControlMode() {
		if(this.game.control_mode == "wall") {
			this.game.control_mode = "move";
		}
		else if(this.game.control_mode == "move") {
			this.game.control_mode = "wall";
		}
		this.game.renderer.render()
	}
}