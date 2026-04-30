async function loadDashboard() {

    // =========================
    // BUSCAR DADOS
    // =========================
    const { data: matches } = await supabase
        .from("matches")
        .select("*")
        .order("round_number");

    const { data: times } = await supabase
        .from("futebol_robos")
        .select("*");

    // =========================
    // TOTAL
    // =========================
    document.getElementById("total-matches").innerText = matches.length;
    document.getElementById("total-times").innerText = times.length;

    // =========================
    // ESTRUTURA DE DADOS
    // =========================
    const stats = {};

    times.forEach(t => {
        stats[t.time] = {
            wins: 0,
            losses: 0,
            games: 0,
            rounds: {}
        };
    });

    // =========================
    // PROCESSAR PARTIDAS
    // =========================
    matches.forEach(m => {

        if (!m.team_a || !m.team_b) return;

        // jogos
        stats[m.team_a].games++;
        stats[m.team_b].games++;

        // criar rodada
        if (!stats[m.team_a].rounds[m.round_number]) {
            stats[m.team_a].rounds[m.round_number] = 0;
        }
        if (!stats[m.team_b].rounds[m.round_number]) {
            stats[m.team_b].rounds[m.round_number] = 0;
        }

        if (m.winner) {

            stats[m.winner].wins++;

            // derrota
            const loser = m.winner === m.team_a ? m.team_b : m.team_a;
            stats[loser].losses++;

            // evolução por rodada
            stats[m.winner].rounds[m.round_number]++;
        }
    });

    // =========================
    // CALCULAR MÉTRICAS
    // =========================
    const ranking = Object.entries(stats).map(([team, s]) => {

        const saldo = s.wins - s.losses;
        const taxa = s.games > 0 ? (s.wins / s.games) * 100 : 0;

        return {
            team,
            ...s,
            saldo,
            taxa: taxa.toFixed(1)
        };
    });

    // ordenar por vitórias
    ranking.sort((a, b) => b.wins - a.wins);

    // =========================
    // RENDER RANKING
    // =========================
    const list = document.getElementById("ranking-list");

    list.innerHTML = ranking.map((t, i) => `
        <li class="border-b py-3">
            <div class="flex justify-between">
                <strong>${i + 1}º ${t.team}</strong>
                <span>${t.wins} vitórias</span>
            </div>

            <div class="text-sm text-gray-500 flex gap-4 mt-1">
                <span>Jogos: ${t.games}</span>
                <span>Saldo: ${t.saldo}</span>
                <span>Taxa: ${t.taxa}%</span>
            </div>
        </li>
    `).join("");

    // =========================
    // GRÁFICO DE VITÓRIAS
    // =========================
    const labels = ranking.map(r => r.team);
    const winsData = ranking.map(r => r.wins);

    new Chart(document.getElementById("rankingChart"), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Vitórias',
                data: winsData
            }]
        }
    });

    // =========================
    // EVOLUÇÃO POR RODADA
    // =========================
    const rounds = [...new Set(matches.map(m => m.round_number))].sort();

    const evolutionDatasets = ranking.slice(0, 5).map(team => {
        let acumulado = 0;

        const data = rounds.map(r => {
            acumulado += team.rounds[r] || 0;
            return acumulado;
        });

        return {
            label: team.team,
            data
        };
    });

    // criar canvas dinamicamente
    const evoCanvas = document.createElement("canvas");
    document.body.appendChild(evoCanvas);

    new Chart(evoCanvas, {
        type: 'line',
        data: {
            labels: rounds.map(r => `Rodada ${r}`),
            datasets: evolutionDatasets
        }
    });
}

loadDashboard();

const { data } = await supabase
  .from('matches')
  .select(`
    winner_id,
    team_a:team_a_id(nome),
    team_b:team_b_id(nome)
  `)