;(function(){
  const supabase = () => window.supabaseClient;

  async function cadastrarTime(grupo, nome) {
    const client = supabase();
    if (!client) { alert('Supabase não configurado'); return }

    const { error } = await client
      .from('teams')
      .insert([{ grupo, nome }]);

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar");
      return;
    }

    alert("Time cadastrado!");
  }

  // expose for other scripts if needed
  window.cadastrarTime = cadastrarTime;
})();