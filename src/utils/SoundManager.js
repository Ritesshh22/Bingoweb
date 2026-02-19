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

    sayBingo() {
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance("BINGO!");

        // Try to find a good female/male voice
        const voices = window.speechSynthesis.getVoices();
        // Preference: English female voice for clear "Bingo" announcement
        const preferredVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female')) || voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.pitch = 1.2; // Slightly excited
        utterance.rate = 1.0;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
    }

    playWin() {
        // First announce in human voice
        this.sayBingo();

        // Celebratory "B-I-N-G-O" Jingle
        const notes = [
            { f: 523.25, d: 0.1, t: 0 },   // B
            { f: 659.25, d: 0.1, t: 150 }, // I
            { f: 783.99, d: 0.1, t: 300 }, // N
            { f: 880.00, d: 0.1, t: 450 }, // G
            { f: 1046.50, d: 0.4, t: 600 } // O!
        ];

        notes.forEach((note) => {
            setTimeout(() => this.tone(note.f, note.d + 0.2, 'square'), note.t + 500); // Slight delay for voice to start
        });

        // Add some "confetti" sounds (high pips)
        setTimeout(() => {
            this.tone(1318.51, 0.1, 'sine');
            this.tone(1567.98, 0.1, 'sine');
        }, 1500);
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
