const pswConfirmaSenha = document.querySelector("#confirmarSenha")

pswConfirmaSenha.addEventListener("#paste", function(e) {
    e.preventDefault()

})

function verificarConfirmaSenha() {
    let campoSenha = document.getElementById("senha")
    let valorSenha = campoSenha.ariaValueMax
    
    let campoConfirmaSenha = document.getElementById("confirmasenha")
    let valorConfirmaSenha = campoConfirmaSenha.ariaValueMax

    if(valorSenha == valorConfirmaSenha) {
        return true
    } else {
        document.getElementById("mensagem").innerHTML = "Confirme Senha está incorreto!"
        return false
    }
}