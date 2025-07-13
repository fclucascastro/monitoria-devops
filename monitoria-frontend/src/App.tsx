import { useEffect, useState } from "react"
import axios from "axios"
import type { Monitoria } from "./types"

const dias = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira'
]

const diasValidos = dias.map(d => d.split('-')[0].toLowerCase())

function App() {
  const [monitorias, setMonitorias] = useState<Monitoria[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [nova, setNova] = useState({ titulo: "", professor: "", horario: "", local: "" })
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso', texto: string } | null>(null)

  const fetchMonitorias = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/monitoria`)
    setMonitorias(res.data)
  }

  useEffect(() => { fetchMonitorias() }, [])

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [mensagem])

  const enviarMonitoria = async () => {
    if (!nova.titulo || !nova.professor || !nova.horario || !nova.local) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos obrigatórios!' })
      return
    }
    const horarioLower = nova.horario.trim().toLowerCase()
    const diaInformado = horarioLower.split(' ')[0]
    if (!diasValidos.includes(diaInformado)) {
      setMensagem({
        tipo: 'erro',
        texto: 'O campo Horário deve começar com um dia da semana válido (Segunda, Terça, ... Sexta).'
      })
      return
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/monitoria`, nova)
      await fetchMonitorias()
      setNova({ titulo: "", professor: "", horario: "", local: "" })
      setMensagem({ tipo: 'sucesso', texto: 'Monitoria cadastrada com sucesso!' })
      setModalOpen(false)
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao cadastrar monitoria.' })
    }
  }

  const deletarMonitoria = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta monitoria?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/monitoria/${id}`)
      await fetchMonitorias()
      setMensagem({ tipo: 'sucesso', texto: 'Monitoria excluída com sucesso!' })
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao excluir monitoria.' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Mensagem de feedback visual */}
      {mensagem && (
        <div
          className={
            mensagem.tipo === 'erro'
              ? 'bg-red-200 text-red-800 rounded px-4 py-2 mb-4'
              : 'bg-green-200 text-green-800 rounded px-4 py-2 mb-4'
          }
        >
          {mensagem.texto}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Grade de Monitorias</h1>
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          Adicionar Monitoria
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white text-black p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Nova Monitoria</h2>
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Título"
              value={nova.titulo}
              onChange={(e) => setNova({ ...nova, titulo: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Professor"
              value={nova.professor}
              onChange={(e) => setNova({ ...nova, professor: e.target.value })}
            />
            {/* Auto-complete de dias no campo horário */}
            <input
              className="w-full mb-4 p-2 border rounded"
              placeholder="Horário (ex: Segunda 10h)"
              value={nova.horario}
              list="dias-da-semana"
              onChange={(e) => setNova({ ...nova, horario: e.target.value })}
            />
            <datalist id="dias-da-semana">
              {dias.map(dia => (
                <option key={dia} value={dia.split('-')[0] + " "} />
              ))}
            </datalist>
            <input
              className="w-full mb-4 p-2 border rounded"
              placeholder="Local (sala e bloco)"
              value={nova.local}
              onChange={(e) => setNova({ ...nova, local: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2">Cancelar</button>
              <button onClick={enviarMonitoria} className="bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {dias.map((dia) => (
          <div key={dia}>
            <h2 className="text-lg font-semibold bg-emerald-600 text-center py-2 rounded">{dia}</h2>
            <div className="mt-2 space-y-2">
              {monitorias
                .filter(m => m.horario.toLowerCase().includes(dia.toLowerCase().split('-')[0]))
                .map(m => (
                  <div key={m.id} className="bg-white text-black p-2 rounded shadow text-sm">
                    <p className="font-semibold">{m.titulo}</p>
                    <p>{m.professor}</p>
                    <p className="text-xs text-gray-600">{m.horario}</p>
                    <p className="text-xs text-gray-600 italic">{m.local}</p>

                    <button
                      onClick={() => deletarMonitoria(m.id)}
                      className="mt-2 text-red-500 hover:underline text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
