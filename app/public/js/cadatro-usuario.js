const pswConfirmaSenha = document.querySelector("#confirmasenha")

pswConfirmaSenha.addEventListener("paste", function(e) {
    e.preventDefault()

})

function verificaConfirmaSenha() {
    let campoSenha = document.getElementById('senha')
    let valorSenha = campoSenha.ariaValueMax
    
    let campoConfirmaSenha = document.getElementById('confirmasenha')
    let valorConfirmaSenha = campoConfirmaSenha.value

    if(valorSenha == valorConfirmaSenha) {
        return true
    } else {
        document.getElementById("mensagem").innerHTML = "Confirme Senha está incorreto!"
        return false
    }
}