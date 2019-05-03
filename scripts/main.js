
$(function(){
    // Initialization
    let cardsInnerHtml = '';

    disintegrationCandidates.forEach(target => {
        //style="transition: visibility 0s, opacity 1s linear;" must be on the HTML for higher CSS Hierarchy of transition property
        cardsInnerHtml += `
            <div class="card disintegration-candidate" style="transition: visibility 0s, opacity 1s linear;">
                <div class="image">
                    <img src="${target.imgBase64}" alt="">
                </div>
                <div class="content">
                    <div class="header">${target.name}</div>
                </div>
            </div>
            `
        ;
    });

    document.querySelector('.cards').innerHTML = cardsInnerHtml;
});
