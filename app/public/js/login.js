const form = document.getElementById("form")
const username = document.getElementById("username")
const password = document.getElementById("senha");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  checkForm();

})

username.addEventListener("blur", () =>{
    checkInputUsername();
})
senha.addEventListener("blur", () => {
    checkInputSenha();
})

function checkInputUsername(){
    const usernameValue = username.value;

    if(usernameValue === ""){
        errorInput(username, "Preencha seu nome de usuário")

    }else{
        const formItem = username.parentElement;
        formItem.className = "input-box"
    }
}

function checkInputSenha(){
    const senhaValue = senha.value;

    if(senhaValue === ""){
        errorInput(senha, "Digite sua senha")

    }else if(senhaValue.length < 8){
        errorInput(senha, "A senha precisa ter no mínimo 8 caracteres.")
    }else{
        const formItem = senha.parentElement;
        formItem.className = "input-box"
    }
}
function checkForm(){
  checkInputUsername();
  checkInputSenha();

  const formItems = form.querySelectorAll(".input-box")

  const isValid = [...formItems].every( (item) => {
    return item.className === "input-box"
  });

  if(isValid){
    alert("Bem-vindo de volta!")
  }

}


function errorInput(input, message){
    const formItem = input.parentElement;
    const textMessage = formItem.querySelector("a")

    textMessage.innerText = message;

    formItem.className = "input-box error"
}