import { useEffect, useState } from "react";

import styles from './ActionBar.module.css';
import play from '../../assets/png/play.png';
import pause from '../../assets/png/pause.png';
import shuffle from '../../assets/png/shuffle.png';
import previous from '../../assets/png/back.png';
import next from '../../assets/png/next.png';
import {log} from "util";

function ActionBar() {
    const [ playing, setPlaying ] = useState(false);
    const [ music, setMusic ] = useState('');
    const [ audio, setAudio ] = useState(new Audio());
    const [ audioContext, setAudioContext ] = useState(new AudioContext());
    const [ progress, setProgress ] = useState(0);
    const [ musicDuration, setMusicDuration ] = useState(0);

    const getMusics = () => {
        // TODO - Fetch musics from specific directory
        return [ 'philly-flingo', 'rezz-edge' ];
    };

    const musics = getMusics();


    const getRandomMusic = () => {
        const random = Math.floor(Math.random() * musics.length);

        return '/assets/mp3/' + musics[random] + '.mp3';
    };

    const initializePlayer = () => {
        const audioCtx = new AudioContext();
        audioCtx.resume();

        setAudioContext(audioCtx);
        audio.preload = 'true';
        audio.controls = false;
        preloadMusic();

        document.body.appendChild(audio);

        const context = new AudioContext();
        const media = context.createMediaElementSource(audio);

        const analyzer = context.createAnalyser();
        analyzer.fftSize = 64;
        // const bufferLength = analyzer.frequencyBinCount;
        // const frequencies = new Float32Array(bufferLength);

        media.connect(analyzer);
        analyzer.connect(context.destination);
    };

    useEffect(() => {
        initializePlayer();

        audio.addEventListener('timeupdate', () => handleProgress());
    }, []);

    const handleProgress = () => {
        setProgress(audio.currentTime);

        if (!musicDuration) {
            setMusicDuration(audio.duration);
        }
    }

    // EVENTS

    const preloadMusic = () => {
        const newMusic = getRandomMusic();
        setMusic(newMusic);
        audio.src = newMusic;
    };

    const togglePlayAndPause = () => {
        if (!playing) {
            if (!audio.src) {
                preloadMusic();
            }

            audioContext.resume().then(() => audio.play()).catch(e => console.log(e));
        }
        else {
            audio.pause();
        }

        setPlaying(!playing);
    };

    const changeMusicTime = (value: any) => {
        audio.currentTime = value;
    }

    return (
        <div className={ styles.actionBar }>
            <div className={ styles.music }>
                <div className={ styles.artist }>
                    <img src="https://via.placeholder.com/64" alt="Artist"/>
                    <p> { music } </p>
                </div>
                <div className={ styles.controls }>
                    <button onClick={ () => {
                        audioContext.resume().then(() => console.log('Done'));
                        console.log(audioContext.state);
                    }}>
                        RESUME
                    </button>


                    <button id="btn-previous" className={ styles.cta }>
                        <img src={ previous } alt="Previous" />
                    </button>

                    <button id="btn-toggle" onClick={ () => togglePlayAndPause() } className={ styles.cta }>
                        { !playing
                            ? <img src={ play } alt="Play" />
                            : <img src={ pause } alt="Pause" />
                        }
                    </button>

                    <button id="btn-next" className={ styles.cta }>
                        <img src={ next } alt="Next" />
                    </button>

                    <button id="btn-shuffle" className={ styles.cta }>
                        <img src={ shuffle } alt="Shuffle" />
                    </button>
                </div>

                <div className={ styles.duration }>
                    <input onChange={ e => changeMusicTime(e.target.value) } value={ progress } step="0.01" min="0" max={ musicDuration } type="range" />
                </div>
            </div>
        </div>
    );
}

export default ActionBar;
