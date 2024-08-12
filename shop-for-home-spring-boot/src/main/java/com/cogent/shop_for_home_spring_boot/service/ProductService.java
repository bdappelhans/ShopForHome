package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.Product;

import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();

    List<Product> getAllActiveProducts();

    Product getProductById(Long id);

    Product createProduct(Product product);

    Product updateProduct(Product product);
}
