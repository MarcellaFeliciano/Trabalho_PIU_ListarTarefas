import './ListarTarefas.css';
import { useState } from 'react';

export default function Listar() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [idEditando, setIdEditando] = useState(null);
  const [lista, setLista] = useState([]);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [filtro, setFiltro] = useState('Todos');

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
      setLista(
        lista.map((item) =>
          item.id === idEditando ? { ...item, titulo, descricao, categoria } : item
        )
      );
      setIdEditando(null);
    } else {
      setLista([...lista, novaTarefa]);
    }

    setTitulo('');
    setDescricao('');
    setCategoria('');
  };

  const handleToggle = (id) => {
    setLista(
      lista.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleApagar = (id) => {
  const confirmacao = window.confirm('Tem certeza que deseja apagar esta tarefa?');
  if (confirmacao) {
    setLista(lista.filter((item) => item.id !== id));
  }
};

  const handleEditar = (id) => {
    const item = lista.find((item) => item.id === id);
    if (item) {
      setTitulo(item.titulo);
      setDescricao(item.descricao);
      setCategoria(item.categoria);
      setIdEditando(id);
    }
  };

  const handleMove = (id, direcao) => {
    const indice = lista.findIndex((item) => item.id === id);
    if (
      (indice === 0 && direcao === 'subir') ||
      (indice === lista.length - 1 && direcao === 'descer')
    )
      return;

    const novaLista = [...lista];
    const itemMovido = novaLista.splice(indice, 1)[0];
    const novoIndice = direcao === 'subir' ? indice - 1 : indice + 1;
    novaLista.splice(novoIndice, 0, itemMovido);
    setLista(novaLista);
  };

  const handleClear = () => {
  const confirmacao = window.confirm('Tem certeza que deseja resetar toda a lista?');
  if (confirmacao) {
    setLista([]);
  }
};

  const tarefasFiltradas =
    filtro === 'Todos'
      ? lista
      : lista.filter((t) => t.categoria === filtro);

  return (
    <div className={`container ${temaEscuro ? 'tema-escuro' : 'tema-claro'}`}>
      <div className="sidebar">
        <h3>Categorias</h3>
        <ul>
          {['Todos', 'Escola', 'Trabalho', 'Pessoal'].map((cat) => (
            <li
              key={cat}
              className={filtro === cat ? 'ativo' : ''}
              onClick={() => setFiltro(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
        <button className="botao-tema" onClick={() => setTemaEscuro(!temaEscuro)}>
          Alternar Tema
        </button>
      </div>

      <div className="conteudo">
        <h2>Lista de Tarefas</h2>
        <form onSubmit={handleSubmit} className="form-tarefa">
          <input
            type="text"
            onChange={(e) => setTitulo(e.target.value)}
            value={titulo}
            placeholder="Título"
          />
          <input
            type="text"
            onChange={(e) => setDescricao(e.target.value)}
            value={descricao}
            placeholder="Descrição"
          />
          <select
            onChange={(e) => setCategoria(e.target.value)}
            value={categoria}
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
                <button className="editar" onClick={() => handleEditar(item.id)}>
                  ✎
                </button>
                <button className="apagar" onClick={() => handleApagar(item.id)}>
                  🗑
                </button>
                <button
                  className="ordenar"
                  onClick={() => handleMove(item.id, 'subir')}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className="ordenar"
                  onClick={() => handleMove(item.id, 'descer')}
                  disabled={index === lista.length - 1}
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
