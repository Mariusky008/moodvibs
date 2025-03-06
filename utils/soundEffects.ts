import { Howl, Howler } from 'howler';

type SoundEffect = {
  id: string;
  src: string;
  volume?: number;
};

const sounds: { [key: string]: Howl } = {};

const soundEffects: SoundEffect[] = [
  {
    id: 'click',
    src: '/sounds/click.mp3',
    volume: 0.5
  },
  {
    id: 'notification',
    src: '/sounds/notification.mp3',
    volume: 0.7
  },
  {
    id: 'success',
    src: '/sounds/success.mp3',
    volume: 0.6
  },
  {
    id: 'mood-sent',
    src: '/sounds/mood-sent.mp3',
    volume: 0.6
  },
  {
    id: 'mood-received',
    src: '/sounds/mood-received.mp3',
    volume: 0.7
  },
  {
    id: 'challenge-complete',
    src: '/sounds/challenge-complete.mp3',
    volume: 0.8
  }
];

export const initSounds = () => {
  soundEffects.forEach(effect => {
    sounds[effect.id] = new Howl({
      src: [effect.src],
      volume: effect.volume || 0.5,
      preload: true
    });
  });
};

export const playSound = (id: string) => {
  const sound = sounds[id];
  if (sound) {
    sound.play();
  }
};

export const stopSound = (id: string) => {
  const sound = sounds[id];
  if (sound) {
    sound.stop();
  }
};

export const setSoundVolume = (id: string, volume: number) => {
  const sound = sounds[id];
  if (sound) {
    sound.volume(Math.max(0, Math.min(1, volume)));
  }
};

export const setMasterVolume = (volume: number) => {
  Object.values(sounds).forEach(sound => {
    sound.volume(Math.max(0, Math.min(1, volume)));
  });
};

export const enableSounds = () => {
  try {
    if (Howler) {
      Howler.mute(false);
    }
  } catch (error) {
    console.error('Error enabling sounds:', error);
  }
};

export const disableSounds = () => {
  try {
    if (Howler) {
      Howler.mute(true);
    }
  } catch (error) {
    console.error('Error disabling sounds:', error);
  }
};