window.onload = function(){
    
    let currentAction = 'snap';

    var tID; //we will use this variable to clear the setInterval()

    function setAction(actionString) {
        currentAction = actionString;
        pastAction = (actionString === 'snap' ? 'time' : 'snap');

        document.querySelector(`.ig[data-action='${pastAction}']`).style.display = 'none';
        document.querySelector(`.ig[data-action='${currentAction}']`).style.display = 'block';
    }
    
    
    function animateScript(e) {
        const audio = e.target.querySelector(`audio`);

        //Reset every click
        clearInterval(tID); //reset animation
        audio.currentTime = 0; //reset sound

        //INITIALIZE
        const startPosition = 0;
        var    position = startPosition; //start position for the image slicer
        const fullImgWidth = 5760;
        const  diff = 120;     //diff as a variable for position offset
        const  interval = 50; //100 ms of interval for the setInterval() Animation

        audio.play();

        tID = setInterval ( () => {
            e.target.style.backgroundPosition = 
            `-${position}px 0px`; 
            //we use the ES6 template literal to insert the variable "position"
            if (position < fullImgWidth) {
                position = position + diff;
            }
            //we increment the position by 256 each time
            else
            { 
                position = startPosition;
                clearInterval(tID);
                setAction( (currentAction === 'snap' ? 'time' : 'snap') );
            }
            //reset the position to startPosition, once position exceeds fullImageWidth
        }
        , interval ); //end of setInterval
    } //end of animateScript()


    document.querySelectorAll('.ig').forEach((element) => element.addEventListener('click', animateScript));

};




