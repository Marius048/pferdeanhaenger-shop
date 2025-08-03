// Netlify Identity initialisieren
netlifyIdentity.init();

// Login-Button aktivieren
document.getElementById("netlifyLogin").addEventListener("click", () => {
  netlifyIdentity.open();
});

// Sichtbarkeit nach Login steuern
netlifyIdentity.on("login", user => {
  console.log("Eingeloggt als:", user.email);
  document.getElementById("adminContent").style.display = "block";
});

netlifyIdentity.on("logout", () => {
  document.getElementById("adminContent").style.display = "none";
});

// Invite-Token aus URL-Hash auslesen
const url = new URL(window.location.href);
const hashParams = new URLSearchParams(url.hash.slice(1));
const inviteToken = hashParams.get("invite_token");

if (inviteToken) {
  // Passwort abfragen
  const password = prompt("🎫 Du wurdest eingeladen – bitte Passwort setzen:");
  netlifyIdentity.acceptInvite(inviteToken, password)
    .then(user => {
      console.log("✅ Einladung akzeptiert!", user);
      document.getElementById("adminContent").style.display = "block";
    })
    .catch(error => {
      alert("❌ Fehler beim Setzen des Passworts");
      console.error(error);
    });
}

