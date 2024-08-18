package com.cogent.shop_for_home_spring_boot.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_products")
public class OrderProduct {

    @EmbeddedId
    private OrderProductId id;

    @Column(name = "quantity")
    private Integer quantity;

    // Constructors
    public OrderProduct() {}

    public OrderProduct(OrderProductId id, Integer quantity) {
        this.id = id;
        this.quantity = quantity;
    }

    // Getters and Setters
    public OrderProductId getId() {
        return id;
    }

    public void setId(OrderProductId id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}