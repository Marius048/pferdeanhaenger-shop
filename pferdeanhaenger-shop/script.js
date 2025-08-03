fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('liste');
    data.forEach(item => {
      container.innerHTML += `
        <div>
          <h2>${item.titel}</h2>
          <p>${item.preis}</p>
          <img src="${item.bild}" alt="${item.titel}" width="300">
        </div><hr>
      `;
    });
  });
