document.addEventListener('DOMContentLoaded', async function() {
    // Elementos do DOM
    const keys = document.querySelectorAll('.key');
    const playBtn = document.getElementById('play-btn');
    const letter = document.getElementById('letter');
    const video = document.getElementById('bg-video');
    
    // Configurar video em loop
    video.loop = true;
    
    // Variáveis de controle
    let audioContext;
    let piano;
    let isPlaying = false;
    let activeNotes = new Set();
    let confettiInterval;
    let currentSequence = [];
    
    // Inicializar áudio e carregar piano
    async function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Carregar soundfont de piano real
            piano = await Soundfont.instrument(audioContext, 'acoustic_grand_piano', {
                soundfont: 'MusyngKite',
                gain: 2
            });
            
            return true;
        } catch (error) {
            console.error('Error loading piano:', error);
            return false;
        }
    }
    
    // Tocar nota individual
    async function playNote(note, duration = 0.5) {
        if (piano && audioContext) {
            const noteName = getNoteName(note);
            activeNotes.add(noteName);
            
            // Tocar a nota
            piano.play(noteName, audioContext.currentTime, {
                duration: duration,
                gain: 0.8
            });
            
            // Animação da tecla
            const key = document.querySelector(`.key[data-note="${note}"]`);
            if (key) {
                key.classList.add('active');
                setTimeout(() => {
                    key.classList.remove('active');
                }, duration * 800);
            }
        }
    }
    
    // Parar todas as notas
    function stopAllNotes() {
        if (piano) {
            activeNotes.forEach(note => {
                piano.stop(note);
            });
            activeNotes.clear();
        }
        
        // Remover estado ativo de todas as teclas
        keys.forEach(key => {
            key.classList.remove('active');
        });
    }
    
    // Converter nota MIDI para nome (ex: "C4")
    function getNoteName(midiNote) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midiNote / 12) - 1;
        const noteIndex = midiNote % 12;
        return notes[noteIndex] + octave;
    }
    
    // Configuração dos confetes
    function startConfetti() {
        const colors = ['#c8a2c8', '#9b59b6', '#ffffff', '#e0b0ff'];
        
        confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            shapes: ['circle', 'square'],
            gravity: 1.3,
            ticks: 90,
            startVelocity: 40
        });
        
        const duration = 5000;
        const end = Date.now() + duration;
        const interval = 250;

        const frame = () => {
            confetti({
                particleCount: 12,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
                shapes: ['circle'],
                gravity: 1.3,
                ticks: 80,
                startVelocity: 35
            });
            
            confetti({
                particleCount: 12,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
                shapes: ['square'],
                gravity: 1.3,
                ticks: 80,
                startVelocity: 35
            });

            if (Date.now() < end) {
                confettiInterval = setTimeout(frame, interval);
            }
        };
        
        frame();
    }

    function stopConfetti() {
        if (confettiInterval) {
            clearTimeout(confettiInterval);
        }
    }

    // Tocar música de aniversário
    async function playBirthdaySong(e) {
        if (e) e.preventDefault();
        
        if (!audioContext) {
            await initAudio();
        }
        
        if (isPlaying) {
            // Parar a música
            stopAllNotes();
            stopConfetti();
            isPlaying = false;
            playBtn.textContent = 'НАЧАТЬ';
            playBtn.classList.remove('playing');
            currentSequence = [];
            return;
        }
        
        // Iniciar reprodução
        isPlaying = true;
        playBtn.textContent = 'СТОП';
        playBtn.classList.add('playing');
        
        // Iniciar confetes
        startConfetti();
        
        // Sequência musical (notas MIDI)
        const startTime = audioContext.currentTime + 0.5;
        currentSequence = [
            {note: 60, time: startTime + 0, duration: 0.3},   // C4
            {note: 60, time: startTime + 0.5, duration: 0.3}, // C4
            {note: 62, time: startTime + 1, duration: 0.5},   // D4
            {note: 60, time: startTime + 1.5, duration: 0.5}, // C4
            {note: 65, time: startTime + 2, duration: 0.5},   // F4
            {note: 64, time: startTime + 2.5, duration: 1},   // E4
            
            {note: 60, time: startTime + 3.5, duration: 0.3}, // C4
            {note: 60, time: startTime + 4, duration: 0.3},   // C4
            {note: 62, time: startTime + 4.5, duration: 0.5}, // D4
            {note: 60, time: startTime + 5, duration: 0.5},   // C4
            {note: 67, time: startTime + 5.5, duration: 0.5}, // G4
            {note: 65, time: startTime + 6, duration: 1},     // F4
            
            {note: 60, time: startTime + 7, duration: 0.3},   // C4
            {note: 60, time: startTime + 7.5, duration: 0.3}, // C4
            {note: 72, time: startTime + 8, duration: 0.5},   // C5
            {note: 69, time: startTime + 8.5, duration: 0.5}, // A4
            {note: 65, time: startTime + 9, duration: 0.5},   // F4
            {note: 64, time: startTime + 9.5, duration: 0.5}, // E4
            {note: 62, time: startTime + 10, duration: 1},    // D4
            
            {note: 70, time: startTime + 11, duration: 0.3},  // A#4
            {note: 70, time: startTime + 11.5, duration: 0.3},// A#4
            {note: 69, time: startTime + 12, duration: 0.5},  // A4
            {note: 65, time: startTime + 12.5, duration: 0.5},// F4
            {note: 67, time: startTime + 13, duration: 0.5},  // G4
            {note: 65, time: startTime + 13.5, duration: 1}   // F4
        ];

        // Tocar todas as notas da sequência
        currentSequence.forEach(noteObj => {
            const noteName = getNoteName(noteObj.note);
            
            // Agendar a nota
            piano.play(noteName, noteObj.time, {
                duration: noteObj.duration,
                gain: 0.8
            });
            
            // Animar a tecla correspondente
            const key = document.querySelector(`.key[data-note="${noteObj.note}"]`);
            if (key) {
                const delay = (noteObj.time - audioContext.currentTime) * 1000;
                setTimeout(() => {
                    key.classList.add('active');
                    setTimeout(() => {
                        key.classList.remove('active');
                    }, noteObj.duration * 800);
                }, delay > 0 ? delay : 0);
            }
        });

        // Finalização
        setTimeout(() => {
            if (isPlaying) {
                letter.classList.remove('hidden');
                setTimeout(() => {
                    letter.classList.add('show');
                    window.scrollTo({
                        top: letter.offsetTop,
                        behavior: 'smooth'
                    });
                }, 100);
                
                isPlaying = false;
                playBtn.textContent = 'НАЧАТЬ';
                playBtn.classList.remove('playing');
                currentSequence = [];
            }
        }, 15000);
    }

    // Event listeners para as teclas do piano (interatividade)
    keys.forEach(key => {
        // Mouse
        key.addEventListener('mousedown', async () => {
            if (!audioContext) {
                await initAudio();
            }
            const note = parseInt(key.getAttribute('data-note'));
            playNote(note);
        });
        
        key.addEventListener('mouseup', () => {
            key.classList.remove('active');
        });
        
        key.addEventListener('mouseleave', () => {
            key.classList.remove('active');
        });
        
        // Touch
        key.addEventListener('touchstart', async (e) => {
            e.preventDefault();
            if (!audioContext) {
                await initAudio();
            }
            const note = parseInt(key.getAttribute('data-note'));
            playNote(note);
        });
        
        key.addEventListener('touchend', (e) => {
            e.preventDefault();
            key.classList.remove('active');
        });
    });

    // Controle do botão principal
    playBtn.addEventListener('click', playBirthdaySong);
    playBtn.addEventListener('touchstart', playBirthdaySong);

    // Ativar áudio no primeiro toque
    document.body.addEventListener('touchstart', initOnFirstInteraction, { once: true });
    document.body.addEventListener('mousedown', initOnFirstInteraction, { once: true });
    
    function initOnFirstInteraction() {
        initAudio();
    }
});
