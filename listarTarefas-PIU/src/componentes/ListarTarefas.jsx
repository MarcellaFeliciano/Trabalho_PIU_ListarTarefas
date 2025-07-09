import './ListarTarefas.css';
import { useState, useRef, useEffect } from 'react';

export default function Listar() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [idEditando, setIdEditando] = useState(null);
  const [lista, setLista] = useState([]);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todas');

  const formRef = useRef(null);
  const tituloRef = useRef(null);

  useEffect(() => {
    if (idEditando !== null && tituloRef.current) {
      tituloRef.current.focus();
    }
  }, [idEditando]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo) return;

    const novaTarefa = {
      id: Math.floor(Math.random() * 10000),
      titulo,
      descricao,
      categoria,
      status: false,
    };

    if (idEditando) {
      setLista(lista.map(item =>
        item.id === idEditando ? { ...item, titulo, descricao, categoria } : item
      ));
      setIdEditando(null);
    } else {
      setLista([...lista, novaTarefa]);
    }

    setTitulo('');
    setDescricao('');
    setCategoria('');
  };

  const handleToggle = (id) => {
    setLista(lista.map(item =>
      item.id === id ? { ...item, status: !item.status } : item
    ));
  };

  const handleApagar = (id) => {
    const confirmar = window.confirm('Tem certeza que deseja apagar esta tarefa?');
    if (confirmar) {
      setLista(lista.filter(item => item.id !== id));
    }
  };

  const handleEditar = (id) => {
    const item = lista.find(item => item.id === id);
    if (item) {
      setTitulo(item.titulo);
      setDescricao(item.descricao);
      setCategoria(item.categoria);
      setIdEditando(id);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMove = (id, direcao) => {
    const index = lista.findIndex(item => item.id === id);
    if ((index === 0 && direcao === 'subir') || (index === lista.length - 1 && direcao === 'descer')) return;

    const novaLista = [...lista];
    const [itemMovido] = novaLista.splice(index, 1);
    const novoIndice = direcao === 'subir' ? index - 1 : index + 1;
    novaLista.splice(novoIndice, 0, itemMovido);
    setLista(novaLista);
  };

  const handleClear = () => {
    const confirmar = window.confirm('Deseja mesmo apagar todas as tarefas?');
    if (confirmar) {
      setLista([]);
    }
  };

  const tarefasFiltradas = lista.filter((tarefa) => {
    const categoriaOk = filtroCategoria === 'Todos' || tarefa.categoria === filtroCategoria;
    const statusOk =
      filtroStatus === 'Todas' ||
      (filtroStatus === 'Concluídas' && tarefa.status) ||
      (filtroStatus === 'Pendentes' && !tarefa.status);
    return categoriaOk && statusOk;
  });

  return (
    <div className={`container ${temaEscuro ? 'tema-escuro' : 'tema-claro'}`}>
      <div className="sidebar">
        <h3>Categorias</h3>
        <ul>
          {['Todos', 'Escola', 'Trabalho', 'Pessoal'].map((cat) => (
            <li
              key={cat}
              className={filtroCategoria === cat ? 'ativo' : ''}
              onClick={() => setFiltroCategoria(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>

        <h3>Status</h3>
        <ul>
          {['Todas', 'Pendentes', 'Concluídas'].map((status) => (
            <li
              key={status}
              className={filtroStatus === status ? 'ativo' : ''}
              onClick={() => setFiltroStatus(status)}
            >
              {status}
            </li>
          ))}
        </ul>

        <button className="botao-tema" onClick={() => setTemaEscuro(!temaEscuro)}>
          Alternar Tema
        </button>
      </div>

      <div className="conteudo">
        <h2>Lista de Tarefas</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="form-tarefa">
          <input
            ref={tituloRef}
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Categoria</option>
            <option value="Escola">Escola</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Pessoal">Pessoal</option>
          </select>
          <input type="submit" value={idEditando ? 'Atualizar' : 'Adicionar'} />
        </form>

        <button className="botao-reset" onClick={handleClear}>
          Resetar Lista
        </button>

        <ul>
          {tarefasFiltradas.map((item, index) => (
            <li key={item.id} className={item.status ? 'concluida' : ''}>
              <button className="concluir" onClick={() => handleToggle(item.id)}>
                {item.status ? '☑' : '☐'}
              </button>

              <div className="info-tarefa">
                <span className="titulo">{item.titulo}</span>
                <span className="descricao">{item.descricao}</span>
                <span className="categoria">{item.categoria}</span>
              </div>

              <div className="acoes">
                <button className="editar" onClick={() => handleEditar(item.id)}>✎</button>
                <button className="apagar" onClick={() => handleApagar(item.id)}>🗑</button>
                <button className="ordenar" onClick={() => handleMove(item.id, 'subir')} disabled={index === 0}>↑</button>
                <button className="ordenar" onClick={() => handleMove(item.id, 'descer')} disabled={index === lista.length - 1}>↓</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
