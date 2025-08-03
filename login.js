netlifyIdentity.init();

netlifyIdentity.on('login', user => {
  document.getElementById('adminContent').style.display = 'block';
});

netlifyIdentity.on('logout', () => {
  document.getElementById('adminContent').style.display = 'none';
});

// Korrigierter Teil zum Invite-Token
const url = new URL(window.location.href);
const hashParams = new URLSearchParams(url.hash.slice(1));
const inviteToken = hashParams.get("invite_token");

if (inviteToken) {
  const password = prompt("Bitte neues Passwort setzen:");
  netlifyIdentity.acceptInvite(inviteToken, password)
    .then(user => {
      console.log("Einladung angenommen!", user);
      document.getElementById('adminContent').style.display = 'block';
    })
    .catch(error => {
      console.error("Fehler beim Setzen des Passworts:", error);
    });
}

