let angebote = [];

function anzeigenAdmin() {
  const container = document.getElementById('adminListe');
  container.innerHTML = '';
  angebote.forEach((item, index) => {
    container.innerHTML += `
      <div>
        <img src="${item.bild}" width="120"><br>
        <b>${item.titel}</b> – ${item.preis}<br>
        <button onclick="bearbeiten(${index})">Bearbeiten</button>
        <button onclick="löschen(${index})">Löschen</button>
      </div><hr>
    `;
  });
}

function bearbeiten(index) {
  const item = angebote[index];
  document.getElementById('titel').value = item.titel;
  document.getElementById('preis').value = item.preis;
  document.getElementById('bild').value = item.bild;
  löschen(index);
}

function löschen(index) {
  angebote.splice(index, 1);
  anzeigenAdmin();
}

document.getElementById('neuForm').addEventListener('submit', function (e) {
  e.preventDefault();
  angebote.push({
    titel: titel.value,
    preis: preis.value,
    bild: bild.value
  });
  anzeigenAdmin();
  titel.value = preis.value = bild.value = '';
});

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    angebote = data;
    anzeigenAdmin();
  });
