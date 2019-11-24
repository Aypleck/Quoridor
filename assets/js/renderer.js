/*
This class is responsible for rendering a certain game state to a canvas (drawing the walls, the players, the board, the win animation, etc.)
*/
class Renderer {
    constructor(game,canvas) {
        this.game = game;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')

        //Board settings
        this.height = this.canvas.height;
        this.width = this.canvas.width;
		this.case_width = this.width/this.game.size
		this.case_height = this.height/this.game.size

        //graphical settings
        //Colors
        this.background = "#ffa54f";
		this.no_wall = "#9A5200";
		this.wall = "#000"
        this.wall_preview = "rgba(0,0,0,0.5)"
        
        //sizes
        this.wall_width = this.height / this.game.size / 10;
        this.player_margin = 2;
    }

    //The function executed when a player win
    winAnimation(player_name,player_color) {
        showWinMessage("Player " + player_name, this.colorToHTML(player_color,1))
    }
    
    //The main render function
	render(){
        this.clear();
        this.drawGrid();
        this.drawWalls();
        this.drawPlayers();
        this.drawControls();
	}
    
    //Clear the canvas with the background color
    clear() {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    //Draw the ghost players if the current control mode is move
    drawControls() {
		if(this.game.control_mode == "move") {
            for(var i = 0; i < this.game.possible_moves.length; i++){
				var player = this.game.players[this.game.current_player_id];
				var color = this.colorToHTML(player.color,0.7);
				this.drawPawn(player.x + this.game.possible_moves[i].x, player.y + this.game.possible_moves[i].y, color, false);
			}
		}
    }

    //Draw the players as circles according to their rgb color
    drawPlayers() {
        for(var i = 0; i < this.game.players.length; i++){
            var border = (i == this.game.current_player_id);
            var player = this.game.players[i];
			var color = this.colorToHTML(player.color,1);
            this.drawPawn(this.game.players[i].x, this.game.players[i].y, color, border, player.walls + " ▎");
		}
    }


    //Draw the walls and intersections according to the game state
    drawWalls() {
		//horizontal walls
		for(var y = 0; y < this.game.size-1; y++){
			for(var x = 0; x < this.game.size; x++){
                //Draw the wall only if there is a real wall, or if the wall is a ghost wall and the current control mode is wall placement
                if(this.game.horizontal_walls[y][x] == 1 || (this.game.horizontal_walls[y][x] == -1 && this.game.control_mode == "wall")){
                    //Change the wall color according to if it is a ghost wall or a real one
					if(this.game.horizontal_walls[y][x] == 1) {
                        this.ctx.strokeStyle = this.wall;
                    }
					if(this.game.horizontal_walls[y][x] == -1) {
                        this.ctx.strokeStyle = this.wall_preview;
                    }
                    //Draw the wall
					this.ctx.beginPath();
					this.ctx.moveTo(this.case_width * (x + 1 ) - this.wall_width / 2, this.case_height * (y + 1 ));
					this.ctx.lineTo(this.case_width * x + this.wall_width / 2, this.case_height * (y + 1 ));
					this.ctx.lineWidth = this.wall_width;
					this.ctx.stroke();
				}
			}
		}
		//Same thing for vertical walls
		for(var y = 0; y < this.game.size; y++){
            for(var x = 0; x < this.game.size-1; x++){
                if(this.game.vertical_walls[y][x] == 1  || (this.game.vertical_walls[y][x] == -1 && this.game.control_mode == "wall")){
                    if(this.game.vertical_walls[y][x] == 1)  {
                        this.ctx.strokeStyle = this.wall;
                    }
					if(this.game.vertical_walls[y][x] == -1) {
                        this.ctx.strokeStyle = this.wall_preview;
                    }
					this.ctx.beginPath()
					this.ctx.moveTo(this.case_width * ( x + 1 ), this.case_height * y + this.wall_width / 2);
					this.ctx.lineTo(this.case_width * ( x + 1 ), this.case_height * ( y + 1 ) - this.wall_width / 2);
					this.ctx.lineWidth = this.wall_width;
					this.ctx.stroke();
				}
			}
		}
		//Same thing for intersections
		for(var y = 0; y < this.game.size-1; y++){
			for(var x = 0; x < this.game.size-1; x++){
                if(this.game.intersections[y][x] == 1 || (this.game.intersections[y][x] == -1 && this.game.control_mode == "wall")){
					if(this.game.intersections[y][x] == 1) {
                        this.ctx.strokeStyle = this.wall;
                    }
					else if(this.game.intersections[y][x] == -1) {
                        this.ctx.strokeStyle = this.wall_preview;
                    }
					this.ctx.beginPath();
					this.ctx.moveTo(this.case_width * ( x + 1 ), this.case_height * (y + 1) + this.wall_width / 2);
					this.ctx.lineTo(this.case_width * ( x + 1 ), this.case_height * (y + 1) - this.wall_width / 2);
					this.ctx.lineWidth = this.wall_width + 1;
					this.ctx.stroke();
				}
			}
		}
    }

    drawGrid() {
        //Grid
        //Horizontal
        for(var y = 0; y < this.game.size-1; y++){
            for(var x = 0; x < this.game.size; x++){
                this.ctx.beginPath()
                this.ctx.moveTo(this.case_width * (x + 1 ), this.case_height * (y + 1 ))
                this.ctx.lineTo(this.case_width * x, this.case_height * (y + 1 ))
                this.ctx.strokeStyle = this.no_wall;
                this.ctx.lineWidth = this.wall_width;
                this.ctx.stroke();
            }
        }	
        //vertical
        for(var y = 0; y < this.game.size; y++){
            for(var x = 0; x < this.game.size-1; x++){
                this.ctx.beginPath()
                this.ctx.moveTo(this.case_width * ( x + 1 ), this.case_height * y)
                this.ctx.lineTo(this.case_width * ( x + 1 ), this.case_height * ( y + 1 ))
                this.ctx.strokeStyle = this.no_wall;
                this.ctx.lineWidth = this.wall_width;
                this.ctx.stroke();
            }
        }
    }

    drawPawn(x, y, color, border, text){
		//Style
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = "white";
		this.ctx.lineWidth = this.player_margin;
		//Shape
        this.ctx.beginPath()
        //circle parameters
        var x_pos = this.case_width / 2 + this.case_width * x;
        var y_pos = this.case_height / 2 + this.case_width * y;
        if(this.case_width < this.case_height) {
            var radius = this.case_width / 2 - 5 - this.player_margin
        }else {
            var radius = this.case_height / 2 - 5 - this.player_margin
        }
        //Draw circle
		this.ctx.arc(x_pos, y_pos, radius, 0, 2*Math.PI)
		this.ctx.fill()
		if (border) {
            this.ctx.stroke();
        }
        //Text
        if(text !== undefined){
            var font_size = Math.round(this.case_height / 3)
            var text_size = this.ctx.measureText(text)
            this.ctx.fillStyle = "white";
            this.ctx.font =  font_size+ "px Arial";
            this.ctx.fillText(text,x_pos - text_size.width/2, y_pos + font_size/2)
        }
    }

    colorToHTML(color,alpha){
        return "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
    }
    
}