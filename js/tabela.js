// ===============================
// 🔌 SUPABASE
// ===============================
import supabase from './supabase.js'
import { carregarResultados } from './resultado.js'

// ===============================
// ➕ ADICIONAR TIME
// ===============================
async function addTime() {
  const escola = document.getElementById('input-escola').value.trim()
  const nome = document.getElementById('input-time').value.trim()

  if (!escola || !nome) {
    alert("Preencha todos os campos")
    return
  }

  const { error } = await supabase
    .from('teams')
    .insert([{ escola, nome }])

  if (error) {
    console.error(error)
    alert("Erro ao cadastrar")
  } else {
    carregarTimes()
  }
}

// ===============================
// 📋 LISTAR TIMES
// ===============================
async function carregarTimes() {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('created_at')

  if (error) return console.error(error)

  const tbody = document.getElementById('table-body')
  if (!tbody) return

  tbody.innerHTML = ''

  data.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.escola}</td>
        <td>${t.nome}</td>
        <td>
          <button onclick="removerTime(${t.id})">Remover</button>
        </td>
      </tr>
    `
  })
}

// ===============================
// ❌ REMOVER
// ===============================
async function removerTime(id) {
  if (!confirm("Remover?")) return

  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id)

  if (!error) carregarTimes()
}

// ===============================
// 🧠 GERAR CHAVEAMENTO
// ===============================
async function gerarChaveamento() {
  const { error } = await supabase.rpc('gerar_chaveamento')

  if (error) {
    console.error(error)
    alert("Erro")
  } else {
    alert("Chaveamento gerado!")

    await carregarChaveamento()
    await carregarResultados()
  }
}

// ===============================
// 📊 CARREGAR CHAVEAMENTO
// ===============================
async function carregarChaveamento() {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      round,
      match_number,
      team_a:team_a_id (nome),
      team_b:team_b_id (nome)
    `)
    .order('round')
    .order('match_number')

  if (error) return console.error(error)

  renderBracket(data)
}

// ===============================
// 🏆 RENDER BRACKET
// ===============================
function renderBracket(matches) {
  const container = document.getElementById('bracket-ui')
  if (!container) return

  container.innerHTML = ''

  const rounds = {}

  matches.forEach(m => {
    if (!rounds[m.round]) rounds[m.round] = []
    rounds[m.round].push(m)
  })

  const bracket = document.createElement('div')
  bracket.className = "flex gap-10 overflow-x-auto"

  Object.keys(rounds).forEach(round => {
    const col = document.createElement('div')
    col.className = "flex flex-col gap-6"

    col.innerHTML += `<h3>Rodada ${round}</h3>`

    rounds[round].forEach(m => {
      col.innerHTML += `
        <div class="bg-gray-50 p-3 rounded shadow w-[200px]">
          <div>${m.team_a?.nome || 'BYE'}</div>
          <div class="text-center">vs</div>
          <div>${m.team_b?.nome || 'BYE'}</div>
        </div>
      `
    })

    bracket.appendChild(col)
  })

  container.appendChild(bracket)
}

// ===============================
// 🚀 INIT GLOBAL
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  carregarTimes()
  carregarChaveamento()
  carregarResultados()
})

// ===============================
// 🌐 GLOBAL (HTML onclick)
// ===============================
window.addTime = addTime
window.removerTime = removerTime
window.gerarChaveamento = gerarChaveamento