const audioContext = new AudioContext()

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false },
  { note: "Db", key: "S", frequency: 277.183, active: false },
  { note: "D", key: "X", frequency: 293.665, active: false },
  { note: "Eb", key: "D", frequency: 311.127, active: false },
  { note: "E", key: "C", frequency: 329.628, active: false },
  { note: "F", key: "V", frequency: 349.228, active: false },
  { note: "Gb", key: "G", frequency: 369.994, active: false },
  { note: "G", key: "B", frequency: 391.995, active: false },
  { note: "Ab", key: "H", frequency: 415.305, active: false },
  { note: "A", key: "N", frequency: 440, active: false },
  { note: "Bb", key: "J", frequency: 466.164, active: false },
  { note: "B", key: "M", frequency: 493.883, active: false },
]

document.addEventListener("keydown", (e) => {
  if (e.repeat) return
  let keyPressed = e.code
  let nodesDetail = getNodeDetails(keyPressed)

  if (nodesDetail == null) return
  nodesDetail.active = true

  playNode()
})

document.addEventListener("keyup", (e) => {
  let keyPressed = e.code
  let nodesDetail = getNodeDetails(keyPressed)
  if (nodesDetail == null) return
  nodesDetail.active = false
  playNode() //we run this function here to remove the class, we added on pressing keydown
})

function getNodeDetails(keyboardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey)
}
function playNode() {
  NOTE_DETAILS.forEach((n) => {
    let noteDiv = document.querySelector(`[data-note=${n.note}]`)
    noteDiv.classList.toggle("active", n.active) //if n.active become true then only set the class active --> this is what toggle does
    if (n.oscillator != null) {
      n.oscillator.stop()
      n.oscillator.disconnect()
    }
  })

  const activeNode = NOTE_DETAILS.filter((n) => n.active)
  const gainValue = 1 / activeNode.length
  activeNode.forEach((n) => {
    startNode(n, gainValue)
  })
}
//From here we are going to introduce some function that doesn't mean anything
//Check your understanding of everything we learn uptill here
function startNode(activeNoteDetail, gain) {
  const gainNode = audioContext.createGain()
  gainNode.gain.value = gain

  const oscillator = audioContext.createOscillator()
  oscillator.frequency.value = activeNoteDetail.frequency
  oscillator.type = "sine"
  oscillator.connect(gainNode).connect(audioContext.destination)
  oscillator.start()
  activeNoteDetail.oscillator = oscillator
}
