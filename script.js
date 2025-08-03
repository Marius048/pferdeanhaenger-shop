// 🔐 Auth0 Konfiguration
const auth0Domain = "dev-cau83froo7jdms2y.us.auth0.com";
const auth0ClientId = "jC9DEMQsaXv4MxTR2CaG6iSC5JvmuxJs";
const roleNamespace = "https://pferdeshop/roles"; // Custom Claim Namespace

let auth0 = null;

// ⚙️ Auth0 initialisieren
const initAuth0 = async () => {
  auth0 = await createAuth0Client({
    domain: auth0Domain,
    client_id: auth0ClientId,
    cacheLocation: "localstorage"
  });

  // ⏩ Login Redirect verarbeiten
  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/admin.html");
  }

  const isAuthenticated = await auth0.isAuthenticated();

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const statusEl = document.getElementById("status");

  // 🔐 Login- & Logout-Button
  if (loginBtn) loginBtn.addEventListener("click", () =>
    auth0.loginWithRedirect({ redirect_uri: "https://pferdeanhaenger-shop.netlify.app/admin.html" })
  );
  if (logoutBtn) logoutBtn.addEventListener("click", () =>
    auth0.logout({ returnTo: "https://pferdeanhaenger-shop.netlify.app/admin.html" })
  );

  if (isAuthenticated) {
    const user = await auth0.getUser();
    const tokenClaims = await auth0.getIdTokenClaims();
    const roles = tokenClaims[roleNamespace] || [];

    if (statusEl) {
      statusEl.innerText = `✅ Eingeloggt als: ${user.email}`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    }

    // 👑 Adminrechte prüfen
    if (roles.includes("admin") && document.getElementById("editor")) {
      document.getElementById("editor").style.display = "block";
      ladeAngeboteZurBearbeitung();
    } else if (document.getElementById("editor")) {
      document.body.innerHTML = "<p>🚫 Zugriff verweigert. Keine Adminrechte.</p>";
    }
  } else {
    if (statusEl) {
      statusEl.innerText = "🔓 Nicht eingeloggt";
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

  // 🛍️ Angebote auf index.html laden
  if (document.getElementById("angeboteliste")) {
    fetch("angebote.json")
      .then(response => response.json())
      .then(data => {
        const liste = document.getElementById("angeboteliste");
        liste.innerHTML = "";
        data.forEach(angebot => {
          const div = document.createElement("div");
          div.innerHTML = `<h3>${angebot.titel}</h3><p>${angebot.beschreibung}</p><p><strong>Preis:</strong> €${angebot.preis}</p>`;
          liste.appendChild(div);
        });
      })
      .catch(() => {
        document.getElementById("angeboteliste").innerText = "⚠️ Fehler beim Laden der Angebote.";
      });
  }
};

// 🔧 Angebote für Admin anzeigen & bearbeiten
const ladeAngeboteZurBearbeitung = async () => {
  try {
    const res = await fetch("angebote.json");
    const angebote = await res.json();
    const container = document.getElementById("angeboteBearbeiten");
    container.innerHTML = "";

    angebote.forEach(item => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.padding = "8px";
      div.style.marginBottom = "10px";
      div.innerHTML = `
        <input type="text" value="${item.titel}" placeholder="Titel" /><br/>
        <input type="text" value="${item.beschreibung}" placeholder="Beschreibung" /><br/>
        <input type="number" value="${item.preis}" placeholder="Preis" step="0.01" /><br/>
        <button onclick="löscheAngebot(${item.id})">❌ Löschen</button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    document.getElementById("angeboteBearbeiten").innerText = "⚠️ Fehler beim Laden der Admin-Angebote.";
  }
};

// ➕ Neues Angebot hinzufügen (Platzhalter)
const neuesAngebot = () => {
  alert("Hier könnte ein neues Formular eingeblendet werden, um ein Angebot zu erstellen.");
};

// ❌ Angebot löschen (Platzhalter)
const löscheAngebot = (id) => {
  alert(`Angebot mit ID ${id} soll gelöscht werden (Serverzugriff nötig).`);
};

// 🚀 Initialisieren
initAuth0();

