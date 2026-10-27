package dev.ffclmt.mvpestoque.controllers;


import dev.ffclmt.mvpestoque.entities.Pedido;
import dev.ffclmt.mvpestoque.entities.Produto;
import dev.ffclmt.mvpestoque.services.OperacoesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/operacoes")
public class DashboardOperacoesController {

    private final OperacoesService operacoesService;

    public DashboardOperacoesController(OperacoesService operacoesService) {
        this.operacoesService = operacoesService;
    }

    @GetMapping("/estoque-baixo")
    public ResponseEntity<List<Produto>> getAlertasEstoque() {
        return ResponseEntity.ok(operacoesService.obterAlertasEstoqueMinimo());
    }

    @GetMapping("/pedidos-pendentes")
    public ResponseEntity<List<Pedido>> getPedidosPendentes() {
        return ResponseEntity.ok(operacoesService.listarPedidosPendentes());
    }

    @PostMapping("/pedidos/{id}/aprovar")
    public ResponseEntity<Void> aprovarPedido(@PathVariable Long id) {
        operacoesService.processarPedido(id, true);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pedidos/{id}/rejeitar")
    public ResponseEntity<Void> rejeitarPedido(@PathVariable Long id) {
        operacoesService.processarPedido(id, false);
        return ResponseEntity.ok().build();
    }
}
