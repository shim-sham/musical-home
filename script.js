const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // Tone.Synth = monophonic. PolySynth(Tone.Synth) = lots of tone.synth's = chords
const keysPressed = {};

const keyToNote = [
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
];

const playNote = (key, note) => {
  if (!keysPressed[key]){
    synth.triggerAttack(note); // play note!
    keysPressed[key] = true;
    const keyElement = document.querySelector(`[data-key="${key}"]`); // querySelector searches html for data-key with given value
    keyElement.classList.add("active"); // adds active to class e.g. "key white active"
  }
}

const stopNote = (key, note) => {
  if (keysPressed[key]) {
    synth.triggerRelease(note);
    keysPressed[key] = false; 
    const keyElement = document.querySelector(`[data-key="${key}"]`);
    keyElement.classList.remove("active"); 
  }
};

document.addEventListener("keydown", (e) => {
  keyToNote.forEach(([key, note]) => { // goes through each list in array. sets first element as key, second as note
    if (e.key === key) { // e.key is keyboard key pressed from "keydown".
      playNote(key, note);
    }
  });
});

document.addEventListener("keyup", (e) => {
  keyToNote.forEach(([key,note]) => {
    if (e.key === key) {
      stopNote(key,note);
    }
  });
});