let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

const campoTarefa = document.getElementById('campo-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoAdicionar = document.getElementById('botao-adicionar');
const botaoTema = document.getElementById('botao-alternar-tema');

function criarImgCaindo() {
    const container = document.getElementById('fundo-img');
    if (!container) return;

    const imagens = [
        'img/asuka.png',
        'img/penpen.png',
        'img/rei.png',
        'img/shinji.png'
    ];
    
    const imagemElemento = document.createElement('img');
    imagemElemento.classList.add('img-caindo');
    
    imagemElemento.src = imagens[Math.floor(Math.random() * imagens.length)];
    imagemElemento.style.left = Math.random() * 100 + 'vw';

    const tamanho = Math.random() * 40 + 40;
    imagemElemento.style.width = tamanho + 'px';
    imagemElemento.style.height = 'auto';

    const duracao = Math.random() * 4 + 3;
    imagemElemento.style.animationDuration = duracao + 's';

    container.appendChild(imagemElemento);

    setTimeout(() => {
        imagemElemento.remove();
    }, duracao * 1000);
}

setInterval(criarImgCaindo, 400);

function salvarERenderizar() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderizarTarefas();
}

function adicionarTarefa() {
    const texto = campoTarefa.value.trim();
    if (!texto) return alert('Digite uma tarefa.');

    tarefas.push({
        descricao: texto,
        observacao: '',
        concluida: false,
        pergaminhoAberto: false,
        editandoObs: false
    });

    campoTarefa.value = '';
    campoTarefa.focus();
    salvarERenderizar();
}

function mostrarPopupRecompensa() {
    const popup = document.getElementById('popup-conquista');
    const audio = document.getElementById('popup-audio');

    if (!popup) return;

    popup.classList.remove('oculto');

    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Reprodução de áudio aguardando interação:", e));
    }

    setTimeout(() => {
        popup.classList.add('oculto');
    }, 3000);
}

function alternarConclusao(index) {
    tarefas[index].concluida = !tarefas[index].concluida;   
    if (tarefas[index].concluida) {
        mostrarPopupRecompensa();
    }

    salvarERenderizar();
}

function excluirTarefa(index) {
    tarefas.splice(index, 1);
    salvarERenderizar();
}

function editarTitulo(index) {
    const novo = prompt('Editar o nome da tarefa:', tarefas[index].descricao);
    if (novo !== null && novo.trim() !== '') {
        tarefas[index].descricao = novo.trim();
        salvarERenderizar();
    }
}

function alternarPergaminho(index) {
    tarefas[index].pergaminhoAberto = !tarefas[index].pergaminhoAberto;
    renderizarTarefas();
}

function alternarEdicaoObs(index) {
    tarefas[index].editandoObs = !tarefas[index].editandoObs;
    renderizarTarefas();
}

function salvarObservacao(index) {
    const textarea = document.getElementById(`obs-input-${index}`);
    if (textarea) {
        tarefas[index].observacao = textarea.value.trim();
        tarefas[index].editandoObs = false;
        salvarERenderizar();
    }
}

function renderizarTarefas() {
    listaTarefas.innerHTML = '';

    tarefas.forEach((tarefa, index) => {
        const li = document.createElement('li');
        li.className = `item-tarefa ${tarefa.concluida ? 'concluido' : ''}`;

        let conteudoPergaminho = '';
        if (tarefa.editandoObs) {
            conteudoPergaminho = `
                <div class="pergaminho-editor">
                    <textarea id="obs-input-${index}" class="pergaminho-textarea" placeholder="Escreva suas observações aqui...">${tarefa.observacao}</textarea>
                    <div class="pergaminho-acoes">
                        <button class="btn-pergaminho-salvar" onclick="salvarObservacao(${index})">Salvar</button>
                    </div>
                </div>
            `;
        } else {
            const textoObs = tarefa.observacao 
                ? tarefa.observacao 
                : '<em>Nenhuma observação adicionada ainda. Clicar no lápis para editar.</em>';
            
            conteudoPergaminho = `
                <div class="pergaminho-texto">${textoObs}</div>
            `;
        }

        li.innerHTML = `
            <div class="conteudo-tarefa">
                <span class="texto-tarefa">${tarefa.descricao}</span>
                <div class="acoes-tarefa">
                    <button class="botao-acao" onclick="alternarConclusao(${index})" title="Concluir">
                        <i class="fa-${tarefa.concluida ? 'solid' : 'regular'} fa-circle-check"></i>
                    </button>
                    <button class="botao-acao editar" onclick="editarTitulo(${index})" title="Editar Nome">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="botao-acao excluir" onclick="excluirTarefa(${index})" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="area-botao-pergaminho">
                <button class="botao-pergaminho" onclick="alternarPergaminho(${index})">
                    <i class="fa-solid fa-scroll"></i> 
                    ${tarefa.pergaminhoAberto ? 'Fechar Observações' : 'Observações'}
                </button>
            </div>

            <div class="pergaminho ${tarefa.pergaminhoAberto ? 'aberto' : ''}">
                <div class="pergaminho-cabecalho">
                    <span><i class="fa-solid fa-scroll"></i> Pergaminho de Notas</span>
                    <button class="botao-acao editar" onclick="alternarEdicaoObs(${index})" title="Editar Nota">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                </div>
                ${conteudoPergaminho}
            </div>
        `;

        listaTarefas.appendChild(li);
    });

    const qtd = tarefas.length;
    contadorTarefas.textContent = `${qtd} ${qtd === 1 ? 'tarefa' : 'tarefas'} na lista`;
}

// Eventos
botaoAdicionar.addEventListener('click', adicionarTarefa);
campoTarefa.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') adicionarTarefa();
});

botaoTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');
    const icone = botaoTema.querySelector('i');
    const ehEscuro = document.body.classList.contains('modo-escuro');
    icone.className = `fa-solid fa-${ehEscuro ? 'sun' : 'moon'}`;
});

// Inicialização
renderizarTarefas();