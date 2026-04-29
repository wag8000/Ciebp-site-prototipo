// ===============================
// 🔴 AO VIVO (REALTIME SIMPLES)
// ===============================
import supabase from './supabase.js'

async function carregarJogoAoVivo() {
    const { data, error } = await supabase
        .from('matches')
        .select(`
            *,
            team_a:team_a_id (nome),
            team_b:team_b_id (nome)
        `)
        .eq('status', 'live')
        .limit(1)
        .single()

    if (error || !data) {
        console.warn("Nenhum jogo ao vivo")
        return
    }

    // NOMES
    document.getElementById('team-a-name').innerText =
        data.team_a?.nome || '-'

    document.getElementById('team-b-name').innerText =
        data.team_b?.nome || '-'

    // PLACAR
    document.getElementById('score-a').innerText = data.score_a
    document.getElementById('score-b').innerText = data.score_b
}

// 🔄 AUTO REFRESH
setInterval(carregarJogoAoVivo, 3000)

// 🚀 INIT
document.addEventListener('DOMContentLoaded', () => {
    carregarJogoAoVivo()
})