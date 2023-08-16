for (let i = 0; i < document.querySelectorAll('.drum').length; i++) {
    document.querySelectorAll(".drum")[i].addEventListener('click', function () {
        let buttonInnerHTML = this.innerHTML;
        makeSound(buttonInnerHTML);
        buttonAnimation(buttonInnerHTML);
    });
// callback functions are functions that are passed as arguments to other functions.
// They are called by the object that is the event listener is attached to.
// The callback function is called when the event is triggered.
// The callback function is called with the event object as its argument.
// The event object has a lot of properties and methods.
    document.addEventListener('keypress', function (event) {
        makeSound(event.key);
        buttonAnimation(event.key);
    });
}

  makeSound = function(key) {
      switch (key) {
          case "w":
              let tom1 = new Audio('sounds/tom-1.mp3');
              tom1.play();
              break;
          case "a":
              let tom2 = new Audio('sounds/tom-2.mp3');
              tom2.play();
              break;
          case "s":
              let tom3 = new Audio('sounds/tom-3.mp3');
              tom3.play();
              break;
          case "d":
              let tom4 = new Audio('sounds/tom-4.mp3');
              tom4.play();
              break;
          case "j":
              let snare = new Audio('sounds/snare.mp3');
              snare.play();
              break;
          case "k":
              let crash = new Audio('sounds/crash.mp3');
              crash.play();
              break;
          case "l":
              let kick = new Audio('sounds/kick-bass.mp3');
              kick.play();
              break;
          default:
              console.log(key);
              break;
      } }
      function buttonAnimation(currentKey) {
    let activeButton = document.querySelector('.' + currentKey).classList;
    activeButton.add('pressed');
    setTimeout(function () {
        activeButton.remove('pressed');
    }, 500);




}
