
import './style.css'
import './mobile.css'

document.querySelector('#app').innerHTML = `
  <header>
    <h1>Gestor de Estoque</h1>
    <p>Painel de Operações</p>
  </header>

  <main>
    <section>
      <h2>Bem-vindo, Carlos!</h2>
      <p>Acompanhe os pedidos e a situação do estoque.</p>
    </section>

<section>
  <h2>Resumo das operações</h2>

  <div>
    <h3>Pedidos pendentes</h3>
    <p id="total-pedidos">--</p>
  </div>

  <div>
    <h3>Produtos com estoque baixo</h3>
    <p id="total-estoque-baixo">--</p>
  </div>
</section>

<section class="alertas-estoque">
  <h2>Alertas de estoque baixo</h2>

  <div id="lista-estoque-baixo">
    <p>Carregando produtos...</p>
  </div>
</section>

    <section>
      <h2>Pedidos aguardando aprovação</h2>

      <div class="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Produtos</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody id="lista-pedidos">
            <tr>
              <td colspan="5">
                Aguardando conexão com a API...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </main>
`

async function carregarPedidos() {
  const tabela = document.querySelector('#lista-pedidos')

  try {
    const resposta = await fetch('/api/operacoes/pedidos-pendentes')

    if (!resposta.ok) {
      throw new Error('Não foi possível consultar os pedidos.')
    }

    const pedidos = await resposta.json()

    document.querySelector('#total-pedidos').textContent = pedidos.length

    if (pedidos.length === 0) {
  tabela.innerHTML = '<tr><td colspan="5">Nenhum pedido pendente.</td></tr>'
  return
}

tabela.innerHTML = pedidos.map(pedido => {
  const produtos = pedido.itens
    .map(item => `${item.produto.nome} (${item.quantidade} un.)`)
    .join(', ')

  const data = new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')

  return `
    <tr>
      <td>#${pedido.id}</td>
      <td>${produtos}</td>
      <td>${data}</td>
      <td>${pedido.status}</td>
      <td>
  <button class="btn-aprovar" data-id="${pedido.id}">
    Aprovar
  </button>
  <button class="btn-rejeitar" data-id="${pedido.id}">
    Rejeitar
  </button>
</td>
    </tr>
  `
}).join('')
  } catch (erro) {
    console.error('Erro ao carregar pedidos:', erro)
    tabela.innerHTML = '<tr><td colspan="5">Erro ao carregar pedidos.</td></tr>'
  }
}

carregarPedidos()

async function aprovarPedido(id) {
  const confirmado = confirm(`Deseja realmente aprovar o pedido #${id}?`)

  if (!confirmado) {
    return
  }

  try {
    const resposta = await fetch(`/api/operacoes/pedidos/${id}/aprovar`, {
      method: 'POST',
    })

    if (!resposta.ok) {
      throw new Error('Não foi possível aprovar o pedido.')
    }

    alert(`Pedido #${id} aprovado com sucesso!`)
    await carregarPedidos()
  } catch (erro) {
    console.error('Erro ao aprovar pedido:', erro)
    alert('Não foi possível aprovar o pedido. Verifique o estoque disponível.')
  }
}

document.querySelector('#lista-pedidos').addEventListener('click', (evento) => {
  const botaoAprovar = evento.target.closest('.btn-aprovar')
  const botaoRejeitar = evento.target.closest('.btn-rejeitar')

  if (botaoAprovar) {
    aprovarPedido(botaoAprovar.dataset.id)
  } else if (botaoRejeitar) {
    rejeitarPedido(botaoRejeitar.dataset.id)
  }
})

async function rejeitarPedido(id) {
  const confirmado = confirm(`Deseja realmente rejeitar o pedido #${id}?`)

  if (!confirmado) {
    return
  }

  try {
    const resposta = await fetch(`/api/operacoes/pedidos/${id}/rejeitar`, {
      method: 'POST',
    })

    if (!resposta.ok) {
      throw new Error('Não foi possível rejeitar o pedido.')
    }

    alert(`Pedido #${id} rejeitado com sucesso!`)
    await carregarPedidos()
  } catch (erro) {
    console.error('Erro ao rejeitar pedido:', erro)
    alert('Não foi possível rejeitar o pedido.')
  }
}

async function carregarEstoqueBaixo() {
  try {
    const resposta = await fetch('/api/operacoes/estoque-baixo')

    if (!resposta.ok) {
      throw new Error('Não foi possível consultar o estoque.')
    }

    const produtos = await resposta.json()

    document.querySelector('#total-estoque-baixo').textContent = produtos.length
    const lista = document.querySelector('#lista-estoque-baixo')

if (produtos.length === 0) {
  lista.innerHTML = '<p>Nenhum produto com estoque baixo.</p>'
} else {
  lista.innerHTML = produtos.map(produto => `
    <div class="alerta-produto">
      <strong>${produto.nome}</strong>
      <span>
        Estoque atual: ${produto.quantidadeEstoque} |
        Estoque mínimo: ${produto.estoqueMinimo}
      </span>
    </div>
  `).join('')
}

  } catch (erro) {
    console.error('Erro ao carregar estoque baixo:', erro)
    document.querySelector('#total-estoque-baixo').textContent = 'Erro'
  }
}

carregarEstoqueBaixo()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
}
