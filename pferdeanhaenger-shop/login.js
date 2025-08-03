netlifyIdentity.init();

netlifyIdentity.on('login', user => {
  document.getElementById('adminContent').style.display = 'block';
});

netlifyIdentity.on('logout', () => {
  document.getElementById('adminContent').style.display = 'none';
});
