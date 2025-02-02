const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // Tone.Synth = monophonic. PolySynth(Tone.Synth) = lots of tone.synth's = chords
const recorder = new Tone.Recorder();
synth.connect(recorder);
const keysPressed = {};

const noteOutput = document.getElementById("note-output")
const chordOutput = document.getElementById("chord-output");
const keySelector = document.getElementById("key-selector");
const recordButton = document.getElementById("record-button");

let noteHistory = [];
const keyToNote = new Map([
  ["a", "C4"],
  ["w", "C#4"],
  ["s", "D4"],
  ["e", "D#4"],
  ["d", "E4"],
  ["f", "F4"],
  ["t", "F#4"],
  ["g", "G4"],
  ["y", "G#4"],
  ["h", "A4"],
  ["u", "A#4"],
  ["j", "B4"],
  ["k", "C5"],
  ["o", "C#5"],
  ["l", "D5"],
  ["p", "D#5"],
  [";", "E5"],
  ["'","F5"],
  ["]","F#5"],
  ["\\","G5"]
]);
let activeNotes = [];
let isRecording = false;
const updateNoteHistory = (note) => {
  noteHistory.push(note);
  if (noteHistory.length > 25) {
    noteHistory.shift();
  }
  noteOutput.textContent = `Note history: ${noteHistory.join(" ")}`;
};

const playNote = (key, note) => {
  if (!keysPressed[key]) {
    synth.triggerAttack(note);
    keysPressed[key] = true;
    const keyElement = document.querySelector(`[data-key="${key}"]`); // querySelector searches html for data-key="the key". keyElement becomes that html element
    keyElement.classList.add("active") // adds active to class list of keyElement
    activeNotes.push(note);
    chordFinder();
  }
}

const releaseNote = (key,note) => {
  if (keysPressed[key]) {
    synth.triggerRelease(note);
    keysPressed[key] = false
    const keyElement = document.querySelector( `[data-key="${key}"]`);
    keyElement.classList.remove("active");
    activeNotes = activeNotes.filter((n) => n !==note);
  }
}
const chordFinder = () => {
  const detectedChords = Tonal.Chord.detect(activeNotes);
  if (detectedChords.length > 0) {
    chordOutput.textContent = `Chord: ${detectedChords.join(", ")}`;
  }else{
    chordOutput.textContent = "No chord detected"
  }
};

// presses
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: Math.random(), y: Math.random() } 
  });
}

document.addEventListener("keydown", (e) => {
  const note = keyToNote.get(e.key);
  if (note) { 
    if (!keysPressed[e.key]) {
      updateNoteHistory(note);
      playNote(e.key, note); 
    }
  } else if (e.key === 'r' || e.key === 'R') {
    launchConfetti(); //easter egg
  }
});

document.addEventListener("keyup", (e) => {
  const note = keyToNote.get(e.key); 
  if (note) {
    releaseNote(e.key, note); 
  }
});

//clicks!
document.querySelectorAll('.key').forEach(Key => {
// DESKTOP - mouse
  Key.addEventListener('mousedown', () => {
    const key = Key.getAttribute("data-key");
    const note = keyToNote.get(key);
    if (note) {
      if (!keysPressed[key]) {
        updateNoteHistory(note);
        playNote(key, note); 
      }
    }
  })

  Key.addEventListener('mouseup', () => {
    const key = Key.getAttribute("data-key");
    const note = keyToNote.get(key);
    if (note) {
      releaseNote(key, note); 
    }
  });

//MOBILE
  Key.addEventListener('touchstart', (event) => {
    event.preventDefault(); 
    const key = Key.getAttribute("data-key");
    const note = keyToNote.get(key);
    if (!keysPressed[key]) {
      updateNoteHistory(note);
      playNote(key, note); 
    }
  });

  Key.addEventListener('touchend', () => {
    const key = Key.getAttribute("data-key");
    const note = keyToNote.get(key);
    if (note) {
      releaseNote(key, note);
    }
  });
});


// scale indicator
const getDiatonicNotes = (key) => {
  const scale = Tonal.Scale.get(key); 
  return scale.notes; //list of notes
};

const highlightDiatonicKeys = (key) => {
  const diatonicNotes = getDiatonicNotes(key); 
  document.querySelectorAll(".key").forEach((keyElement) => {
    keyElement.classList.remove("diatonic"); //remove prev
  });
  keyToNote.forEach((note, keyboardKey) => {
    const pitch = Tonal.Note.get(note).pc; // just pitch class ("C" from "C4")
    if (diatonicNotes.includes(pitch)) {
      const keyElement = document.querySelector(`[data-key="${keyboardKey}"]`);
      if (keyElement) keyElement.classList.add("diatonic");
    }
  });
};

keySelector.addEventListener("change", (e) => {
  const selectedKey = e.target.value; 
  highlightDiatonicKeys(selectedKey);
});


//RECORDING
recordButton.addEventListener("click", async() =>{
  if (!isRecording) {
    await Tone.start();
    recorder.start();
    recordButton.textContent = "stop and export";
    isRecording = true;
  } else {
    const recording = await recorder.stop();
    const url = URL.createObjectURL(recording);
    const a = document.createElement("a");
    a.href = url;
    a.download = "piano-recording.wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    recordButton.textContent = "record!";
    isRecording = false;
  }
});