package com.cogent.shop_for_home_spring_boot.repository;

import com.cogent.shop_for_home_spring_boot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query method to find users who are not admins
    List<User> findByIsAdminFalse();

    // Custom query method to find users who are not admins and who are active
    List<User> findByIsAdminFalseAndIsActiveTrue();

    // Custom query method to find a user by email
    Optional<User> findByEmail(String email);
}
