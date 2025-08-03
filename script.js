// DEINE Auth0-Daten – ersetze mit deinem echten Setup!
const auth0Domain = "dev-cau83froo7jdms2y.us.auth0.com";
const auth0ClientId = "jC9DEMQsaXv4MxTR2CaG6iSC5JvmuxJs";
const roleNamespace = "https://pferdeshop/roles"; // Custom Claim Namespace

let auth0 = null;

const initAuth0 = async () => {
  auth0 = await createAuth0Client({
    domain: auth0Domain,
    client_id: auth0ClientId,
    cacheLocation: "localstorage"
  });

  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  const isAuth = await auth0.isAuthenticated();
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (isAuth) {
    const user = await auth0.getUser();
    document.getElementById("status").innerText = `✅ Eingeloggt als: ${user.email}`;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    // ROLLEN ABFRAGEN
    const token = await auth0.getIdTokenClaims();
    const roles = token[roleNamespace] || [];

    if (roles.includes("admin")) {
      document.getElementById("adminArea").style.display = "block";
    }
  } else {
    document.getElementById("status").innerText = `🔓 Nicht eingeloggt`;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }

  // Buttons verknüpfen
  loginBtn.addEventListener("click", () => auth0.loginWithRedirect({ redirect_uri: window.location.origin }));
  logoutBtn.addEventListener("click", () => auth0.logout({ returnTo: window.location.origin }));
};

initAuth0();
