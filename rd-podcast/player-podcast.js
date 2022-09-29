// podcast player executer 
"use strict";
const options = {
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
new MediaElementPlayer(document.querySelector(".mainplayer"), options);
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

// preparador de contenidos reproducibles
$('.IMG_TIT_TXT.mult').each(function (i, obj) {
  $(this).find('.Multimedia_Text').css('display', 'none'); // ocultamos players
  //obtenemos variables
  const mp3url = $(this).find('source').attr('src');
  const title_pd = $(this).find('h2').text();
  // agregamos botones del player
  $(this).find('.media_block .pod_icon_play').append(`
  <svg class="play-stop-button" data-media="${mp3url}" data-title="${title_pd}" onclick="podcastPlay();" width="38"  height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.694336" y="0.975098" width="37" height="37" rx="3" fill="#23DCD1"  />
  <path  class="play-stop-button__stop" d="M13.4167 13.3333H24.5833V23.6667H13.4167V13.3333ZM13.3611 11.75C12.9396 11.75 12.5319 11.9053 12.2285 12.187C11.9246 12.4692 11.75 12.8562 11.75 13.2639V23.7361C11.75 24.589 12.4895 25.25 13.3611 25.25H24.6389C25.0605 25.25 25.4681 25.0947 25.7715 24.813C26.0754 24.5308 26.25 24.1439 26.25 23.7361V13.2639C26.25 12.8562 26.0754 12.4692 25.7715 12.187C25.4681 11.9053 25.0604 11.75 24.6389 11.75H13.3611Z" fill="#2927B9" stroke="#2927B9" stroke-width="0.5"/>
  <path class="play-stop-button__play" d="M13.0273 23.1822V12.3681C13.0273 11.5599 13.9364 11.0856 14.5993 11.5479L24.7893 18.6537C25.3633 19.0539 25.3593 19.9047 24.7817 20.2995L13.0273 28.335" stroke="#2927B9" stroke-width="2" stroke-linecap="round" />
</svg>`);
});
// Fin preparador de contenidos reproducibles

// ####################################################################

// Funcion de reproducción
function podcastPlay() {
  var theMp3 = (event.currentTarget.getAttribute('data-media'));
  var theTitle = (event.currentTarget.getAttribute('data-title'));
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
// End Funcion de reproducción