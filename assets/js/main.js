var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var canvas = document.getElementById("canvas")
canvas.height = height > width ? width : height
canvas.width = height > width ? width : height
var game = new Game(canvas);

game.reset()
game.renderer.render()

//When the user resizes the window
window.addEventListener("resize", () => {
	//Recompute the available space 
	var width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

	var height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

	canvas.height = height > width ? width : height
	canvas.width = height > width ? width : height

	//Render the game to update the changes
	game.renderer.render()
})

//Send the events to the Controls handler
//Cooldown system preventing the clic kand touchend event from interfeering with each others
let cooldown = false;
const startCooldown = () => {
	cooldown = true;
	setTimeout(() => {cooldown = false}, 400);
}
//Mouse events
canvas.addEventListener('mousemove', (event) => {
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	game.control_handler.hover(x,y)
}, false)

canvas.addEventListener('click', (event) => {
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	if(!cooldown) {
		game.control_handler.click(x,y);
		startCooldown();
	}
}, false)

//Touch events
canvas.addEventListener('touchmove', (event) => {
	var x = event.changedTouches[0].pageX - canvas.offsetLeft;
	var y = event.changedTouches[0].pageY - canvas.offsetTop;
	game.control_handler.hover(x,y)
}, false)

canvas.addEventListener('touchend', (event) => {
	var x = event.changedTouches[0].pageX - canvas.offsetLeft;
	var y = event.changedTouches[0].pageY - canvas.offsetTop;
	if(!cooldown) {
		game.control_handler.click(x,y);
		startCooldown();
	}
}, false)



//Key pressed by the user
window.addEventListener("keydown", (key) => {
	game.control_handler.keyPress(key.keyCode);
})