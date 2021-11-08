// buscar o elemento no html da minha lista onde irei inserir as vagas
const lista = document.getElementById('lista')

// atribuindo a endpoint da api do backend em um constante
const apiUrl = 'http://localhost:3000/presidentes';

// modo edicao e id edicao
let edicao = false;
let idEdicao = 0;

// pegar os dados que o usuario digita no input (Elementos)
let nome = document.getElementById('nome');
let partido = document.getElementById('partido');
let img = document.getElementById('img');
let ano = document.getElementById('ano');
let governo = document.getElementById('governo');
let descricao = document.getElementById('descricao');


const getPresidentes= async () => {
  
    const response = await fetch(apiUrl)

    const presidentes = await response.json();

    console.log(presidentes);

    presidentes.map((presidente) => {
        lista.insertAdjacentHTML('beforeend', `
        <div class="col">
            <div class="card">
            <img src="${presidente.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${presidente.nome} - ${presidente.partido}</h5>
                <span class="badge bg-primary">${presidente.governo}</span>
                <p class="card-text">R$ ${presidente.ano}</p>
                <p class="card-text">${presidente.descricao}</p>
                <div>
                    <button class="btn btn-primary" onclick="editPresidente('${presidente.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deletePresidente('${presidente.id}')">Excluir</button>
                </div>
            </div>
            </div>
        </div>
        `)
    })
}

// [POST] envia uma presidente para o backend para ser cadastrada

const submitForm = async (event) => {
    // previnir que o navegador atualiza a pagina por causa o evento de submit
    event.preventDefault();

    // Estamos construindo um objeto com os valores que estamos pegando no input.
    const presidente = {
        nome: nome.value,
        partido: partido.value,
        img: img.value,
        ano: parseFloat(ano.value),
        governo: governo.value,
        descricao: descricao.value
    }
    // é o objeto preenchido com os valores digitados no input

    if(edicao) {
        putPresidente(presidente, idEdicao);
    } else {
        createPresidente(presidente);
    }

    clearFields();
    lista.innerHTML = '';
}

const createPresidente = async(presidente) => {
    // requisicao para ser enviada para o backend.
    const request = new Request(`${apiUrl}/add`, {
        method: 'POST',
        body: JSON.stringify(presidente),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);
    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
    alert(result.message)
    // cadastro com sucesso.
    getPresidentes();

}

const putPresidentes = async(presidente, id) => {
    // estou construindo a requisicao para ser enviada para o backend.
    const request = new Request(`${apiUrl}/edit/${id}`, {
        method:  'PUT',
        body: JSON.stringify(presidente),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

    // chamamos a funcao fetch de acordo com as nossa configuracaoes de requisicao.
    const response = await fetch(request);

    const result = await response.json();
    // pego o objeto que vem do backend e exibo a msg de sucesso em um alerta.
    alert(result.message)
    edicao = false;
    idEdicao = 0;
    getPresidentes();
}

// [DELETE] funcao que exclui de acordo com o seu id
const deletePresidentes = async (id) => {
    // construir a requiscao de delete
    const request = new Request(`${apiUrl}/delete/${id}`, {
        method: 'DELETE'
    })

    const response = await fetch(request);
    const result = await response.json();

    alert(result.message);
    
    lista.innerHTML = '';
    getPresidentes();
}


const getPresidenteById = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    return await response.json();
}

const editPresidente= async (id) => {
    // habilitando o modo de edicao e enviando o id para variavel global de edicao.
    edicao = true;
    idEdicao = id;

    const presidente= await getPresidenteById(id);

    //preencher os campos.
    nome.value = presidente.nome;
    partido.value =  presidente.partido;
    img.value = presidente.img;
    ano.value = presidente.ano;
    govenro.value = presidente.governo;
    descricao.value = presidente.descricao;
}


const clearFields = () => {
    nome.value = '';
    partido.value = '';
    img.value = '';
    ano.value = '';
    governo.value = '';
    descricao.value = '';
}

getPresidentes();