class SoundManager {
    constructor() {
        this.context = null;
        this.gainNode = null;
    }

    init() {
        if (!this.context) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
            // Default volume
            this.gainNode.gain.value = 0.3;
        }
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    tone(freq, duration, type = 'sine') {
        try {
            this.init();
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.context.currentTime);

            gain.gain.setValueAtTime(0.3, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start();
            osc.stop(this.context.currentTime + duration);
        } catch (e) {
            console.error("Audio failed:", e);
        }
    }

    playClick() {
        // High pitched click
        this.tone(800, 0.1, 'sine');
    }

    playRobotMove() {
        // Lower pitched distinct sound
        this.tone(400, 0.15, 'triangle');
    }

    playWin() {
        // Victory Arpeggio (C Major)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        let time = 0;
        notes.forEach((freq) => {
            setTimeout(() => this.tone(freq, 0.3, 'square'), time);
            time += 150;
        });
        // Final chordish sound
        setTimeout(() => {
            this.tone(523.25, 0.8, 'sine');
            this.tone(783.99, 0.8, 'sine');
        }, time + 100);
    }

    playLose() {
        // Sad trombone-ish
        const notes = [392.00, 369.99, 349.23, 329.63]; // G4, F#4, F4, E4
        let time = 0;
        notes.forEach((freq) => {
            setTimeout(() => this.tone(freq, 0.4, 'sawtooth'), time);
            time += 300;
        });
    }

    playBgm() {
        // Placeholder for future implementation if BGM is needed
        // Background music is complex with pure WebAudio API without loops
    }
}

const sounds = new SoundManager();
export default sounds;
