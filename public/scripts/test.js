document.addEventListener('keydown', function (event) {
    // Verifica se o registroUsuario existe no localStorage
    let registroUsuario = JSON.parse(localStorage.getItem('registroUsuario'));
    if (!registroUsuario) {
        console.error('Registro não encontrado no localStorage.');
        return;
    }

    if (event.ctrlKey && event.key === 'c') {
        registroUsuario.ctrlC = true;
    }

    if (event.ctrlKey && event.key === 'v') {
        registroUsuario.ctrlV = true;
    }

    localStorage.setItem('registroUsuario', JSON.stringify(registroUsuario));
    console.log(registroUsuario);
});

window.addEventListener('blur', function () {
    // Verifica se o registroUsuario existe no localStorage
    let registroUsuario = JSON.parse(localStorage.getItem('registroUsuario'));
    if (!registroUsuario) {
        console.error('Registro não encontrado no localStorage.');
        return;
    }

    registroUsuario.altTab = true;
    localStorage.setItem('registroUsuario', JSON.stringify(registroUsuario));
    console.log(registroUsuario);
});

function enviar() {
    alert('Teste realizado e agora vamos para a etapa final.');
    window.location.href = '/pages/typing-test.html';
}