document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('text');
    const inputElement = document.getElementById('input');
    const resultElement = document.getElementById('result');
    let startTime;

    // Bloquear copiar, colar e cortar no <textarea>
    inputElement.addEventListener('copy', (e) => e.preventDefault());
    inputElement.addEventListener('paste', (e) => e.preventDefault());
    inputElement.addEventListener('cut', (e) => e.preventDefault());

    inputElement.addEventListener('focus', () => {
        startTime = new Date();
    });

    window.checkTyping = () => {
        // Verifica se o registroUsuario existe no localStorage
        let registroUsuario = JSON.parse(localStorage.getItem('registroUsuario'));
        if (!registroUsuario) {
            alert('Registro não encontrado. Redirecionando para a página de registro.');
            window.location.href = '/register.html';
            return;
        }

        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        const originalText = textElement.innerText;
        const userInput = inputElement.value;

        if (userInput.trim() === '') {
            alert('Por favor, digite o texto antes de verificar a pontuação.');
            return;
        }

        const { errors, incorrectCharacters } = calculateErrors(originalText, userInput);
        const accuracy = calculateAccuracy(originalText, userInput, errors);

        let timeScore = 0;
        if (timeTaken < 40) {
            timeScore = 100;
        } else if (timeTaken < 45) {
            timeScore = 80;
        } else if (timeTaken < 60) {
            timeScore = 60;
        } else if (timeTaken < 75) {
            timeScore = 40;
        } else {
            timeScore = 20;
        }

        const weightAccuracy = 0.6;
        const weightTime = 0.3;
        const weightErrors = 0.1;

        let finalScore;
        if (accuracy === 0) {
            finalScore = 0;
        } else {
            finalScore = (accuracy * weightAccuracy) + (timeScore * weightTime) - (errors * weightErrors);
            finalScore = Math.max(0, Math.min(100, finalScore));
        }

        resultElement.innerHTML = `
            <p>Tempo de digitação: ${timeTaken.toFixed(2)} segundos</p>
            <p>Quantidade de caracteres incorretos: ${incorrectCharacters}</p>
            <p>Precisão: ${accuracy.toFixed(2)}%</p>
            <p>Pontuação: ${finalScore.toFixed(2)}</p> 
        `;

        // Atualiza os dados do registro com os resultados do teste de digitação
        registroUsuario.porcentagemAcertos = accuracy;
        registroUsuario.tempoDigitacao = timeTaken.toFixed(2);
        registroUsuario.pontuacaoFinal = finalScore.toFixed(2); // Adiciona a pontuação final

        // Verifique os dados antes de enviar
        console.log('Dados enviados:', registroUsuario);

        // Envia os dados atualizados para o servidor
        fetch('/finalizar_teste', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                registroUsuario: JSON.stringify(registroUsuario),
                porcentagemAcertos: accuracy,
                tempoDigitacao: timeTaken.toFixed(2),
                pontuacaoFinal: finalScore.toFixed(2) // Envia a pontuação final
            })
        })
        .then(response => response.text())
        .then(data => {
            alert('Teste finalizado e dados salvos com sucesso!');
            window.location.href = '/'; // Redireciona para a página inicial
        })
        .catch(error => console.error('Erro:', error));
    };

    function calculateErrors(original, input) {
        let errorCount = 0;
        let incorrectCharacters = 0;

        for (let i = 0; i < Math.max(original.length, input.length); i++) {
            if (original[i] !== input[i]) {
                errorCount++;
                if (input[i] !== undefined) {
                    incorrectCharacters++;
                }
            }
        }

        return { errors: errorCount, incorrectCharacters };
    }

    function calculateAccuracy(originalText, userInput, errors) {
        if (userInput.length === 0) {
            return 0;
        }

        const totalCharacters = originalText.length;
        const correctCharacters = totalCharacters - errors;

        return (correctCharacters / totalCharacters) * 100;
    }
});