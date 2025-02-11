document.addEventListener('keydown', function (event) {
    const registroUsuario = JSON.parse(localStorage.getItem('registroUsuario'));

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
    const registroUsuario = JSON.parse(localStorage.getItem('registroUsuario'));
    registroUsuario.altTab = true;
    localStorage.setItem('registroUsuario', JSON.stringify(registroUsuario));
    console.log(registroUsuario);
});

function enviar() {
    
    alert('Teste realizado e agora vamos para a etapa final.');

    window.location.href = '/pages/typing-test.html';

}