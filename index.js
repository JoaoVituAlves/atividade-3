import express from 'express';
import cookieParser from 'cookie-parser';
import sessao from 'express-session';

const porta = 4000;

const listaProdutos = []; 

const app = express(); 
app.use(cookieParser());

app.use(sessao({
    secret:"m1Nh4Ch4v3",
    saveUninitialized:false,
    resave:false,
    cookie: { maxAge: 600000 }
}));

function processarRequisicao(req,resp){
    resp.write("<p>Você acessou a raiz da aplicação!</p>");
    resp.end();
}

function login(req, resp){
    
    const nome = req.query.nome;
    const sobrenome = req.query.sobrenome;
    req.session.nome = nome;
    req.session.sobrenome = sobrenome; 

    resp.setHeader('Content-Type', 'text/html');
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<meta charset="UTF-8"/>');
    resp.write('<title>Login realizado com sucesso!</title>');
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<p>Login realizado com sucesso!</p>');
    resp.write('</body>');
    resp.write("</html>");
    resp.end();
}

function processarBoasVindas(req,resp){
   
    const nome = req.query.nome;
    const sobrenome = req.query.sobrenome;

    
    if (!req.cookies.usuario){
        resp.cookie('usuario', nome + " " + sobrenome, { maxAge: Date.now() + 900000, httpOnly:true });
    }
    const dataAtual = new Date(Date.now());
    resp.cookie('ultimoAcesso', dataAtual.getDate() + "/" + dataAtual.getMonth() + "/" + dataAtual.getFullYear() + " " + dataAtual.getHours() + ":" + dataAtual.getMinutes(), { maxAge: Date.now() + 900000, httpOnly:true });
    
    resp.setHeader('Content-Type', 'text/html');
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<meta charset="UTF-8"/>');
    resp.write('<title>Resposta produzida pelo servidor</title>');
    resp.write('</head>');
    resp.write('<tbody>');
    resp.write('<p>Olá! Obrigado por acessar o seu servidor!</p>');
    if (nome && sobrenome) {
        resp.write("<p>Seja bem-vindo <strong>" + nome + " " + sobrenome + "</strong></p>");
        if (req.cookies.ultimoAcesso)
        resp.write("Seu último acesso foi em " + req.cookies.ultimoAcesso);
    }
    resp.write("</tbody>");
    resp.write("</html>")
    resp.end();
}

function processaCadastroProduto(req,resp){
    
    const pBarras = req.query.iBarra;
    const pProduto = req.query.nome;
    const pCusto = req.query.pCusto;
    const pVenda= req.query.pVenda;
    const pValidade= req.query.val;
    const pEstoque= req.query.Estoque;
    const pFabricante= req.query.fab;

    const produtos = 
    {
        barras: pBarras,     
        produto:pProduto, 
        custo:pCusto, 
        venda:pVenda, 
        validade:pValidade,
        estoque:pEstoque,
        fabricante:pFabricante


    };

    resp.setHeader('Content-Type', 'text/html');
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<meta charset="UTF-8"/>');
    resp.write('<title>Cadastrado com sucesso!</title>');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>'); // mexer aqui
    resp.write('<p>O produto ' + produtos.produto+ ' foi cadastro com sucesso!</p>');
    if (req.cookies.usuario){
        resp.write("Registro gerado pelo usuário:" + req.cookies.usuario);
    }
    if (req.session.nome){
        resp.write("<p>Usuário logado: " + req.session.nome + " " + req.session.sobrenome+"</p>");
    }
    listaProdutos.push(produtos);
    desenharTabelaProdutos(resp);
    resp.write('<a href="/cadastro.html">Continuar cadastrando...</a>');
 
    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>');
    resp.write('</html>');
    resp.end();
}

function desenharTabelaProdutos(resp){
    resp.write('<table class="table table-striped table-hover">');
    resp.write('<thead>');
    resp.write('<tr>');
    resp.write('<th>CODIGO BARRAS</th>');
    resp.write('<th>PRODUTO</th>');
    resp.write('<th>PREÇO CUSTO</th>');
    resp.write('<th>PREÇO VENDA</th>');
    resp.write('<th>VALIDADE</th>');
    resp.write('<th>ESTOQUE</th>');
    resp.write('<th>FABRICANTE</th>');
    resp.write('</thead>');
    resp.write('<tbody>');
    
    for (let i=0; i < listaProdutos.length; i++)
    {
        resp.write('<tr>');
        resp.write('<td>' + listaProdutos[i].barras + "</td>");
        resp.write('<td>' + listaProdutos[i].produto+ "</td>");
        resp.write('<td>' + listaProdutos[i].custo+ "</td>");
        resp.write('<td>' + listaProdutos[i].venda+ "</td>");
        resp.write('<td>' + listaProdutos[i].validade+ "</td>");
        resp.write('<td>' + listaProdutos[i].estoque+ "</td>");
        resp.write('<td>' + listaProdutos[i].fabricante+ "</td>");
        resp.write('</tr>');
    }
    resp.write('</tbody>');
    resp.write('</table>');
}
app.get("/", processarRequisicao);
app.get("/boasvindas", processarBoasVindas);
app.get("/cadastrarProduto",processaCadastroProduto);
app.get("/login",login);
app.use(express.static('./paginas'));
app.listen(porta, 'localhost', ()=> {
    console.log('Servidor escutando em http://localhost:4000/');
});