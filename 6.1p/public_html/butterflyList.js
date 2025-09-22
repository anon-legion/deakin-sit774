const butterflyArray = [
  "Swallowtail",
  "Dingy Skipper",
  "Grizzled Skipper",
  "Chequered Skipper",
  "Essex Skipper",
  "Small Skipper",
  "Lulworth Skipper",
  "Silver-spotted Skipper",
  "Large Skipper",
  "Wood White",
  "Orange-tip",
  "Black-veined White",
  "Large White",
  "Small White",
  "Green-veined White",
  "Clouded Yellow",
  "Brimstone",
  "Wall",
  "Speckled Wood",
  "Large Heath"
];

function sum() {
  try {
    const x = parseInt(prompt("Input first number to add:"), 10);
    const y = parseInt(prompt("Input second number to add:"), 10);
    if (isNaN(x) || isNaN(y)) {
      throw new Error("Invalid input");
    }

    const sum = x + y;
    window.alert(`${x} + ${y} = ${sum}`);
  } catch (e) {
    window.alert(e.message);
  }
}

function quotient() {
  try {
    const dividend = parseInt(prompt("Input dividend:"), 10);
    const divisor = parseInt(prompt("Input divisor:"), 10);

    if (isNaN(dividend) || isNaN(divisor)) {
      throw new Error("Invalid input");
    }

    if (divisor === 0) {
      throw new Error("Division by zero is not allowed");
    }

    const quotient = dividend / divisor;
    window.alert(`${dividend} / ${divisor} = ${quotient}`);
  } catch (e) {
    window.alert(e.message);
  }
}


function buildButterflyList() {
  const name = prompt('What is your name?');
  const intro = document.querySelector('#intro');

  if (intro && name) {
    intro.innerText = `${name}`;
  }

  const userCount = prompt('How many butterflies do you want to see?');
  const butterflyList = document.querySelector('#butterflyList');
  const butterflyCount = document.querySelector('#butterflyCount');

  while (butterflyList.firstChild) {
    butterflyList.removeChild(butterflyList.firstChild);
  }

  const orderedList = document.createElement("ol");

  if (!userCount || isNaN(Number(userCount)) || userCount <= 0) {
    alert("Please enter a valid number greater than 0.");
    return;
  }

  butterflyArray.slice(0, Math.min(Number(userCount), 20)).forEach((butterfly) => {
    const listItem = document.createElement("li");
    listItem.innerText = butterfly;
    orderedList.appendChild(listItem);
  })

  butterflyList.appendChild(orderedList);
  butterflyCount.innerText = userCount;
}