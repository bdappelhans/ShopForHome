package com.cogent.shop_for_home_spring_boot.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    @Value("${security.jwt.secret-key}")
    private String secretKey;  // Secret key for signing JWT tokens, read from configuration

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;  // Token expiration time in milliseconds, read from configuration

    // Extracts the username from the JWT token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extracts a specific claim from the JWT token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);  // Get all claims from the token
        return claimsResolver.apply(claims);  // Apply the function to extract the specific claim
    }

    // Generates a JWT token with default claims
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);  // Call overloaded method with empty claims map
    }

    // Generates a JWT token with additional claims
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);  // Build the token with claims and expiration
    }

    // Returns the token expiration time
    public long getExpirationTime() {
        return jwtExpiration;
    }

    // Builds a JWT token with the given claims, user details, and expiration time
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)  // Set additional claims
                .setSubject(userDetails.getUsername())  // Set the subject (username)
                .setIssuedAt(new Date(System.currentTimeMillis()))  // Set the issued date
                .setExpiration(new Date(System.currentTimeMillis() + expiration))  // Set expiration date
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)  // Sign the token with the secret key
                .compact();  // Generate the compact, URL-safe JWT token string
    }

    // Checks if the token is valid based on username and expiration
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);  // Extract the username from the token
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);  // Validate the token
    }

    // Checks if the token is expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());  // Compare token expiration date with current date
    }

    // Extracts the expiration date from the token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);  // Extract the expiration claim
    }

    // Extracts all claims from the token
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())  // Set the signing key for token parsing
                .build()
                .parseClaimsJws(token)  // Parse the token
                .getBody();  // Get the claims from the parsed token
    }

    // Gets the signing key from the secret key
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);  // Decode the secret key from base64
        return Keys.hmacShaKeyFor(keyBytes);  // Generate a key for HMAC SHA signature
    }
}
