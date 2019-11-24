var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var canvas = document.getElementById("canvas")
canvas.height = height
canvas.width = height
var game = new Game(canvas);

game.reset()
game.renderer.render()

canvas.addEventListener('click', (event) => {
	var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  game.control_handler.click(x,y);
})

canvas.addEventListener('mousemove', (event) => {
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	game.control_handler.hover(x,y)
})