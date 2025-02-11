const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configurações do servidor
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para receber JSON no POST
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos da pasta "public"

let registros = []; // Array para armazenar os registros

// Rota para receber dados do formulário de registro
app.post('/enviar_dados', (req, res) => {
    const registro = {
        name: req.body.name,
        date: req.body.date,
        teacher: req.body.teacher,
        sector: req.body.sector,
        ctrlC: false,
        ctrlV: false,
        altTab: false,
        porcentagemAcertos: 0,
        tempoDigitacao: ''
    };

    registros.push(registro); // Adiciona o registro ao array
    res.redirect('/pages/test.html'); // Redireciona para a página de teste
});

// Rota para finalizar o teste e salvar os dados no XLSX
app.post('/finalizar_teste', (req, res) => {
    const registroUsuario = JSON.parse(req.body.registroUsuario);
    registroUsuario.porcentagemAcertos = parseFloat(req.body.porcentagemAcertos);
    registroUsuario.tempoDigitacao = req.body.tempoDigitacao;

    registros.push(registroUsuario); // Adiciona o registro finalizado ao array

    // Cria um arquivo XLSX
    const ws = xlsx.utils.json_to_sheet(registros);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Registros');

    // Caminho onde o arquivo será salvo
    const relatoriosDir = path.join(__dirname, 'public', 'relatorios');
    const filePath = path.join(relatoriosDir, 'registros.xlsx');

    // Verifica se a pasta "relatorios" existe, se não, cria
    if (!fs.existsSync(relatoriosDir)) {
        fs.mkdirSync(relatoriosDir, { recursive: true });
    }

    // Salva o arquivo XLSX
    xlsx.writeFile(wb, filePath);

    res.send('Teste finalizado e dados salvos com sucesso!');
});

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para servir a página de registro
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Rota para servir a página de teste
app.get('/pages/test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'test.html'));
});

// Rota para servir a página de teste de digitação
app.get('/pages/typing-test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'typing-test.html'));
});

// Rota para servir arquivos estáticos (CSS, JS, imagens)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});