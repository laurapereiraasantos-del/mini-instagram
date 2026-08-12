const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 3000;

// Chave usada para proteger o login.
// Quando colocarmos o projeto online, vamos trocar por uma chave secreta.
const JWT_SECRET = "minha-chave-secreta-do-mini-instagram";


// Permite que o servidor receba JSON
app.use(express.json());


// ===============================
// BANCO DE DADOS TEMPORÁRIO
// ===============================
//
// Por enquanto vamos usar memória
// para testar o servidor.
//
// Depois vamos trocar isso pelo
// PostgreSQL de verdade.
//

const usuarios = [];

const posts = [];


// ===============================
// PÁGINA PRINCIPAL
// ===============================

app.get("/", function (req, res) {

    res.send(`
        <h1>Mini Instagram</h1>

        <p>Servidor funcionando!</p>

        <p>
            Seu backend está funcionando
            corretamente.
        </p>
    `);

});


// ===============================
// TESTE DO SERVIDOR
// ===============================

app.get("/api", function (req, res) {

    res.json({
        mensagem: "API do Mini Instagram funcionando!"
    });

});


// ===============================
// CADASTRO
// ===============================

app.post("/api/cadastro", async function (req, res) {

    try {

        const {
            nome,
            usuario,
            senha
        } = req.body;


        // Verificar se todos os campos
        // foram preenchidos

        if (!nome || !usuario || !senha) {

            return res.status(400).json({

                erro: "Preencha todos os campos."

            });

        }


        // Verificar se o usuário
        // já existe

        const usuarioExiste = usuarios.find(
            function (u) {

                return u.usuario === usuario;

            }
        );


        if (usuarioExiste) {

            return res.status(400).json({

                erro: "Esse usuário já existe."

            });

        }


        // Transformar a senha em um
        // código protegido

        const senhaProtegida =
            await bcrypt.hash(senha, 10);


        // Criar usuário

        const novoUsuario = {

            id: usuarios.length + 1,

            nome: nome,

            usuario: usuario,

            senha: senhaProtegida

        };


        usuarios.push(novoUsuario);


        res.status(201).json({

            mensagem: "Conta criada com sucesso!",

            usuario: {

                id: novoUsuario.id,

                nome: novoUsuario.nome,

                usuario: novoUsuario.usuario

            }

        });


    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: "Erro ao criar conta."

        });

    }

});


// ===============================
// LOGIN
// ===============================

app.post("/api/login", async function (req, res) {

    try {

        const {
            usuario,
            senha
        } = req.body;


        // Procurar usuário

        const usuarioEncontrado =
            usuarios.find(
                function (u) {

                    return u.usuario === usuario;

                }
            );


        if (!usuarioEncontrado) {

            return res.status(401).json({

                erro: "Usuário ou senha incorretos."

            });

        }


        // Comparar senha

        const senhaCorreta =
            await bcrypt.compare(
                senha,
                usuarioEncontrado.senha
            );


        if (!senhaCorreta) {

            return res.status(401).json({

                erro: "Usuário ou senha incorretos."

            });

        }


        // Criar token de login

        const token = jwt.sign(

            {
                id: usuarioEncontrado.id,

                usuario: usuarioEncontrado.usuario
            },

            JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        res.json({

            mensagem: "Login realizado!",

            token: token,

            usuario: {

                id: usuarioEncontrado.id,

                nome: usuarioEncontrado.nome,

                usuario: usuarioEncontrado.usuario

            }

        });


    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: "Erro ao realizar login."

        });

    }

});


// ===============================
// VERIFICAR LOGIN
// ===============================

function verificarLogin(req, res, next) {

    const cabecalho =
        req.headers.authorization;


    if (!cabecalho) {

        return res.status(401).json({

            erro: "Você precisa estar logado."

        });

    }


    const partes =
        cabecalho.split(" ");


    const token = partes[1];


    try {

        const usuario =
            jwt.verify(
                token,
                JWT_SECRET
            );


        req.usuario = usuario;


        next();


    } catch (erro) {

        return res.status(401).json({

            erro: "Token inválido."

        });

    }

}


// ===============================
// VER USUÁRIO LOGADO
// ===============================

app.get(
    "/api/me",

    verificarLogin,

    function (req, res) {

        const usuario =
            usuarios.find(
                function (u) {

                    return u.id === req.usuario.id;

                }
            );


        if (!usuario) {

            return res.status(404).json({

                erro: "Usuário não encontrado."

            });

        }


        res.json({

            id: usuario.id,

            nome: usuario.nome,

            usuario: usuario.usuario

        });

    }

);


// ===============================
// CRIAR POST
// ===============================

app.post(
    "/api/posts",

    verificarLogin,

    function (req, res) {

        const {

            imagem,

            legenda

        } = req.body;


        if (!imagem) {

            return res.status(400).json({

                erro: "É necessário enviar uma imagem."

            });

        }


        const novoPost = {

            id: posts.length + 1,

            usuarioId: req.usuario.id,

            imagem: imagem,

            legenda: legenda || "",

            curtidas: 0,

            comentarios: [],

            data: new Date()

        };


        posts.push(novoPost);


        res.status(201).json({

            mensagem: "Post criado!",

            post: novoPost

        });

    }

);


// ===============================
// VER POSTS
// ===============================

app.get(
    "/api/posts",

    function (req, res) {

        res.json(posts);

    }

);


// ===============================
// CURTIR POST
// ===============================

app.post(
    "/api/posts/:id/curtir",

    verificarLogin,

    function (req, res) {

        const id =
            Number(req.params.id);


        const post =
            posts.find(
                function (p) {

                    return p.id === id;

                }
            );


        if (!post) {

            return res.status(404).json({

                erro: "Post não encontrado."

            });

        }


        post.curtidas++;


        res.json({

            mensagem: "Post curtido!",

            curtidas: post.curtidas

        });

    }

);


// ===============================
// SERVIDOR
// ===============================

app.listen(
    PORT,
   "0.0.0.0",

    function () {

        console.log(
            `Servidor funcionando na porta ${PORT}`
        );

    }
);