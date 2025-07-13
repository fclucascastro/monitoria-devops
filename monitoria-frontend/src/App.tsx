import { useEffect, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun, BookOpen, Home, Filter, LogOut, Edit2 } from "lucide-react"
import type { Monitoria } from "./types"

const dias = [
  'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira'
]

// Lista de locais para autocomplete
const locais: string[] = [
  "BLOCO 1 - SALA 1", "BLOCO 1 - SALA 2", "BLOCO 1 - SALA 3", "BLOCO 1 - SALA 4",
  "BLOCO 2 - SALA 1", "BLOCO 2 - SALA 2", "BLOCO 2 - SALA 3", "BLOCO 2 - SALA 4",
  "BLOCO 2 - LABORATÓRIO DE REDES", "BLOCO 2 - SALÃO MULTIUSO",
  "BLOCO 3 - Ateliê", "BLOCO 3 - SALA 1", "BLOCO 3 - SALA 2", "BLOCO 3 - SALA 3", "BLOCO 3 - SALA 4",
  "BLOCO 3 - laboratório de usabilidade", "BLOCO 3 - SALA DE DESENHO", "BLOCO 3 - Stúdio de Imagem",
  "BLOCO 3 - LABORATÓRIO 6", "BLOCO 3 - LABORATÓRIO 7", "BLOCO 4 - SALA 1", "BLOCO 4 - SALA 2",
  "BLOCO 4 - SALA 3", "BLOCO 4 - SALA 4", "BLOCO 4 - Lab de Arquitetura", "BLOCO 4 - LABORATÓRIO DE ELETRÔNICA",
  "BLOCO 4 - LABORATÓRIO DE INFORMÁTICA 5", "Bloco 1 - LABORATÓRIO I", "Bloco 1 - LABORATÓRIO 2",
  "Bloco 1 - LABORATÓRIO 3", "Bloco 1 - LABORATÓRIO 4"
]

