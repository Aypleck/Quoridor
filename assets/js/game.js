
/*
This class is responsible for the coremechanics of the game, like storing the game state, the players, checking wins, reseting, etc.
*/
class Game{
	constructor(canvas) {

		this.size = 9;

		this.is_paused = false;

		//Walls
		this.vertical_walls = []
		this.horizontal_walls = []
		this.intersections = [];

		//Players
		this.current_player_id;
		this.players = []
		this.possible_moves = [];

		this.control_mode = "move";
		
		this.renderer = new Renderer(this, canvas);
		this.control_handler = new ControlHandler(this);

		//initialize game board
		this.reset()
	} 

	/*==============
	Global game actions
	================*/


	// Reset all data (walls, player positions, etc.)
	reset() {
		//Initialize wall arrays
		//vertical walls
		this.vertical_walls = new Array(this.size);
		for(var y = 0; y < this.size; y++){
			this.vertical_walls[y] = new Array(this.size - 1)
			for(var x = 0; x < this.size - 1; x++){
				this.vertical_walls[y][x] = 0
			}
		}
		//horizontal
		this.horizontal_walls = new Array(this.size - 1);
		for(var y = 0; y < this.size - 1; y++){
			this.horizontal_walls[y] = new Array(this.size)
			for(var x = 0; x < this.size; x++){
				this.horizontal_walls[y][x] = 0
			}
		}
		//Intersections
		this.intersections = new Array(this.size - 1);
		for(var y = 0; y < this.size - 1; y++){
			this.intersections[y] = new Array(this.size)
			for(var x = 0; x < this.size; x++){
				this.intersections[y][x] = 0;
			}
		}

		//Initialize players
		this.players = []
		this.current_player_id = Math.round(Math.random())

		//Example of composition
		//4 players game is not supported yet
		this.players.push({
			x: Math.floor(this.size/2),
			y: 0,
			walls: 10,
			targetY: this.size -1,
			color: {r:192, g:57, b:43 }
		})
		this.players.push({
			x: Math.floor(this.size/2),
			y: this.size-1,
			walls: 10,
			targetY: 0,
			color: {r:41, g:128, b:185}
		})

		//Initialize possible moves for the first player
		this.updatePossibleMoves();

		//first render
		this.renderer.render();
	}


	//switch to the next player
	nextPlayer(){
		this.checkWin();
		//Switch player
		if(this.current_player_id < this.players.length - 1) {
			this.current_player_id++;
		}
		else {
			this.current_player_id = 0;
		}
		this.updatePossibleMoves();
	}


	//Check if a player won
	//Run win animation, reset game
	checkWin() {
		for( var i = 0; i < this.players.length; i++){
			if(this.players[i].targetY == this.players[i].y){
				this.renderer.render();
				this.is_paused = true;	//Pause the game until the player press "Ok"
				this.renderer.winAnimation(this.current_player_id + 1, this.players[this.current_player_id].color);
				this.reset();
			} 
		}
	}


	//Get all possible moves for the current player
	//store them in "this.possible_moves"
	updatePossibleMoves() {
		this.possible_moves = []								//Array containing objects representing all posible moves
		var player = this.players[this.current_player_id];		//Current player (as an object)
		var directions = [-1,1];								//All directions a player can go (forward and backward)
		
		
		//Straight moves (along the X and Y axis)

		//X moves
		directions.forEach(x => {
			//If player in this spot, take the spot behind as a possible move.
			this.players.forEach(opponent => {
				if(opponent.x == player.x + x && opponent.y == player.y){
					x+=x;
				}
			})
			//If the player can go there, add this as a possible move
			if(this.canMove(player.x,player.y,x,0).possible) {
				this.possible_moves.push({x:x,y:0});
			}
		})

		//Y moves
		directions.forEach(y => {
			//If player in this spot, take the spot behind as a possible move.
			this.players.forEach(opponent => {
				if(opponent.y == player.y + y && opponent.x == player.x){
					y+=y;
				}
			})
			//If the player can go there, add this as a possible move
			if(this.canMove(player.x,player.y,0,y).possible) {
				this.possible_moves.push({x:0,y:y});
			}
		})

		/*Diagonal moves
		In Quoridor you can move diagonally if you are in front of another player, and behind this player is a wall.
		Then you can jump to his left or right if there are no wall.
		Examples : 
		O   : current player
		X   : other player
		| _ : wall
		o   : possible move
		
		_ _ _  _ _ _   
		o X o   |X o   
		  O      O    
		*/

		this.players.forEach(oponent => {
			//X Axis
			directions.forEach(x => {
				//If an other player is obstucting this path and there are no walls between the current player and the opponent
				if(player.x + x == oponent.x && player.y == oponent.y && this.canMove(player.x,player.y,x,0).possible){
					//If there is a wall preventing the current player from jumping over this opponent
					//According to the rules https://www.jeuxavolonte.asso.fr/regles/quoridor.pdf, only another player and a wall are valid for diagonal moves
					//As 4 player games are not implemented, only walls are valid objects for moving diagonally
					//Note : If you don't like this rule switch the following if statement by the commented one
					let move_possible = this.canMove(player.x,player.y,2*x,0)
					// if(!move_possible.possible){
					if(!move_possible.possible && move_possible.reason == "wall"){
						/*If player can make the diagonal move
						Example : in this situation,
						_ _ _
						  X 
						  O  
						We are testing if this move is possible
						_    _    _
						     X -> o
						     O
						  */
						directions.forEach(y => {
							if(this.canMove(player.x+x,player.y,0,y).possible == true){
								this.possible_moves.push({x:x,y:y});
							}
						})
					}
				}
			})
			//Y Direction
			//Same idea as above, excpet for the Y axis
			directions.forEach(y => {
				//If opponent ahead
				if(player.y + y == oponent.y && player.x == oponent.x  && this.canMove(player.x,player.y,0,y).possible){
					//If wall after opponent
					let move_possible = this.canMove(player.x,player.y,0,2*y)
					if(!move_possible.possible && move_possible.reason == "wall"){
						//If player can make diagonal move
						directions.forEach(x => {
							if(this.canMove(player.x,player.y+y,x,0)){
								this.possible_moves.push({x:x,y:y});
							}
						})
					}
				}
			})
		})
	}
	
