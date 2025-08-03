// Invite-Token früh auslesen, bevor etwas es löscht
let inviteToken = null;

// 1️⃣ Direkt aus Hash holen
const rawHash = window.location.hash;
if (rawHash.includes("invite_token=")) {
  const hashParams = new URLSearchParams(rawHash.slice(1));
  inviteToken = hashParams.get("invite_token");

  // Fallback im localStorage speichern
  localStorage.setItem("invite_token_backup", rawHash);
}

// 2️⃣ Backup nutzen, falls Hash gelöscht wurde
if (!inviteToken) {
  const savedHash = localStorage.getItem("invite_token_backup");
  if (savedHash) {
    const hashParams = new URLSearchParams(savedHash.slice(1));
    inviteToken = hashParams.get("invite_token");
  }
}

// 3️⃣ Jetzt Identity initialisieren
netlifyIdentity.init();

// Login-Button klickbar machen
document.getElementById("netlifyLogin").addEventListener("click", () => {
  netlifyIdentity.open();
});

// Login-Event abfangen
netlifyIdentity.on("login", user => {
  console.log("✅ Eingeloggt als:", user.email);
  document.getElementById("adminContent").style.display = "block";
});

netlifyIdentity.on("logout", () => {
  document.getElementById("adminContent").style.display = "none";
});

// 4️⃣ Wenn Invite-Token da ist, Passwort abfragen
if (inviteToken) {
  const password = prompt("🎫 Du wurdest eingeladen – bitte Passwort setzen:");
  netlifyIdentity.acceptInvite(inviteToken, password)
    .then(user => {
      console.log("✅ Einladung akzeptiert!", user);
      document.getElementById("adminContent").style.display = "block";
    })
    .catch(error => {
      alert("❌ Fehler beim Einloggen");
      console.error("Invite-Fehler:", error);
    });
}