type ModalMode = "new" | "edit"

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    document.documentElement.classList.contains('dark') ? "dark" : "light"
  )
  const [monitorias, setMonitorias] = useState<Monitoria[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>("new")
  const [nova, setNova] = useState({
    id: undefined as number | undefined,
    titulo: "",
    monitores: [] as string[],
    monitorInput: "",
    dias: [] as string[],
    horario: "",
    local: ""
  })
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [sidebarAlert, setSidebarAlert] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean, id?: number }>({ open: false })

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => { fetchMonitorias() }, [])
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [message])

  useEffect(() => {
    if (!sidebarAlert) return
    const timer = setTimeout(() => setSidebarAlert(null), 3000)
    return () => clearTimeout(timer)
  }, [sidebarAlert])

  const fetchMonitorias = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/monitoria`)
      .then(res => setMonitorias(res.data))
  }

  // Validação dos campos obrigatórios
  const validarNova = () => {
    if (
      !nova.titulo.trim() ||
      nova.monitores.length === 0 ||
      nova.dias.length === 0 ||
      !nova.horario.trim() ||
      !nova.local.trim()
    ) {
      setMessage("Preencha todos os campos obrigatórios!")
      return false
    }
    return true
  }

  // Envia ou edita monitoria
  const salvarMonitoria = async () => {
    if (!validarNova()) return
    try {
      if (modalMode === "new") {
        await axios.post(`${import.meta.env.VITE_API_URL}/monitoria`, {
          titulo: nova.titulo,
          professor: nova.monitores.join(", "),
          horario: `${nova.dias.join(", ")} ${nova.horario}`,
          local: nova.local
        })
        setMessage("Monitoria adicionada com sucesso!")
      } else if (modalMode === "edit" && nova.id) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/monitoria/${nova.id}`, {
          titulo: nova.titulo,
          professor: nova.monitores.join(", "),
          horario: `${nova.dias.join(", ")} ${nova.horario}`,
          local: nova.local
        })
        setMessage("Monitoria atualizada com sucesso!")
      }
      fetchMonitorias()
      setNova({
        id: undefined,
        titulo: "",
        monitores: [],
        monitorInput: "",
        dias: [],
        horario: "",
        local: ""
      })
      setModalOpen(false)
      setModalMode("new")
    } catch {
      setMessage("Erro ao salvar monitoria.")
    }
  }

  // Preenche o formulário com dados para edição
  const editarMonitoria = (m: Monitoria) => {
    // Divide campos para reatribuir ao formulário do modal
    let monitores = m.professor ? m.professor.split(",").map(s => s.trim()) : []
    let [diasParte, horarioParte] = m.horario ? m.horario.split(/\s(?=\d)/) : ["", ""]
    let diasArr = diasParte ? diasParte.split(",").map(s => s.trim()) : []
    setNova({
      id: m.id,
      titulo: m.titulo,
      monitores,
      monitorInput: "",
      dias: diasArr,
      horario: horarioParte || "",
      local: m.local || ""
    })
    setModalOpen(true)
    setModalMode("edit")
  }

  const solicitarExclusao = (id: number) => setDeleteModal({ open: true, id })

  const deletarMonitoria = async () => {
    if (!deleteModal.id) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/monitoria/${deleteModal.id}`)
      fetchMonitorias()
      setMessage("Monitoria excluída.")
    } catch {
      setMessage("Erro ao excluir.")
    }
    setDeleteModal({ open: false, id: undefined })
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
            onClick={() => setSidebarAlert("Você está na Home!")}
          >
            <Home size={28}/>
          </button>
          <button
            className="text-white opacity-60 hover:opacity-90"
            title="Filtro (Em breve)"
            onClick={() => setSidebarAlert("Funcionalidade de filtro em breve!")}
          >
            <Filter size={28}/>
          </button>
        </nav>
        <div className="flex-grow"></div>
        <button
          className="text-white opacity-60 hover:opacity-100 mb-4"
          title="Sair (Exemplo)"
          onClick={() => setSidebarAlert("Logout é apenas visual neste protótipo.")}
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
              placeholder="Buscar por disciplina, monitores, local..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:bg-[#23253c] dark:text-white"
              style={{minWidth: 260}}
            />
            <button
              className="ml-3 bg-blue-600 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow font-bold"
              onClick={() => {
                setModalMode("new")
                setNova({
                  id: undefined,
                  titulo: "",
                  monitores: [],
                  monitorInput: "",
                  dias: [],
                  horario: "",
                  local: ""
                })
                setModalOpen(true)
              }}
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
        {sidebarAlert && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="fixed bottom-8 left-24 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            {sidebarAlert}
          </motion.div>
        )}
        </AnimatePresence>

        {/* Modal de confirmação de exclusão */}
        <AnimatePresence>
        {deleteModal.open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-[#23253c] p-8 rounded-xl shadow-2xl w-full max-w-sm text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="mb-4 flex flex-col items-center">
                <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m0-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                <h2 className="text-xl font-bold mb-1 text-gray-700 dark:text-white">
                  Confirmar exclusão
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Tem certeza que deseja excluir esta monitoria?
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
                  onClick={() => setDeleteModal({ open: false, id: undefined })}
                >Cancelar</button>
                <button
                  className="px-5 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                  onClick={deletarMonitoria}
                >Excluir</button>
              </div>
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
              <h2 className="text-2xl font-bold mb-5 text-gray-700 dark:text-white text-center">
                {modalMode === "edit" ? "Editar Monitoria" : "Nova Monitoria"}
              </h2>
              {/* Disciplina */}
              <label className="block mb-2 font-semibold">Disciplina <span className="text-red-500">*</span></label>
              <input className="w-full mb-3 p-3 rounded border dark:bg-[#202334] dark:text-white"
                placeholder="Disciplina"
                value={nova.titulo}
                onChange={e => setNova({ ...nova, titulo: e.target.value })}
              />
              {/* Monitores */}
              <label className="block mb-2 font-semibold">Monitores <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {nova.monitores.map((nome, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center">
                    {nome}
                    <button type="button" className="ml-2 text-xs" onClick={() => {
                      setNova({ ...nova, monitores: nova.monitores.filter((_, j) => j !== i) })
                    }}>✕</button>
                  </span>
                ))}
                <input
                  className="flex-1 min-w-[120px] p-2 border rounded dark:bg-[#202334] dark:text-white"
                  placeholder="Digite o nome e pressione Enter"
                  value={nova.monitorInput}
                  onChange={e => setNova({ ...nova, monitorInput: e.target.value })}
                  onKeyDown={e => {
                    if (
                      e.key === "Enter" &&
                      nova.monitorInput.trim()
                    ) {
                      setNova({
                        ...nova,
                        monitores: [...nova.monitores, nova.monitorInput.trim()],
                        monitorInput: ""
                      });
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {/* Dias da semana */}
              <label className="block mb-2 font-semibold">Dias da semana <span className="text-red-500">*</span></label>
              <div className="flex gap-2 mb-3 flex-wrap">
                {dias.map(dia => (
                  <label key={dia} className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer border
                    ${nova.dias.includes(dia) ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}>
                    <input
                      type="checkbox"
                      checked={nova.dias.includes(dia)}
                      onChange={() => {
                        setNova({
                          ...nova,
                          dias: nova.dias.includes(dia)
                            ? nova.dias.filter(d => d !== dia)
                            : [...nova.dias, dia]
                        })
                      }}
                      className="accent-blue-600"
                    />
                    <span>{dia}</span>
                  </label>
                ))}
              </div>
              {/* Horário */}
              <label className="block mb-2 font-semibold">Horário <span className="text-red-500">*</span></label>
              <input
                className="w-full mb-3 p-3 rounded border dark:bg-[#202334] dark:text-white"
                placeholder="Ex: 09:00-10:00"
                value={nova.horario}
                onChange={e => setNova({ ...nova, horario: e.target.value })}
              />
              {/* Local com autocomplete */}
              <label className="block mb-2 font-semibold">Local <span className="text-red-500">*</span></label>
              <input
                className="w-full mb-3 p-3 rounded border dark:bg-[#202334] dark:text-white"
                list="locais-list"
                placeholder="Digite ou selecione o local"
                value={nova.local}
                onChange={e => setNova({ ...nova, local: e.target.value })}
                autoComplete="off"
              />
              <datalist id="locais-list">
                {locais.map(local => <option value={local} key={local}/>)}
              </datalist>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => {
                  setModalOpen(false)
                  setModalMode("new")
                }} className="px-4 py-2 text-gray-600 dark:text-gray-200">Cancelar</button>
                <button onClick={salvarMonitoria} className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800">
                  {modalMode === "edit" ? "Atualizar" : "Salvar"}
                </button>
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
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => editarMonitoria(m)}
                          className="text-blue-500 hover:text-blue-800 opacity-70 hover:opacity-100 transition mb-1"
                          title="Editar"
                        >
                          <Edit2 size={20}/>
                        </button>
                        <button
                          onClick={() => solicitarExclusao(m.id)}
                          className="text-red-500 hover:text-red-800 opacity-70 hover:opacity-100 transition"
                          title="Excluir"
                        >
                          <svg height="22" width="22" viewBox="0 0 24 24" fill="none"><path d="M9 3V4H4V6H20V4H15V3H9ZM6 8V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V8H6ZM8 10H10V18H8V10ZM14 10H16V18H14V10Z" fill="currentColor"/></svg>
                        </button>
                      </div>
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
