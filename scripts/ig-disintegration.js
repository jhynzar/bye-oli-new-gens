$(function(){

    const DEBUG = false;
    const REPETITION_COUNT = 2; // number of times each pixel is assigned to a canvas
    const NUM_FRAMES = 128;

    /**
     * Generates the individual subsets of pixels that are animated to create the effect
     * @param {HTMLCanvasElement} ctx
     * @param {number} count The higher the frame count, the less grouped the pixels will look - Google use 32, but for our elms we use 128 since we have images near the edges
     * @return {HTMLCanvasElement[]} Each canvas contains a subset of the original pixels
     */
    function generateFrames($canvas, count = 32) {
    const { width, height } = $canvas;
    const ctx = $canvas.getContext("2d");
    const originalData = ctx.getImageData(0, 0, width, height);
    const imageDatas = [...Array(count)].map(
        (_,i) => ctx.createImageData(width, height)
    );
    
    // assign the pixels to a canvas
    // each pixel is assigned to 2 canvas', based on its x-position
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
        for (let i = 0; i < REPETITION_COUNT; ++i) {
            const dataIndex = Math.floor(
            count * (Math.random() + 2 * x / width) / 3
            );
            const pixelIndex = (y * width + x) * 4;
            // copy the pixel over from the original image
            for (let offset = 0; offset < 4; ++offset) {
            imageDatas[dataIndex].data[pixelIndex + offset]
                = originalData.data[pixelIndex + offset];
            }
        }
        }
    }
    
    // turn image datas into canvas'
    return imageDatas.map(data => {
        const $c = $canvas.cloneNode(true);
        $c.getContext("2d").putImageData(data, 0, 0);
        return $c;
    });
    }

    /**
     * Inserts a new element over an old one, hiding the old one
     */
    function replaceElementVisually($old, $new) {
    const $parent = $old.offsetParent;
    $new.style.top = `${$old.offsetTop}px`;
    $new.style.left = `${$old.offsetLeft}px`;
    $new.style.width = `${$old.offsetWidth}px`;
    $new.style.height = `${$old.offsetHeight}px`;
    $parent.appendChild($new);
    $old.style.visibility = "hidden";
    $old.style.opacity = "0"; //Mj Added -  for time back
    }

    /**
     * Disintegrates an element
     * @param {HTMLElement} $elm
     */
    function disintegrate($elm, audio) { //Mj Added - audio as parameter for syncing
        html2canvas($elm).then($canvas => {    
            // create the container we'll use to replace the element with
            const $container = document.createElement("div");
            $container.classList.add("disintegration-container");
            
            // setup the frames for animation
            const $frames = generateFrames($canvas, NUM_FRAMES);
            $frames.forEach(($frame, i) => {
            $frame.style.transitionDelay = `${1.35 * i / $frames.length}s`;
            $container.appendChild($frame);
            });
            
            // then insert them into the DOM over the element
            replaceElementVisually($elm, $container);
            
            // then animate them
            $container.offsetLeft; // forces reflow, so CSS we apply below does transition
            if (!DEBUG) {
            audio.play(); //Mj Added - parameter audio played for syncing
            // set the values the frame should animate to
            // note that this is done after reflow so the transitions trigger
            $frames.forEach($frame => {
                const randomRadian = 2 * Math.PI * (Math.random() - 0.5);
                $frame.style.transform = 
                `rotate(${15 * (Math.random() - 0.5)}deg) translate(${60 * Math.cos(randomRadian)}px, ${30 * Math.sin(randomRadian)}px)
        rotate(${15 * (Math.random() - 0.5)}deg)`;
                    $frame.style.opacity = 0;
            });
            } else {
            $frames.forEach($frame => {
                $frame.style.animation = `debug-pulse 1s ease ${$frame.style.transitionDelay} infinite alternate`;
            });
            }
        });
    }


    /** === Below is just to bind the module and the DOM == */
    // [...document.querySelectorAll(".disintegration-target")].forEach($elm => {
    //   $elm.addEventListener("click", () => {
    //     if ($elm.disintegrated) { return; }
    //     $elm.disintegrated = true;
    //     disintegrate($elm);
    //   });
    // });

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }

    window.revertDisintegration = function timeBack() {
        const disintegratedTargets = document.querySelectorAll('.disintegration-target');

        disintegratedTargets.forEach(element => {
            element.classList.remove('disintegration-target');
        });

        //wait for the animation of gauntlet then reset styles
        setTimeout(() => {
            disintegratedTargets.forEach(element => {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
            });
        }, 1000);
    }

    window.startDisintegration = function startDisintegration() {
        const disintegrateCount = disintegrationCandidates.length / 2;
        const audioCount = document.querySelectorAll('.disintegration-audio').length;
        const targetNumbers = [];
        const audioNumbers = [];

        for (let i = 0; i < disintegrateCount; i++) {
            //Random Target Numbers
            let randomTargetNumber;
            do {
                randomTargetNumber = getRandomIntInclusive(0, disintegrationCandidates.length - 1);
            } while (targetNumbers.includes(randomTargetNumber));
            targetNumbers.push(randomTargetNumber);

            //Random Audio Numbers
            let randomAudioNumber;
            do {
                randomAudioNumber = getRandomIntInclusive(0, audioCount - 1);
            } while (targetNumbers.includes(randomAudioNumber));
            audioNumbers.push(randomAudioNumber);
        }

        const disintegrationCandidatesHtml = document.querySelectorAll('.disintegration-candidate');

        targetNumbers.forEach(value => {
            disintegrationCandidatesHtml[value].classList.add('disintegration-target');
        });

        const disintegrationTargetsHtml = document.querySelectorAll('.disintegration-target');
        const audioHtml = document.querySelectorAll('.disintegration-audio');

        let timeoutMs = 0;
        disintegrationTargetsHtml.forEach((element, index) => {
            setTimeout(() => {
                disintegrate(element, audioHtml[index]);
            }, timeoutMs);
            timeoutMs += 2000;
        });
    }

});
