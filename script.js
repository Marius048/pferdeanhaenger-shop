netlifyIdentity.on('init', user => {
  if (!user) {
    document.getElementById("header").innerText = "🔓 Bitte einloggen!";
  } else {
    const roles = user.app_metadata?.roles || [];
    if (roles.includes("admin")) {
      document.getElementById("header").innerText = "👑 Willkommen Admin!";
    } else {
      document.getElementById("header").innerText = "👋 Hallo Nutzer!";
    }
  }
});

netlifyIdentity.init();

