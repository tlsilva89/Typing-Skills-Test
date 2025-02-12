const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let registros = [];

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
        tempoDigitacao: '',
        pontuacaoFinal: 0
    };

    //registros.push(registro); Isso estava lançando um objeto vazio no array de registros
    res.redirect('/pages/test.html');
});

app.post('/finalizar_teste', (req, res) => {
    const registroUsuario = JSON.parse(req.body.registroUsuario);

    if (!registroUsuario || !registroUsuario.name || !registroUsuario.date || !registroUsuario.teacher || !registroUsuario.sector) {
        console.error('Dados inválidos recebidos:', registroUsuario);
        return res.status(400).send('Dados inválidos.');
    }

    registroUsuario.porcentagemAcertos = parseFloat(req.body.porcentagemAcertos) || 0;
    registroUsuario.tempoDigitacao = req.body.tempoDigitacao || '0';
    registroUsuario.pontuacaoFinal = parseFloat(req.body.pontuacaoFinal) || 0;
    registroUsuario.ctrlC = registroUsuario.ctrlC === true;
    registroUsuario.ctrlV = registroUsuario.ctrlV === true;
    registroUsuario.altTab = registroUsuario.altTab === true;

    console.log('Dados recebidos:', registroUsuario);

    registros.push(registroUsuario);

    const headers = ['name', 'date', 'teacher', 'sector', 'ctrlC', 'ctrlV', 'altTab', 'porcentagemAcertos', 'tempoDigitacao', 'pontuacaoFinal'];
    const ws = xlsx.utils.json_to_sheet(registros, { headers });
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Registros');

    const relatoriosDir = path.join(__dirname, 'public', 'relatorios');
    const filePath = path.join(relatoriosDir, 'registros.xlsx');

    if (!fs.existsSync(relatoriosDir)) {
        fs.mkdirSync(relatoriosDir, { recursive: true });
    }

    xlsx.writeFile(wb, filePath);

    res.send('Teste finalizado e dados salvos com sucesso!');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/pages/test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'test.html'));
});

app.get('/pages/typing-test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'typing-test.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});