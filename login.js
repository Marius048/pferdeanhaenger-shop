netlifyIdentity.init();

netlifyIdentity.on('login', user => {
  document.getElementById('adminContent').style.display = 'block';
});

netlifyIdentity.on('logout', () => {
  document.getElementById('adminContent').style.display = 'none';
});

const urlParams = new URLSearchParams(window.location.search);
const inviteToken = urlParams.get("token");

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
