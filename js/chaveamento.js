;(function(){
  const supabase = () => window.supabaseClient;

  let jogos = [];
  let teamsMap = new Map();

  async function carregarChaveamento() {
    const client = supabase();
    if (!client) return console.warn('Supabase não inicializado');

    // load teams into a map for name lookup
    const { data: teams } = await client.from('teams').select('id, nome');
    teamsMap = new Map((teams || []).map(t => [t.id, t]));

    const { data, error } = await client
      .from('matches')
      .select('*')
      .order('rodada', { ascending: true });

    if (error) return console.error('Erro ao carregar partidas:', error);

    jogos = data || [];
    renderizar();
  }

  function renderizar() {
    const container = document.getElementById('bracket-ui');
    if (!container) return;
    container.innerHTML = '';

    jogos.forEach(j => {
      const nomeA = teamsMap.get(j.time_a)?.nome || '—';
      const nomeB = teamsMap.get(j.time_b)?.nome || '—';

      container.innerHTML += `
        <div class="match p-4 border rounded mb-3">
          <div class="flex justify-between items-center mb-2">
            <strong>Rodada ${j.rodada ?? j.round ?? '—'}</strong>
            <span class="text-sm text-gray-500">${j.fase ?? ''}</span>
          </div>

          <div class="flex gap-4 items-center">
            <div class="flex-1">
              <div class="font-semibold">${nomeA}</div>
              <div class="text-sm text-gray-500">Gols: ${j.gols_a ?? 0}</div>
            </div>

            <div class="flex-1 text-center">vs</div>

            <div class="flex-1 text-right">
              <div class="font-semibold">${nomeB}</div>
              <div class="text-sm text-gray-500">Gols: ${j.gols_b ?? 0}</div>
            </div>
          </div>

          <div class="mt-3 flex gap-2">
            <input type="number" min="0" id="golsA-${j.id}" placeholder="Gols ${nomeA}" class="border p-2 rounded w-24">
            <input type="number" min="0" id="golsB-${j.id}" placeholder="Gols ${nomeB}" class="border p-2 rounded w-24">
            <button onclick="finalizarPartida(${j.id})" class="bg-blue-600 text-white px-3 py-2 rounded">Finalizar</button>
          </div>
        </div>
      `;
    });
  }

  window.finalizarPartida = async (partidaId) => {
    const golsA = parseInt(document.getElementById(`golsA-${partidaId}`)?.value || '0', 10);
    const golsB = parseInt(document.getElementById(`golsB-${partidaId}`)?.value || '0', 10);

    const client = supabase();
    if (!client) return alert('Supabase não configurado');

    const { error } = await client.rpc('finalizar_partida', { partida_id: partidaId, gols_time_a: golsA, gols_time_b: golsB });

    if (error) {
      console.error('Erro ao finalizar partida', error);
      alert('Erro ao finalizar partida');
      return;
    }

    // slight delay to allow triggers to recalc
    setTimeout(() => carregarChaveamento(), 500);
  };

  // init
  carregarChaveamento();

  // realtime subscription to matches
  try {
    const client = supabase();
    if (client && client.channel) {
      client
        .channel('public:matches')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => carregarChaveamento())
        .subscribe();
    }
  } catch (e) {
    try {
      // fallback for older client
      const client = supabase();
      client.from('matches').on('*', () => carregarChaveamento()).subscribe();
    } catch (_){ }
  }
})();