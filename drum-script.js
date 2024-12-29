const soundMap = {
    "open-hh": "drum-media/open-hh.wav",
    "crash": "drum-media/crash.wav",
    "light-crash": "drum-media/tinkly-crash.wav",
    "ride": "drum-media/ride.wav",
    "closed-hh": "drum-media/closed-hh.wav",
    "snare": "drum-media/snare.wav",
    "high-tom": "drum-media/high-tom.wav",
    "mid-tom": "drum-media/mid-tom.wav",
    "cowbell": "drum-media/cowbell.wav",
    "stick-hit": "drum-media/stick-hit.wav",
    "kick": "drum-media/kick.wav",
    "floor-tom": "drum-media/floor-tom.wav"
};

function play(link) {
    let audio = new Audio(link);
    audio.load();
    audio.play();
}
document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', () => {
        const soundLink = soundMap[box.id]; 
        if (soundLink) {
            play(soundLink); 
        }
    });
});

document.addEventListener("keydown", event => {
    const keyMap = {
        "r": "open-hh",
        "t": "crash",
        "y": "light-crash",
        "u": "ride",
        "f": "closed-hh",
        "g": "snare",
        "h": "high-tom",
        "j": "mid-tom",
        "c": "cowbell",
        "v": "stick-hit",
        "b": "kick",
        "n": "floor-tom"
    };

    const boxId = keyMap[event.key.toLowerCase()];
    if (boxId) {
        const box = document.getElementById(boxId);
        if (box) {
            const soundLink = soundMap[box.id]; 
            if (soundLink) {
                play(soundLink);
                box.classList.add('active');
                setTimeout(() => box.classList.remove('active'), 100);
            }
        }
    }
});
