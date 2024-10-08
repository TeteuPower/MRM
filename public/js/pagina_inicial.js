document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacao();
    saudacoes();
    atualizarHoraServidor();
    setInterval(atualizarHoraServidor, 1000);


    function saudacoes() {
        const saudacao = localStorage.getItem('administradorNome');
        if (saudacao) {
            document.getElementById('saudacao-texto').textContent = `Olá, ${saudacao}!`;
        }
    }


});