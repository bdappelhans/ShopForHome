package com.cogent.shop_for_home_spring_boot.configuration;

import com.cogent.shop_for_home_spring_boot.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService,
            HandlerExceptionResolver handlerExceptionResolver
    ) {
        this.jwtService = jwtService;  // Initialize JWT service for token operations
        this.userDetailsService = userDetailsService;  // Initialize user details service for loading user data
        this.handlerExceptionResolver = handlerExceptionResolver;  // Initialize exception resolver for handling errors
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Extract the 'Authorization' header from the request
        final String authHeader = request.getHeader("Authorization");

        // Check if the 'Authorization' header is missing or doesn't start with 'Bearer '
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Proceed with the next filter in the chain if no valid JWT is present
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract the JWT token from the 'Authorization' header
            final String jwt = authHeader.substring(7);
            // Extract the username (email) from the JWT
            final String userEmail = jwtService.extractUsername(jwt);

            // Get the current authentication object from the security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // If the userEmail is not null and there is no existing authentication
            if (userEmail != null && authentication == null) {
                // Load user details using the user email
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Validate the JWT token against the loaded user details
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Create an authentication token with user details and authorities
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // Set additional details for the authentication token
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Set the authentication token in the security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            // Proceed with the next filter in the chain
            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            // Handle exceptions by resolving them with the handler exception resolver
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}

