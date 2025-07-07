import './ListarTarefas.css'
import { useState } from 'react'

export default function Listar() {

    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [categoria, setCategoria] = useState('')
    const [idEditando, setIdEditando] = useState(null)

    const [lista, setLista] = useState([])

        const handleSubmit = (e) => {
            e.preventDefault()
            if (!titulo){
                return
            }

            //tarefa agora passa a ser um objeto. Com isso adiconamos o status e o seu id (função para gerar aleatória)
            const novaTarefa = {
                id: Math.floor(Math.random()*10000), 
                titulo: titulo,
                descricao: descricao,
                categoria: categoria,
                status: false
            }

            if (idEditando) { // Se um item está sendo editado
                setLista(lista.map(item => item.id === idEditando ? { ...item, titulo, descricao, categoria } : item));
                setIdEditando(null); // Reseta o ID de edição
            } else {
                setLista([...lista, novaTarefa]);
            }

            setTitulo('')
            setDescricao('')
            setCategoria('')

        }

        //função para alterar o status da tarefa. Aqui optamos por trabalhar com dois estados: concluída ou não.
        const handleToggle = (id) => {
        setLista(lista.map(item => 
            item.id === id ? { ...item, status: !item.status } : item
        ))
        }

        const handleApagar = (id) => {
            const novaLista = [];
            for (const item of lista) {
                if (item.id !== id) {
                    novaLista.push(item);
                }
            }
            setLista(novaLista);
        }

        const handleEditar = (id) => {
            const item = lista.find(item => item.id === id);
            if (item) {
                setTitulo(item.titulo);
                setDescricao(item.descricao);
                setCategoria(item.categoria);
                setIdEditando(id); // Define o ID do item a ser editado
            }
    };

        //função mais 'complexa'. Aqui vamo reposicionar a tarefa no array lista de forma incremental.
        const handleMove = (id, direcao) => {

            //o método finIndex retorna o index do elemento que satisfaz alguma condição. Aqui estamos utilizando para
            //retornar o index do elemento que tem o id igual ao que foi passado para a função handleMove.
            //Perceba que aqui o index é diferente do id.
            
            const indice = lista.findIndex(item => item.id === id)

            //condições extraordinárias

            if((indice === 0 && direcao === 'subir') || (indice === lista.length -1 && direcao === 'descer')){
                return;
            }

            const novaLista = [...lista]; //copia da lista original
            //splice modifica array, removendo ou inserindo elemento. Ele retorna o array modificado. Aqui está sendo removido 1 elementos na posição indice.
            //esse elemento removido é a saída de splice em forma de um novo array. A notação [0] é utilizada para indicar o primeiro elemento do array de retorno.
            //Por fim, itemMovido irá armazenar o elemento que precisa ser movido.
            const itemMovido = novaLista.splice(indice, 1)[0]

            //veririca em que sentido deve ser movido o item e faz o incremento ou decremento do seu indice.
            const novoIndice = direcao === 'subir' ? indice -1 : indice +1;

            //reposicionamento do elemento. Na posição novoIndice, remove-se 0 elementos e adiciona itemMovido
            novaLista.splice(novoIndice, 0, itemMovido)

            setLista(novaLista)
        }

        const handleClear = () => {
            setLista([])
        }


    return(
        <div>
            <h2>Lista de Tarefas</h2>

            <form onSubmit={handleSubmit}>

                <label>
                    <input type="text" onChange={(e) => setTitulo(e.target.value)} value={titulo} placeholder='Título'/>
                </label>
                <label>
                    <input type="text" onChange={(e) => setDescricao(e.target.value)} value={descricao} placeholder='Descrição'/>
                </label>
                <label>
                    <select onChange={(e) => setCategoria(e.target.value)} value={categoria}>
                        <option value="">Selecione uma categoria</option>
                        <option value="Escola">Escola</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Pessoal">Pessoal</option>
                    </select>
                </label>
                
                <input type="submit" value={idEditando ? "Atualizar" : "Adicionar"} />
            </form>

            <button onClick={handleClear}>Reset</button>

            <ul>
               {lista.map((item, index) => 
                <li key={item.id} className={item.status ? 'concluida' : ''}>

                    <button onClick={() => handleToggle(item.id)}>{item.status ? 'Desmarcar' : 'Concluir'}</button>
                
                    

                    <span>{item.titulo}</span>
                    <span>{item.categoria}</span>

                    <button onClick={() => handleEditar(item.id)}>Editar</button>
                    <button onClick={() => handleApagar(item.id)}>Apagar</button>
            

                    <div className="controles-ordem">
                            <button 
                                onClick={() => handleMove(item.id, 'subir')} 
                                disabled={index === 0} // Desabilita o botão se for o primeiro item
                                title="Mover para cima"
                            >
                                ↑
                            </button>
                            <button 
                                onClick={() => handleMove(item.id, 'descer')} 
                                disabled={index === lista.length - 1} // Desabilita se for o último
                                title="Mover para baixo"
                            >
                                ↓
                            </button>
                    </div>
                    </li>
                
               )}
            </ul>
        </div>

    )

}