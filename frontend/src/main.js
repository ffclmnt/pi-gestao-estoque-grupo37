
import './style.css'

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
        <p>--</p>
      </div>

      <div>
        <h3>Produtos com estoque baixo</h3>
        <p>--</p>
      </div>
    </section>

    <section>
      <h2>Pedidos aguardando aprovação</h2>

      <div class="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
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