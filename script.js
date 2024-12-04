const synth = new Tone.Synth().toDestination();
const keysPressed = {};

const keyNotePairs = [
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
    synth.triggerAttack(note);
    keysPressed[key] = true;
    document.querySelector(`[data-key="${key}"]`).classList.add("active");
  }
}

const stopNote = (key) => {
  synth.triggerRelease(); 
  keysPressed[key] = false; 
  document.querySelector(`[data-key="${key}"]`).classList.remove("active");
};

document.addEventListener("keydown", (e) => {
  keyNotePairs.forEach(([key, note]) => {
    if (e.key === key) {
      playNote(key, note);
    }
  });
});

document.addEventListener("keyup", (e) => {
  keyNotePairs.forEach(([key]) => {
    if (e.key === key) {
      stopNote(key);
    }
  });
});