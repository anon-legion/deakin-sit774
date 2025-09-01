const enterButton = document.getElementById('enterBtn');
const output = document.getElementById('output');
const sortRadios = document.getElementsByName('sortRadio');
const entries = [];
const parseOutput = (dto) => `${dto.name}, ${dto.id}, ${dto.date}`
// date helper function
const isDateOk = (date) => {
  const now = new Date();
  const parsedDate = Date.parse(date);

  return parsedDate <= now;
}
// id helper function
const isIdAlreadyExists = (id) => entries.some(entry => entry.id === id);
const Sort = {
  Id: 'id',
  Date: 'date'
};
let sortBy = Sort.Id;

enterButton.addEventListener("click", function () {
  const name = document.getElementById("itemName").value.trim();
  const id = parseInt(document.getElementById("itemId").value.trim());
  const date = document.getElementById("itemDate").value;

  // id guard clause
  if (isIdAlreadyExists(id)) {
    alert("ID already exists. Please enter a unique ID.");

    return;
  }

  // date guard clause
  if (!isDateOk(date)) {
    alert("Futures dates are not allowed.");

    return;
  }

  // create a data transfer object
  const dto = {
    name: name,
    id: id,
    date: date
  }

  // add the dto to the entries array
  entries.push(dto);

  printEntries();
});

// add event listeners to the radio buttons
sortRadios.forEach(radio => {
  radio.addEventListener('change', function (e) {
    if (radio.checked) {
      sortBy = radio.value;
    }

    printEntries();
  });
});

function sortById() {
  entries.sort((a, b) => a.id - b.id);
  output.innerHTML = entries.map(entry => parseOutput(entry)).join('<br>');
}

function sortByDate() {
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  output.innerHTML = entries.map(entry => parseOutput(entry)).join('<br>');
}

function printEntries() {
  if (sortBy === Sort.Id) {
    sortById();
  }

  if (sortBy === Sort.Date) {
    sortByDate();
  }
}