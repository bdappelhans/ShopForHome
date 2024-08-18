package com.cogent.shop_for_home_spring_boot;

import com.cogent.shop_for_home_spring_boot.entity.Order;
import com.cogent.shop_for_home_spring_boot.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShopForHomeSpringBootApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopForHomeSpringBootApplication.class, args);
	}

}
