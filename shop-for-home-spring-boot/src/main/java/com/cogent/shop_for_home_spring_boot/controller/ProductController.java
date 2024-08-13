package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.entity.Product;
import com.cogent.shop_for_home_spring_boot.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/active")
    public List<Product> getActiveProducts() {
        return productService.getAllActiveProducts();
    }

    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable Long productId) {
        return productService.getProductById(productId);
    }

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        product.setId(0L);
        return productService.createProduct(product);
    }

    @PutMapping("/update")
    public Product updateProduct(@RequestBody Product product) {
        return productService.updateProduct(product);
    }
}
