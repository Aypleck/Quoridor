/*The script handles the display of the modal windows*/

//Close the instructions when the user clicks on the "Ok" button
document.querySelector("#close-instructions").addEventListener('click', () => {
    document.querySelector("#instructions").style.display = "none";
    document.querySelector(".mask").style.display = "none";
})

//Show the win message 
const showWinMessage = (name,color) => {
    document.querySelector("#win-message").style.display = "block";
    document.querySelector(".mask").style.display = "block";
    document.querySelector("#winner-name").innerHTML = name;
    document.querySelector("#winner-name").style.color = color;
}

//Close the win message when the user clicks on the "Ok" button on the win message
document.querySelector("#close-win-message").addEventListener('click', () => {
    document.querySelector("#win-message").style.display = "none";
    document.querySelector(".mask").style.display = "none";
    //Unpause the game
    game.is_paused = false;

})
