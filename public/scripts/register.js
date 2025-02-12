function enviarContinuar() {
    const form = document.getElementById('register');
    const formData = new FormData(form);

    // Cria um objeto com os dados do formulário
    const registroUsuario = {
        name: formData.get('name'),
        date: formData.get('date'),
        teacher: formData.get('teacher'),
        sector: formData.get('sector'),
        ctrlC: false,
        ctrlV: false,
        altTab: false,
        porcentagemAcertos: 0,
        tempoDigitacao: ''
    };

    // Salva o objeto no localStorage
    localStorage.setItem('registroUsuario', JSON.stringify(registroUsuario));

    // Envia os dados para o servidor
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