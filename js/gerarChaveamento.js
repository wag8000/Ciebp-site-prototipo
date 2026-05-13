;(function(){
  const supabase = () => window.supabaseClient;

  async function gerarChaveamento() {
    const btn = document.getElementById("btnGerar");
    if (btn) {
      btn.disabled = true;
      btn.innerText = "Gerando...";
    }

    const client = supabase();
    if (!client) { alert('Supabase não configurado'); return }

    const { error } = await client.rpc('gerar_chaveamento');

    if (error) {
      console.error(error);
      alert("Erro ao gerar chaveamento");
      if (btn) { btn.disabled = false; btn.innerText = "Gerar Chaveamento"; }
      return;
    }

    alert("Chaveamento gerado!");
    location.reload();
  }

  window.gerarChaveamento = gerarChaveamento;
})();