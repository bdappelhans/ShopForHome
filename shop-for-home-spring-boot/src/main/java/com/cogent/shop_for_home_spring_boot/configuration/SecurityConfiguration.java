package com.cogent.shop_for_home_spring_boot.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Constructor-based dependency injection for JwtAuthenticationFilter and AuthenticationProvider
    public SecurityConfiguration(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configure HTTP security for the application
        http
                .csrf().disable()  // Disable CSRF protection (typically used for REST APIs)
                .cors().and()  // Apply CORS configuration
                .authorizeHttpRequests()
                .requestMatchers("/auth/**").permitAll()  // Allow unauthenticated access to /auth/** endpoints
                .anyRequest().authenticated()  // Require authentication for all other requests
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Use stateless sessions (no session storage)
                .and()
                .authenticationProvider(authenticationProvider)  // Set custom AuthenticationProvider
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);  // Add custom JWT filter before default authentication filter

        return http.build();  // Build and return the SecurityFilterChain
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        // Configure CORS settings
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));  // Allow requests from the specified origin
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));  // Allow specific HTTP methods
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));  // Allow specific headers
        configuration.setAllowCredentials(true);  // Allow credentials (cookies, authorization headers, etc.)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);  // Apply CORS configuration to all endpoints
        return source;  // Return the CORS configuration source
    }
}

