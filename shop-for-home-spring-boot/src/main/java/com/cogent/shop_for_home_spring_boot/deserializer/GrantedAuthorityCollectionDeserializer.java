package com.cogent.shop_for_home_spring_boot.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GrantedAuthorityCollectionDeserializer extends JsonDeserializer<List<GrantedAuthority>> {

    @Override
    public List<GrantedAuthority> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        List<GrantedAuthority> authorities = new ArrayList<>();
        JsonNode node = p.getCodec().readTree(p);
        if (node.isArray()) {
            for (JsonNode elem : node) {
                String authority = elem.asText();
                if (authority == null || authority.isEmpty()) {
                    throw new IllegalArgumentException("A granted authority textual representation is required");
                }
                authorities.add(new SimpleGrantedAuthority(authority));
            }
        }
        return authorities;
    }
}