	/*==============
	User actions
	================*/

	//Make the durrent player move dx squares in the X axis AND dy squares in the Y axis
	//ONLY if this move is valid
	move(dx,dy){
		if(game.is_paused){
			return false;
		}
		var player = this.players[this.current_player_id];
		//if this move is in the list of possible moves
		if(this.possible_moves.findIndex((move) => move.x == dx && move.y == dy) != -1){
			player.y += dy;
			player.x += dx;
			this.nextPlayer();
			this.renderer.render();					
		}
	}
	
	/*Place a wall at arbitrary coordinates with arbitrary orientation
	Note 1:
	This function actually places 2 "walls" and 1 intersection, as in Quoridor, physical walls take 2 squares + 1 intersection

	Note 2 : 
	Walls can have 3 values
	-1 = preivew wall (gray wall that aprears when the user hovers with his mouse, not a "real" wall)
	0  = no wall
	1  = wall
	*/
	place(orientation,x,y,value){
		if(game.is_paused){
			return false;
		}
		//If we are placing a new preview wall, we need to remove the last preview wall
		if(value == -1) {
			this.clearPreviews();
		}
		//Check if we can place a wall here
		if(this.canPlace(orientation,x,y,value)){
			//Place the 2 walls
			this.setWall(orientation,x,y,value)
			//Place the intersection
			this.setIntersection(x,y,value)
			//If the wall placed is not a preview, switch players and remove a wall from the current player
			if(value == 1){
				this.players[this.current_player_id].walls -= 1
				this.nextPlayer();
			}
			this.renderer.render();
		}
	}

	/*==============
	Data modification
	================*/

	//Place 2 walls, without any verification
	setWall(orientation,x,y,value){
		if(orientation == 'v'){
			this.vertical_walls[y][x] = value;
			this.vertical_walls[y+1][x] = value;
		}else if(orientation == "h"){
			this.horizontal_walls[y][x] = value;
			this.horizontal_walls[y][x+1] = value;
		}
	}

	//Set an intersection
	setIntersection(x,y,value){
		this.intersections[y][x] = value;
	}

	//Clear all preview (including vertical and horizontal walls, and intersections)
	clearPreviews() {
		for(var i=0; i < this.vertical_walls.length; i ++){
			for(var j=0; j < this.vertical_walls[i].length; j ++){
				if(this.vertical_walls[i][j] == -1) this.vertical_walls[i][j] = 0;
			}
		}
		for(var i=0; i < this.horizontal_walls.length; i ++){
			for(var j=0; j < this.horizontal_walls[i].length; j ++){
				if(this.horizontal_walls[i][j] == -1) this.horizontal_walls[i][j] = 0;
			}
		}
		for(var i=0; i < this.intersections.length; i ++){
			for(var j=0; j < this.intersections[i].length; j ++){
				if(this.intersections[i][j] == -1) this.intersections[i][j] = 0;
			}
		}
	}

	/*==============
	Game checks
	================*/

