let counts = {};
let rows = document.getElementsByClassName('row');

function $(id) {
  return document.getElementById(id);
}

function createCard(city) {
  var e = document.querySelector('#template .card').cloneNode(true);
  e.setAttribute('city', city);
  var name = e.querySelector('.name');
  name.textContent = city;
  e.addEventListener('click', moveCard);
  insertCard(e, rows[rows.length - 1]);
}

function createCards(desc) {
  for (var city in desc) {
    for (var i = 0; i < counts[city]; i++) {
      createCard(city);
    }
  }
  addRow();
}

function getRow(card) {
  for (var i = 0; i < rows.length; i++) {
    if (card.parentNode == rows[i])
      return i;
  }
}

function addRow() {
  var newRow = document.createElement('div');
  newRow.className = 'row';
  rows[0].parentNode.insertBefore(newRow, rows[0]);
  return newRow;
}

function insertCard(card, row) {
  var name = card.textContent;
  var elems = row.querySelectorAll('.card');
  if (elems.length == 0) {
    row.appendChild(card);
    return;
  }
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].textContent >= name) {
      row.insertBefore(card, elems[i]);
      return;
    }
  }
  row.appendChild(card);
}

function moveCard(evt) {
  let card = evt.target;
  while (card && !card.classList.contains('card'))
    card = card.parentNode;
  var rowNum = getRow(card);
  var prevRow = rows[rowNum];
  let newRow = rowNum == 0 ? addRow() : rows[0];
  insertCard(card, newRow);
  if (prevRow.querySelectorAll('.card').length == 0)
    prevRow.parentNode.removeChild(prevRow);
}

let cards;
let epidemicCards;
let pileSize;
let curPile;
let prevPile = 0;
let infectionRate = [2, 2, 2, 3, 3, 4, 4, 5];
let epidemics = 0;
let rate = infectionRate[epidemics];
let extra;

function updateStats() {
  let chance = 0;
  if (prevPile == 1)
    chance = 1 / curPile;
  else if (prevPile == 0)
    chance = curPile > 0 ? Math.min(1, (2 / curPile)) : 0;
  var text = Math.round(chance * 100) + '% (' + prevPile + ', ' + curPile + ')';
  document.querySelector('#epidemic .stats').textContent = text;
}

function drawCard() {
  if (prevPile > 0)
    prevPile -= 1;
  else
    curPile -= 1;
}

function drawCards() {
  drawCard();
  drawCard();
  updateStats();
}

function nextPile() {
  if (epidemics >= extra)
    return pileSize - 1;
  return pileSize;
}

function epidemic() {
  epidemicCards -= 1;
  epidemics++;
  rate = infectionRate[Math.min(infectionRate.length - 1, epidemics)];
  if (curPile > 0) {
    prevPile += curPile;
    curPile = 0;
  }
  curPile += nextPile();
  updateStats();
}

function initialize() {
  counts = {};
  let infectionLines = $('infectioncards').value.split('\n');
  for (var i = 0; i < infectionLines.length; i++) {
    let desc = infectionLines[i].split(',');
    if (desc.length != 2) continue;
    counts[desc[0]] = parseInt(desc[1]);
  }
  createCards(counts);
  cards = parseInt($('playerdeck').value);
  epidemicCards = parseInt($('epidemics').value);
  pileSize = Math.ceil(cards / epidemicCards);
  extra = epidemicCards - (pileSize * epidemicCards - cards);
  curPile = pileSize;
  let epElem = document.getElementById('epidemic');
  epElem.querySelector('.draw').addEventListener('click', drawCards);
  epElem.querySelector('.epidemic').addEventListener('click', epidemic);
  $('setup').style.display = 'none';
  updateStats();
}

document.addEventListener('DOMContentLoaded', function() {
  $('play').addEventListener('click', initialize);
});