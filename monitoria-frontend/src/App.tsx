import { useEffect, useState } from "react"
import axios from "axios"
import type { Monitoria } from "./types"


const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira']

function App() {
  const [monitorias, setMonitorias] = useState<Monitoria[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [nova, setNova] = useState({ titulo: "", professor: "", horario: "", local: ""})

  const fetchMonitorias = () => {
    {/*axios.get("http://localhost:3000/monitoria")*/}
    axios.get(`${import.meta.env.VITE_API_URL}/monitoria`)
      .then(res => setMonitorias(res.data))
  }

  useEffect(() => {
    fetchMonitorias()
  }, [])

  const enviarMonitoria = async () => {
    {/*await axios.post("http://localhost:3000/monitoria", nova)*/}
    axios.post(`${import.meta.env.VITE_API_URL}/monitoria`, nova)
    fetchMonitorias()
    setNova({ titulo: "", professor: "", horario: "", local:"" })
    setModalOpen(false)
  }

  const deletarMonitoria = async (id: number) => {
  if (!confirm("Tem certeza que deseja excluir esta monitoria?")) return;

  try {
    {/*await axios.delete(`http://localhost:3000/monitoria/${id}`)*/}
    axios.delete(`${import.meta.env.VITE_API_URL}/monitoria/${id}`)
    fetchMonitorias()
  } catch (err) {
    console.error("Erro ao excluir monitoria:", err)
  }
}


  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/*<h1 className="text-2xl font-bold mb-4">Grade de Monitorias</h1>*/}
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
      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="Horário (ex: Segunda 10h)"
        value={nova.horario}
        onChange={(e) => setNova({ ...nova, horario: e.target.value })}
      />
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
