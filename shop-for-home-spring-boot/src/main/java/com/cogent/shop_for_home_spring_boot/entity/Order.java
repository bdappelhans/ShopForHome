package com.cogent.shop_for_home_spring_boot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "date_time")
    private LocalDateTime orderDate;

    @OneToOne
    @JsonIgnoreProperties("users")
    private Coupon coupon;

    @Column(name = "initial_total")
    private BigDecimal initialTotal;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "final_total")
    private BigDecimal finalTotal;

    @Column(name = "is_placed")
    private Boolean isPlaced;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Coupon getCoupon() {
        return coupon;
    }

    public void setCoupon(Coupon coupon) {
        this.coupon = coupon;
    }

    public BigDecimal getInitialTotal() {
        return initialTotal;
    }

    public void setInitialTotal(BigDecimal initialTotal) {
        this.initialTotal = initialTotal;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getFinalTotal() {
        return finalTotal;
    }

    public void setFinalTotal(BigDecimal finalTotal) {
        this.finalTotal = finalTotal;
    }

    public Boolean getPlaced() {
        return isPlaced;
    }

    public void setPlaced(Boolean placed) {
        isPlaced = placed;
    }
}
