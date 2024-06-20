const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Verifica se o nome está vazio
    if (nameInput.value === "") {
        alert("Por favor, preencher seu nome");
        return;
    }
    
    // Verifica se o e-mail está preenchido e se é válido
    if(emailInput.value === "" || !isEmailValid){
        alert("Por favor, preencha seu e-mail!");
        return;
    }

    // Se todos os campos estiverem corretamente preenchidos, envie o form
    form.submit();
})

//função que válida email
function isEmailValid(email){

    //cria uma regex para validar email
    const emailRegex = new RegExp(
        // usuario12@host.com.br
        /^[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-z]{2,}$/
    );

    if(emailRegex.test(email)) {
        return true;
    }

    return false;
}
