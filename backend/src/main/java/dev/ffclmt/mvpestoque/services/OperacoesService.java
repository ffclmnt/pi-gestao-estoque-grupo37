package dev.ffclmt.mvpestoque.services;

import dev.ffclmt.mvpestoque.entities.*;
import dev.ffclmt.mvpestoque.repositories.*;
import dev.ffclmt.mvpestoque.entities.Pedido;
import dev.ffclmt.mvpestoque.entities.Produto;
import dev.ffclmt.mvpestoque.entities.StatusPedido;
import dev.ffclmt.mvpestoque.repositories.PedidoRepository;
import dev.ffclmt.mvpestoque.repositories.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class OperacoesService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public OperacoesService(PedidoRepository pedidoRepository, ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> obterAlertasEstoqueMinimo() {
        return produtoRepository.findProdutosComEstoqueBaixo();
    }

    public List<Pedido> listarPedidosPendentes() {
        return pedidoRepository.findByStatus(StatusPedido.PENDENTE);
    }

    @Transactional
    public void processarPedido(Long pedidoId, boolean aprovar) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (!pedido.getStatus().equals(StatusPedido.PENDENTE)) {
            throw new IllegalStateException("Apenas pedidos pendentes podem ser processados.");
        }

        if (aprovar) {
            for (ItemPedido item : pedido.getItens()) {
                Produto produto = item.getProduto();
                if (produto.getQuantidadeEstoque() < item.getQuantidade()) {
                    throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
                }
                produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - item.getQuantidade());
                produtoRepository.save(produto);
            }
            pedido.setStatus(StatusPedido.APROVADO);
        } else {
            pedido.setStatus(StatusPedido.REJEITADO);
        }

        pedidoRepository.save(pedido);
    }
}
