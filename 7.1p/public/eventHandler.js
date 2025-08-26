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
