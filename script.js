
const lista = document.getElementById('lista')
const apiUrl = 'http://localhost:3000/presidentes';

// modo edicao e id edicao
let edicao = false;
let idEdicao = 0;

// Pega os dados que o usuario digita no input (Elementos)
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

const submitForm = async (event) => {
  
    event.preventDefault();
    const presidente = {
        nome: nome.value,
        partido: partido.value,
        img: img.value,
        ano: parseFloat(ano.value),
        governo: governo.value,
        descricao: descricao.value
    }
  

    if(edicao) {
        putPresidente(presidente, idEdicao);
    } else {
        createPresidente(presidente);
    }

    clearFields();
    lista.innerHTML = '';
}

const createPresidente = async(presidente) => {
   
    const request = new Request(`${apiUrl}/add`, {
        method: 'POST',
        body: JSON.stringify(presidente),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })

  
    const response = await fetch(request);
    const result = await response.json();
    alert(result.message)
    getPresidentes();

}

const putPresidentes = async(presidente, id) => {
    const request = new Request(`${apiUrl}/edit/${id}`, {
        method:  'PUT',
        body: JSON.stringify(presidente),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })


    const response = await fetch(request);
    const result = await response.json();
   
    alert(result.message)
    edicao = false;
    idEdicao = 0;
    getPresidentes();
}


const deletePresidentes = async (id) => {
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
    edicao = true;
    idEdicao = id;

    const presidente= await getPresidenteById(id);
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
