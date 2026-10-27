package dev.ffclmt.mvpestoque.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String sku;
    private Integer quantidadeEstoque;
    private Integer estoqueMinimo;
}