	//Check if a player could move from the square (x,y) and move dx squares along the X axis AND dy along the Y axis
	canMove(x,y,dx,dy){
		//Different possible responses
		const edge_error = {
			possible: false,
			reason: "edge"
		}
		const wall_error = {
			possible: false,
			reason: "wall"
		}
		const possible = {
			possible: true
		}

		//Check if this action will hit the edge of the board

		if(x + dx >= this.size || x + dx < 0 || y + dy >= this.size || y + dy < 0){
			return edge_error;
		}

		//Check if this action will hit a wall
		if(dx > 0){
			for(var dist = 0; dist < dx; dist++){
				if(this.vertical_walls[y][x+dist] == 1){
					return wall_error;
				}
			}
		}
		else if(dx < 0){
			for(var dist = dx; dist < 0; dist++){
				if(this.vertical_walls[y][x+dist] == 1){
					return wall_error;
				}
			}
		}
		if(dy > 0){
			for(var dist = 0; dist <= dy-1; dist++){
				if(this.horizontal_walls[y+dist][x] == 1){
					return wall_error;
				}
			}
		}
		else if(dy < 0){
			for(var dist = dy; dist < 0; dist++){
				if(this.horizontal_walls[dist+y][x] == 1){
					return wall_error;
				}
			}
		}
		return possible;
	}


	//Could a player place a wall at a location
	canPlace(orientation,x,y,value){
		//If the current player doesn't have any walls left
		if(this.players[this.current_player_id].walls == 0){
			return false
		}
		//Detect if the wall goes out of the map
			if		(orientation == "h" && (y < 0 || y > this.size - 2 || x > this.size-2 || x < 0)) {
				return false;
			}
			else if	(orientation == "v" && (y < 0 || y > this.size - 2 )) {
				return false;
			}

		//Check if the wall will intersect with another wall or another intersection
		if(orientation == 'v' && (this.vertical_walls[y+1][x] == 1 || this.vertical_walls[y][x] == 1 || this.intersections[y][x] == 1)){
			return false;
		}
		else if(orientation == "h" && (this.horizontal_walls[y][x+1] == 1 || this.horizontal_walls[y][x] == 1 || this.intersections[y][x] == 1)){
			return false;
		}

		//Check if all players could win if this wall was placed
		//Backup all the walls
		if(value == 1) {
			var old_vertical_walls = new Array(this.size);
			var old_horizontal_walls = new Array(this.size - 1);

			for(var i = 0; i < this.size; i++){
				old_vertical_walls[i] = this.vertical_walls[i].slice(0);
			}
			for(var i = 0; i < this.size - 1; i++){
				old_horizontal_walls[i] = this.horizontal_walls[i].slice(0);
			}

			//Temporarly place the wall
			this.setWall(orientation,x,y,1);

			//Check if all player can win
			
			var result = true;
			for(var i = 0; i < this.players.length; i++){
				if(!this.canWin(this.players[i])){
					result = false;
				}
			}

			//Restore the walls
			for(var i = 0; i < this.size; i++){
				this.vertical_walls[i] = old_vertical_walls[i].slice(0);
			}
			for(var i = 0; i < this.size - 1; i++){
				this.horizontal_walls[i] = old_horizontal_walls[i].slice(0);
			}
			return result;
		}else {
			return true;
		}

	}


	//Check if the player (as an object) can win
	canWin(player){
		//Create an array containing ann the squares of the board
		var visited = new Array(this.size);
		for(var i = 0; i < this.size; i++){
			visited[i] = new Array(this.size);
			for(var j = 0; j < this.size; j++){
				visited[i][j] = false;
			}

		}
		//Array containing all the cases that needs to be processed
		var queue = [];

		//initialization, we visit the case where the player currently is
		queue.push([player.x,player.y]);
		visited[player.y][player.x] = true;
		var n,px,py;

		//For each squares in the queue, put in the queue all the squares where you can go from here that haven't been visited
		//This algorithm will check evry possible paths, and when he finds a way to win, he returns that the player can win
		//If after trying all the possibilities, he can't win, return false
		while(queue.length > 0){
			//Remove first element
			n = queue.pop(0);
			px = n[0];
			py = n[1];

			//We found a way to win
			if(py == player.targetY){
				return true;
			}

			//Get all the adjacent squares where the player can move
			if(this.canMove(px,py,1,0).possible){
				if(!visited[py][px+1]){
					queue.push([px+1,py]);
					visited[py][px+1] = true;
				}
			}
			if(this.canMove(px,py,-1,0).possible){
				if(!visited[py][px-1] ){
					queue.push([px-1,py]);
					visited[py][px-1] = true;
				}
			}
			if(this.canMove(px,py,0,1).possible){
				if(!visited[py+1][px]){
					queue.push([px,py+1]);
					visited[py+1][px] = true;
				}
			}
			if(this.canMove(px,py,0,-1).possible){
				if(!visited[py-1][px]){
					queue.push([px,py-1]);
					visited[py-1][px] = true;
				}
			}
		}
		return false;
	}
}