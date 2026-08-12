// ===============================
// CURTIR POST
// ===============================

function curtir(botao) {

    const post = botao.closest(".post");

    const numeroCurtidas = post.querySelector(".likes span");

    let curtidas = Number(numeroCurtidas.textContent);

    if (botao.classList.contains("curtido")) {

        curtidas--;

        botao.innerHTML = "♡";

        botao.classList.remove("curtido");

    } else {

        curtidas++;

        botao.innerHTML = "♥";

        botao.classList.add("curtido");
    }

    numeroCurtidas.textContent = curtidas;
}


// ===============================
// ADICIONAR COMENTÁRIO
// ===============================

function adicionarComentario(botao) {

    const post = botao.closest(".post");

    const input = post.querySelector(".comment-box input");

    const texto = input.value.trim();

    if (texto === "") {

        alert("Digite um comentário!");

        return;
    }


    const comentarios = post.querySelector(".comments");


    const novoComentario = document.createElement("p");


    novoComentario.innerHTML = `
        <strong>@você</strong>
        ${texto}
    `;


    comentarios.appendChild(novoComentario);


    input.value = "";
}


// ===============================
// BOTÃO SEGUIR
// ===============================

const botoesSeguir = document.querySelectorAll(".follow");


botoesSeguir.forEach(function(botao) {

    botao.addEventListener("click", function() {

        if (botao.textContent.trim() === "Seguir") {

            botao.textContent = "Seguindo";

            botao.style.backgroundColor = "#ddd";

            botao.style.color = "#222";

        } else {

            botao.textContent = "Seguir";

            botao.style.backgroundColor = "#0095f6";

            botao.style.color = "white";

        }

    });

});


// ===============================
// BOTÃO DE PUBLICAR
// ===============================

const botaoPublicar = document.querySelector("nav button:nth-child(3)");


botaoPublicar.addEventListener("click", function() {

    alert("Em breve você poderá publicar fotos aqui!");

});


// ===============================
// BOTÕES DO MENU
// ===============================

const botoesMenu = document.querySelectorAll("nav button");


botoesMenu.forEach(function(botao, indice) {

    botao.addEventListener("click", function() {

        if (indice === 0) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

        else if (indice === 1) {

            alert("A pesquisa estará disponível em breve!");

        }

        else if (indice === 3) {

            alert("Aqui ficarão suas notificações!");

        }

        else if (indice === 4) {

            alert("Aqui ficará o seu perfil!");

        }

    });

});