(() => {
  const SONGS = [
    'audio/Blast off song #1.m4a',
    'audio/Blast off song #2.m4a',
    'audio/Blast off song #3.m4a',
    'audio/Blast off song #4.m4a',
    'audio/World 1 Theme.m4a'
  ];

  const button = document.getElementById('musicButton');
  if (!button || SONGS.length === 0) return;

  const audio = new Audio();
  audio.preload = 'auto';
  audio.loop = true;
  let songIndex = -1;

  function updateButton() {
    const isPlaying = !audio.paused;
    button.classList.toggle('is-playing', isPlaying);
    button.setAttribute('aria-label', isPlaying ? 'Play next song' : 'Play music');
    button.title = isPlaying ? 'Play next song' : 'Play music';
  }

  function playSong(index) {
    songIndex = (index + SONGS.length) % SONGS.length;
    audio.src = SONGS[songIndex];
    audio.currentTime = 0;
    audio.play().then(updateButton).catch(updateButton);
  }

  button.addEventListener('click', () => {
    playSong(songIndex + 1);
  });

  audio.addEventListener('pause', updateButton);
  audio.addEventListener('play', updateButton);
  updateButton();
})();
