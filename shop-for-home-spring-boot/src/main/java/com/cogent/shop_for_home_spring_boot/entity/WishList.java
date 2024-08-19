package com.cogent.shop_for_home_spring_boot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "wish_list")
public class WishList {

    @EmbeddedId
    private WishListId id;

    public WishList() {
    }

    public WishList(WishListId id) {
        this.id = id;
    }

    public WishListId getId() {
        return id;
    }

    public void setId(WishListId id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WishList wishList = (WishList) o;
        return Objects.equals(id, wishList.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "WishList{" +
                "id=" + id +
                '}';
    }
}
