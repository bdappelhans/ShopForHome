package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.Product;
import com.cogent.shop_for_home_spring_boot.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    @Override
    public Product getProductById(Long id) {
        Product foundProduct = productRepository.findById(id).orElse(null);

        if (foundProduct == null) {
            System.out.println("Product " + id + " not found");
        }
        return foundProduct;
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        Product foundProduct = getProductById(product.getId());
        if (foundProduct == null) {
            return null;
        } else {
            return productRepository.save(product);
        }
    }
}
