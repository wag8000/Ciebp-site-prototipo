// ===============================
// 📊 RESULTADOS (GLOBAL)
// ===============================
import supabase from './supabase.js'

// 🔥 CARREGAR TODOS OS JOGOS
export async function carregarResultados() {
    const { data, error } = await supabase
        .from('matches')
        .select(`
            id,
            round,
            match_number,
            status,
            score_a,
            score_b,
            team_a:team_a_id (nome),
            team_b:team_b_id (nome)
        `)
        .order('round', { ascending: true })
        .order('match_number', { ascending: true })

    if (error) {
        console.error("Erro ao carregar resultados:", error)
        return
    }

    renderizarGrid(data)
    renderizarTabela(data)
}

// ===============================
// 🎮 GRID (CARDS)
// ===============================
function renderizarGrid(jogos) {
    const grid = document.getElementById('games-grid')
    if (!grid) return

    grid.innerHTML = ''

    jogos.forEach(j => {
        const statusColor =
            j.status === 'live' ? 'text-red-500' :
            j.status === 'ended' ? 'text-green-600' :
            'text-gray-400'

        grid.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow border">
                <p class="font-bold">${j.team_a?.nome || 'BYE'}</p>
                <p class="text-center text-gray-400">vs</p>
                <p class="font-bold">${j.team_b?.nome || 'BYE'}</p>

                <p class="mt-2 text-lg font-black">
                    ${j.score_a} x ${j.score_b}
                </p>

                <p class="text-xs ${statusColor}">
                    ${j.status.toUpperCase()}
                </p>
            </div>
        `
    })
}

// ===============================
// 📋 TABELA
// ===============================
function renderizarTabela(jogos) {
    const tbody = document.getElementById('games-table-body')
    if (!tbody) return

    tbody.innerHTML = ''

    jogos.forEach(j => {
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="p-2">Rodada ${j.round}</td>
                <td class="p-2">${j.team_a?.nome || '-'}</td>
                <td class="p-2 text-center">${j.score_a} x ${j.score_b}</td>
                <td class="p-2">${j.team_b?.nome || '-'}</td>
                <td class="p-2">${j.status}</td>
            </tr>
        `
    })
}

// ===============================
// 🔄 REFRESH MANUAL
// ===============================
window.refreshScores = carregarResultados