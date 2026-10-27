package dev.ffclmt.mvpestoque.repositories;

import dev.ffclmt.mvpestoque.entities.Pedido;
import dev.ffclmt.mvpestoque.entities.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // Fila de liberação
    List<Pedido> findByStatus(StatusPedido status);
}
