
$(function(){
    // Initialization
    let cardsInnerHtml = '';

    disintegrationCandidates.forEach(target => {
        cardsInnerHtml += `
            <div class="card disintegration-candidate">
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
