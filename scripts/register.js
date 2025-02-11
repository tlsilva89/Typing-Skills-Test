function enviarContinuar() {
  const form = document.getElementById('register');

  const formData = {
      name: form.name.value,
      date: form.date.value,
      teacher: form.teacher.value,
      sector: form.sector.value,
      ctrlC: false,
      ctrlV: false,
      altTab: false,
      porcentagemAcertos: 0,
      tempoDigitacao: ''
  };

  localStorage.setItem('registroUsuario', JSON.stringify(formData));

  alert('Registro realizado com sucesso!');

  window.location.href = '/pages/test.html';
}