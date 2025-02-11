function enviarContinuar() {
  const form = document.getElementById('register');
  const formData = new FormData(form);

  fetch('/enviar_dados', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (response.redirected) {
          window.location.href = "/pages/test.html";
      }
  })
  .catch(error => console.error('Erro:', error));
}