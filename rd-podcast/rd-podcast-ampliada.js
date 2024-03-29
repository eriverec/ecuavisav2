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


var podcastMeta = document.querySelector('.Layout_Ampliada_Podcast .podcast.col-12');
// var podcastLoader = document.querySelector('.Layout_Ampliada_Podcast .loader_podcast');

setTimeout(()=>{
  podcastMeta.style.visibility= 'visible';
  // podcastLoader.style.visibility= 'hidden';
},300);

var ti = document.title;
var mp3url = $('.Multimedia_Text audio').find('source').attr('src');

$('.podcast__episode_title').html(ti);
$('.mainplayer ').attr('src', mp3url);