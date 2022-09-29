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
  $(this).append(`
    <svg width="100" data-media="${mp3url}" data-title="${title_pd}" onclick="podcastPlay();" height="100" viewBox="0 0 100 100" class="play-stop-button">
      <rect x="0" y="0" width="100" height="100" class="play-stop-button__stop" />
      <path d="M10,0l80,50l-80,50Z" class="play-stop-button__play" />
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