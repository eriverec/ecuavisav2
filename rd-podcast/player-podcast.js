// podcast player executer 
"use strict";
const optionsPodcast = {
  defaultSpeed: "1.00",
  speeds: ["1.25", "1.50", "2.00", "0.75"],
  loop: true,
  skipBackInterval: 15,
  jumpForwardInterval: 15,
  features: [
    "playpause",
    "progress",
    "current",
    "duration",
    "skipback",
    "changespeed",
    "volume",
    "jumpforward"
  ]
};
new MediaElementPlayer(document.querySelector(".mainplayer"), optionsPodcast);
// Separate the audio controls so I can style them better.
(() => {
  const elementTop = document.createElement("div");
  const elementBottom = document.createElement("div");
  elementTop.classList.add("mejs-prepended-buttons");
  elementBottom.classList.add("mejs-appended-buttons");

  const controls = document.querySelector(".mejs__controls");
  controls.prepend(elementTop);
  controls.append(elementBottom);

  const controlsChildren = Array.from(controls.childNodes).filter((v) =>
    v.className.startsWith("mejs_")
  );

  controlsChildren.slice(0, 3).forEach((elem) => {
    elementTop.append(elem);
  });

  controlsChildren.slice(3, controlsChildren.length).forEach((elem) => {
    elementBottom.append(elem);
  });
})();
// Fin podcast player executer

// ####################################################################

function addClassMV() {
  // var selecMVisto = document.querySelectorAll('.iter-tabview-content-item');
  // for (let se of selecMVisto) {
  //   se.classList.add('pod_items');
  // }
  if($('.iter-tabview-content-item')){
    $('.iter-tabview-content-item').addClass('pod_items');
    console.log("clase agregada");
  }else{
    console.log("NO EXISTE")
  }
}


// preparador de contenidos reproducibles

function dynamicContent() {
  $('.IMG_TIT_TXT.mult').each(function (i, obj) {
    $(this).find('.Multimedia_Text').css('display', 'none'); // ocultamos players
    //obtenemos variables
    const mp3url = $(this).find('source').attr('src');
    const title_pd = $(this).find('h2').text();

    // agregamos botones del player
    $(this).find('.media_block .pod_icon_play').append(`
    <svg class="play-stop-button" data-media="${mp3url}" data-title="${title_pd}" onclick="podcastPlay();" width="38"  height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.694336" y="0.975098" width="37" height="37" rx="3" fill="#23DCD1"  />
  
    <path class="play-stop-button__stop" d="M12.8333 13.75H25.6666V25.75H12.8333V13.75ZM12.8055 12C12.3317 12 11.8743 12.1763 11.5346 12.4948C11.1944 12.8137 11 13.2499 11 13.7083V25.7917C11 26.7497 11.8242 27.5 12.8055 27.5H25.6944C26.1683 27.5 26.6257 27.3237 26.9653 27.0052C27.3055 26.6863 27.5 26.2501 27.5 25.7917V13.7083C27.5 13.2499 27.3055 12.8137 26.9653 12.4948C26.6257 12.1763 26.1683 12 25.6944 12H12.8055Z" fill="#2927B9" stroke="#2927B9" stroke-width="0.5"/>
  
    <path class="play-stop-button__play" d="M13.0273 23.1822V12.3681C13.0273 11.5599 13.9364 11.0856 14.5993 11.5479L24.7893 18.6537C25.3633 19.0539 25.3593 19.9047 24.7817 20.2995L13.0273 28.335" stroke="#2927B9" stroke-width="2" stroke-linecap="round" />
  
  </svg>`);
  });
}

// Fin preparador de contenidos reproducibles

// ####################################################################

// Funcion de reproducción
function podcastPlay() {
  var theMp3 = (event.currentTarget.getAttribute('data-media'));
  var theTitle = (event.currentTarget.getAttribute('data-title'));
  var clasRemove = document.querySelector('.menu .podcast');
  var classAnimation = document.querySelector('.menu .podcast .podcast__meta');

  clasRemove.classList.remove('noVisible');
  classAnimation.classList.add('animationPLayer');

  // detectamos si esta reproduciendo para dar stop o si reproduce otro audio
  if (event.currentTarget.classList.contains('play-stop-button--playing')) {
    setTimeout(function () {
      $('.mejs__playpause-button').click();
    }, 100);
  } else {
    playStop();
  }
  event.currentTarget.classList.toggle('play-stop-button--playing');

  $('.mainplayer').attr('src', theMp3);
  $('.podcast__episode_title').html(theTitle);
  $('.mejs__playpause-button').click();
  console.log('url:' + theMp3);
};

function playStop() {
  var elements = document.querySelectorAll(".play-stop-button");
  elements.forEach(element => {
    element.classList.remove('play-stop-button--playing');
  });
};


setTimeout(function () {
  addClassMV();
  dynamicContent();
}, 700);





// End Funcion de reproducción