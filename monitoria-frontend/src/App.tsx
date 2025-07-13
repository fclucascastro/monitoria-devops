import { useEffect, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun, BookOpen, Home, Filter, LogOut } from "lucide-react"
import type { Monitoria } from "./types"

const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira']

function App() {
  // Theme dinâmico (agora simples, pois já inicializa certo)
  const [theme, setTheme] = useState<'light' | 'dark'>(
    document.documentElement.classList.contains('dark') ? "dark" : "light"
  )
  const [monitorias, setMonitorias] = useState<Monitoria[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [nova, setNova] = useState({ titulo: "", professor: "", horario: "", local: "" })
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [sidebarAlert, setSidebarAlert] = useState<string | null>(null)

  // Atualiza HTML sempre que muda
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => { fetchMonitorias() }, [])

  // Mensagem some automática
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [message])

  const fetchMonitorias = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/monitoria`)
      .then(res => setMonitorias(res.data))
  }

  const enviarMonitoria = async () => {
    if (!nova.titulo || !nova.professor || !nova.horario || !nova.local) {
      setMessage("Preencha todos os campos!")
      return
    }
    if (!dias.some(d => nova.horario.toLowerCase().includes(d.toLowerCase().split('-')[0]))) {
      setMessage("Informe um dia da semana válido no horário!")
      return
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/monitoria`, nova)
      fetchMonitorias()
      setMessage("Monitoria adicionada com sucesso!")
      setNova({ titulo: "", professor: "", horario: "", local: "" })
      setModalOpen(false)
    } catch {
      setMessage("Erro ao criar monitoria.")
    }
  }

  const deletarMonitoria = async (id: number) => {
    if (!confirm("Deseja realmente excluir?")) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/monitoria/${id}`)
      fetchMonitorias()
      setMessage("Monitoria excluída.")
    } catch {
      setMessage("Erro ao excluir.")
    }
  }

  const filtradas = monitorias.filter(m =>
    m.titulo.toLowerCase().includes(filter.toLowerCase())
    || m.professor.toLowerCase().includes(filter.toLowerCase())
    || (m.local && m.local.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className={`min-h-screen flex bg-gray-50 dark:bg-[#181c27] transition-colors`}>
      {/* Sidebar */}
      <aside className="w-20 bg-gradient-to-b from-blue-800 to-blue-600 dark:from-[#202334] dark:to-[#23253c] flex flex-col items-center py-8 shadow-xl fixed h-full z-40">
        <BookOpen size={36} className="text-white mb-8" />
        <nav className="flex flex-col gap-6">
          <button
            className="text-white opacity-90 hover:opacity-100"
            title="Home"
            onClick={() => setSidebarAlert("Bem-vindo à Home!")}
          >
            <Home size={28}/>
          </button>
          <button
            className="text-white opacity-60 hover:opacity-90"
            title="Filtro (em breve)"
            onClick={() => setSidebarAlert("Funcionalidade de filtro em breve!")}
          >
            <Filter size={28}/>
          </button>
        </nav>
        <div className="flex-grow"></div>
        <button
          className="text-white opacity-60 hover:opacity-100 mb-4"
          title="Sair (Exemplo)"
          onClick={() => setSidebarAlert("Logout (apenas visual, implemente se quiser!)")}
        >
          <LogOut size={28}/>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-20 min-h-screen p-8">
        {/* Header sofisticado */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-800 dark:text-white tracking-tight">
              Agenda de Monitorias
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-300 font-semibold mt-1">Organize e visualize monitorias de forma intuitiva</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar por disciplina, professor, local..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:bg-[#23253c] dark:text-white"
              style={{minWidth: 260}}
            />
            <button
              className="ml-3 bg-blue-600 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow font-bold"
              onClick={() => setModalOpen(true)}
            >
              + Adicionar
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-3 p-2 rounded-full border-2 border-blue-500 dark:border-yellow-300 transition"
              title="Alternar tema"
            >
              {theme === "dark" ? <Sun size={20} className="text-yellow-300"/> : <Moon size={20} className="text-blue-700"/>}
            </button>
          </div>
        </header>

        {/* Snackbar de mensagem */}
        <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            {message}
            <button onClick={() => setMessage(null)} className="ml-3 text-white font-bold">X</button>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Sidebar Alert Modal */}
        <AnimatePresence>
        {sidebarAlert && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarAlert(null)}
          >
            <motion.div
              className="bg-white dark:bg-[#23253c] p-8 rounded-xl shadow-2xl w-full max-w-md text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <p className="text-lg text-gray-900 dark:text-gray-100 mb-4">{sidebarAlert}</p>
              <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg" onClick={() => setSidebarAlert(null)}>Fechar</button>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Modal Nova Monitoria */}
        <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-[#23253c] p-8 rounded-xl shadow-2xl w-full max-w-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-5 text-gray-700 dark:text-white">Nova Monitoria</h2>
              <input className="w-full mb-3 p-3 rounded border dark:bg-[#202334] dark:text-white" placeholder="Disciplina" value={nova.titulo} onChange={e => setNova({ ...nova, titulo: e.target.value })} />
              <input className="w-full mb-3 p-3 rounded border dark:bg-[#202334] dark:text-white" placeholder="Professor" value={nova.professor} onChange={e => setNova({ ...nova, professor: e.target.value })} />
              <input className="w-full mb-3 p-3 rounded border dark:bg-[#202334] dark:text-white" placeholder="Dia e Horário (ex: Segunda 10h)" value={nova.horario} onChange={e => setNova({ ...nova, horario: e.target.value })} />
              <input className="w-full mb-3 p-3 rounded border dark:bg-[#202334] dark:text-white" placeholder="Local (ex: Bloco 2 Sala 3)" value={nova.local} onChange={e => setNova({ ...nova, local: e.target.value })} />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-200">Cancelar</button>
                <button onClick={enviarMonitoria} className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Grade de Monitorias */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-7">
          {dias.map(dia => (
            <div key={dia}>
              <h2 className="text-xl font-bold mb-3 text-blue-900 dark:text-blue-300 border-b-2 border-blue-300 dark:border-blue-800 pb-1 text-center">
                {dia}
              </h2>
              <div className="flex flex-col gap-5">
                <AnimatePresence>
                {filtradas
                  .filter(m => m.horario && m.horario.toLowerCase().includes(dia.toLowerCase().split('-')[0]))
                  .map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    layout
                    className="relative bg-white dark:bg-[#242943] p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-blue-100 dark:border-blue-900 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold mb-1 text-blue-900 dark:text-white">{m.titulo}</p>
                        <p className="font-semibold text-gray-600 dark:text-blue-200 mb-2">{m.professor}</p>
                        <p className="text-xs text-gray-500 dark:text-blue-100">{m.horario}</p>
                        <p className="text-xs text-gray-400 dark:text-blue-200">{m.local}</p>
                      </div>
                      <button
                        onClick={() => deletarMonitoria(m.id)}
                        className="text-red-500 hover:text-red-800 opacity-70 hover:opacity-100 transition"
                        title="Excluir"
                      >
                        <svg height="22" width="22" viewBox="0 0 24 24" fill="none"><path d="M9 3V4H4V6H20V4H15V3H9ZM6 8V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V8H6ZM8 10H10V18H8V10ZM14 10H16V18H14V10Z" fill="currentColor"/></svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
