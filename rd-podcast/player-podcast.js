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
  <path class="play-stop-button__stop" d="M11.889 12.5249H24.7223V24.5249H11.889V12.5249ZM11.8612 10.7749C11.3874 10.7749 10.93 10.9512 10.5903 11.2697C10.2501 11.5886 10.0557 12.0248 10.0557 12.4832V24.5666C10.0557 25.5246 10.8799 26.2749 11.8612 26.2749H24.7501C25.224 26.2749 25.6814 26.0986 26.021 25.7801C26.3612 25.4612 26.5557 25.025 26.5557 24.5666V12.4832C26.5557 12.0248 26.3612 11.5886 26.021 11.2697C25.6814 10.9512 25.224 10.7749 24.7501 10.7749H11.8612Z" fill="#2927B9" stroke="#2927B9" stroke-width="0.5"/>
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