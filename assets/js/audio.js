const play = document.getElementById('audio-play');
const pause = document.getElementById('audio-pause');
const change = document.getElementById('audio-change');
const infos = document.getElementById('audio-infos');

// TODO : Dynamize musics loading

const musics = [
  'philly-flingo',
  'rezz-edge'
];

const getRandomMusic = () => {
  const random = Math.floor(Math.random() * musics.length);

  return 'assets/mp3/' + musics[random] + '.mp3';
};

pause.disabled = true;

const audio = new Audio();
audio.preload = 'true';
document.body.appendChild(audio);

const context = new (window.AudioContext || window.webkitAudioContext)();
const media = context.createMediaElementSource(audio);

//Create analyser node
const analyzer = context.createAnalyser();
analyzer.fftSize = 64;
const bufferLength = analyzer.frequencyBinCount;
const dataArray = new Float32Array(bufferLength);

//Set up audio node network
media.connect(analyzer);
analyzer.connect(context.destination);

play.addEventListener('click', () => {
  if (!audio.src) {
    audio.src = getRandomMusic();
  }

  audio.play().then(() => context.resume());
  console.info('Here we go again !');
  toggle();
});

pause.addEventListener('click', e => {
  audio.pause();
  console.info('Pause');
  toggle();
});

change.addEventListener('click', () => {
  audio.pause();
  audio.src = getRandomMusic();
  audio.play().then(() => console.info('An other one !'));
});

infos.addEventListener('click', () => {
  analyzer.getFloatFrequencyData(dataArray);
  console.log(dataArray);
});

const toggle = () => {
  if (play.disabled) {
    play.disabled = false;
    pause.disabled = true;
  }
  else {
    play.disabled = true;
    pause.disabled = false;
  }
};
