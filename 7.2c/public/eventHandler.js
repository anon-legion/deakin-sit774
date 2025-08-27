const inputText = document.getElementById('inputText');
const outputDiv = document.getElementById('outputDiv');
const noInputAlert = (operation) => `Input text cannot be empty.\nPlease provide text to ${operation}`;

function processText() {
  const text = inputText.value ?? '';

  if (!text) {
    outputDiv.innerHTML = '';
    alert(noInputAlert('process'));
    return;
  }

  const charCount = text.length;
  const wordCount = text.split(/\s+/).length; // split on one or more whitespace characters
  const upperCount = (text.match(/[A-Z]/g) || []).length; // match uppercase letters
  const lowerCount = (text.match(/[a-z]/g) || []).length; // match lowercase letters
  const sentenceCount = (text.match(/([.!?])(?=\s|$)/g) || []).length; // match punctuation that is followed by whitespace or end of string

  outputDiv.innerHTML = `
      <div><strong>Characters:</strong> ${charCount}</div>
      <div><strong>Words:</strong> ${wordCount}</div>
      <div><strong>Uppercase:</strong> ${upperCount}</div>
      <div><strong>Lowercase:</strong> ${lowerCount}</div>
      <div><strong>Sentences:</strong> ${sentenceCount}</div>
    `;
}

function searchText() {
  const text = inputText.value ?? '';

  if (!text) {
    outputDiv.innerHTML = '';
    alert(noInputAlert('search'));
    return;
  }

  const term = prompt('Enter search term:');

  if (!term) {
    alert('Search term cannot be empty.');
    return;
  }

  const regex = new RegExp(term, 'gi'); // match all occurrences of term case-insensitively

  let count = 0;

  const highlightedText = text.replace(regex, match => {
    count++;
    return `<mark>${match}</mark>`; // highlight the matched term
  });

  outputDiv.innerHTML = `${highlightedText}<div class="mt-2"><strong>Found ${count} times</strong></div>`;
}

function resetText() {
  inputText.value = '';
  outputDiv.innerHTML = '';
}

const captchaImages = ['226md.png', '22d5n.png', '23n88.png', '244e2.png', '245y5.png', '33f7m.png', '33p4e.png', '36w25.png', '377xx.png', '3xng6.png'];
const Action = {
  Process: 'process',
  Search: 'search'
}

let captchaAnswer = '';
let pendingAction = '';
let randomCaptchaIndex = -1;

const getCaptchaCodeFromFilename = (filename) => filename.split('.')[0]?.trim();
const rng = (max) => {
  let roll = Math.floor(Math.random() * max);

  // ensure new index is different from last one
  while (roll === randomCaptchaIndex) {
    roll = Math.floor(Math.random() * max);
  }

  return roll;
}
const cleanupCaptcha = () => {
  captchaAnswer = '';
  pendingAction = '';
  document.getElementById('captchaModalInput').value = '';
  document.getElementById('captchaModalError').textContent = '';
  document.getElementById('captchaModalImg').src = '';
}

function disableButtons(isDisabled) {
  const buttons = document.querySelectorAll('#buttonGroup button')
  buttons.forEach(btn => btn.disabled = isDisabled);
}

function generateCaptcha() {
  randomCaptchaIndex = rng(captchaImages.length);
  const imgName = captchaImages[randomCaptchaIndex]; // pick random image by random index
  captchaAnswer = getCaptchaCodeFromFilename(imgName); // extract code from filename
  document.getElementById('captchaModalImg').src = `captcha/${imgName}`; // set image src
  disableButtons(true);
}

function verifyCaptchaAndProceed() {
  const input = document.getElementById('captchaModalInput')?.value.trim() ?? '';

  // input validation guard clause
  if (input !== captchaAnswer) {
    document.getElementById('captchaModalError').textContent = 'Incorrect code. Please try again.';
    return;
  }

  // hide modal
  document.getElementById('dismissModal')?.click();

  // call pending action
  if (pendingAction === Action.Process) {
    processText();
  }

  if (pendingAction === Action.Search) {
    searchText();
  }

  cleanupCaptcha();
  disableButtons(false);
}

function processOnClick() {
  generateCaptcha()
  pendingAction = Action.Process;
}

function searchOnClick() {
  generateCaptcha();
  pendingAction = Action.Search;
}
