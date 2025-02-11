const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configurações do servidor
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let registros = []; // Array para armazenar TODOS os registros

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
        tempoDigitacao: '',
        pontuacaoFinal: 0 // Inicializa a pontuação final
    };

    // Adiciona o registro ao array
    registros.push(registro);
    res.redirect('/pages/test.html');
});

// Rota para finalizar o teste e salvar os dados no XLSX
app.post('/finalizar_teste', (req, res) => {
    const registroUsuario = JSON.parse(req.body.registroUsuario);

    // Validação dos dados
    if (!registroUsuario || !registroUsuario.name || !registroUsuario.date || !registroUsuario.teacher || !registroUsuario.sector) {
        console.error('Dados inválidos recebidos:', registroUsuario);
        return res.status(400).send('Dados inválidos.');
    }

    registroUsuario.porcentagemAcertos = parseFloat(req.body.porcentagemAcertos) || 0;
    registroUsuario.tempoDigitacao = req.body.tempoDigitacao || '0';
    registroUsuario.pontuacaoFinal = parseFloat(req.body.pontuacaoFinal) || 0;
    registroUsuario.ctrlC = registroUsuario.ctrlC === 'true' ? true : false;
    registroUsuario.ctrlV = registroUsuario.ctrlV === 'true' ? true : false;
    registroUsuario.altTab = registroUsuario.altTab === 'true' ? true : false;

    // Verifique os dados recebidos
    console.log('Dados recebidos:', registroUsuario);

    // Adiciona o registro ao array (sem limpar o array)
    registros.push(registroUsuario);

    // Cria um arquivo XLSX
    const headers = ['name', 'date', 'teacher', 'sector', 'ctrlC', 'ctrlV', 'altTab', 'porcentagemAcertos', 'tempoDigitacao', 'pontuacaoFinal'];
    const ws = xlsx.utils.json_to_sheet(registros, { headers });
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

// Rotas para servir as páginas
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

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});