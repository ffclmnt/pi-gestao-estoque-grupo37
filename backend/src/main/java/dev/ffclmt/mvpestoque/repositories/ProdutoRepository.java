package dev.ffclmt.mvpestoque.repositories;

import dev.ffclmt.mvpestoque.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Alerta de estoque mínimo para a visão geral
    @Query("SELECT p FROM Produto p WHERE p.quantidadeEstoque <= p.estoqueMinimo")
    List<Produto> findProdutosComEstoqueBaixo();
}