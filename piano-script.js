const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // Tone.Synth = monophonic. PolySynth(Tone.Synth) = lots of tone.synth's = chords
const keysPressed = {};
const noteOutput = document.getElementById("note-output")
const chordOutput = document.getElementById("chord-output");
const keySelector = document.getElementById("key-selector");

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
  [";", "E5"]
]);
let activeNotes = [];

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
  }
};

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: Math.random(), y: Math.random() } 
  });
}

document.addEventListener("keydown", (e) => {
  keyToNote.forEach(([key, note]) => { // goes through each list in array. sets first element as key, second as note
    if (e.key === key) { // e.key is keyboard key pressed from "keydown".
      if (!keysPressed[key]) {
        noteOutput.textContent += ` ${note}`; // remember backticks!
      }
      playNote(key, note);
      chordFinder();
    }
    else if (e.key === 'r' || e.key === 'R'){
      launchConfetti() //easter egg
    }

  });
});



document.addEventListener("keyup", (e) => {
  keyToNote.forEach(([key,note]) => {
    if (e.key === key) {
      releaseNote(key,note);
      chordFinder();
    }
  });
});

//click
document.querySelectorAll('.key').forEach(Key => {
  Key.addEventListener('click', () => {
    const key = Key.getAttribute("data-key");
    const note = keyToNote.get(key); // Direct lookup using Map
    if (note) {
      console.log(note); 
      playNote(key,note); 
    }
  });
});

const getDiatonicNotes = (key) => {
  const scale = Tonal.Scale.get(key); // Use Tonal.js to get the scale
  return scale.notes; // Returns an array of notes in the scale, e.g., ["C", "D", "E", "F", "G", "A", "B"]
};

// Function to highlight diatonic keys
const highlightDiatonicKeys = (key) => {
  const diatonicNotes = getDiatonicNotes(key);

  // Reset all keys
  document.querySelectorAll(".key").forEach((keyElement) => {
    keyElement.classList.remove("diatonic");
  });

  // Highlight diatonic keys
  keyToNote.forEach(([keyboardKey, note]) => {
    const pitch = Tonal.Note.get(note).pc; // Get the pitch class (e.g., "C" from "C4")
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