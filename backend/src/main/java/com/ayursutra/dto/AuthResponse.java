package com.ayursutra.dto;

import com.ayursutra.model.enums.Role;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private Role role;

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private AuthResponse authResponse = new AuthResponse();
        public AuthResponseBuilder token(String token) { authResponse.token = token; return this; }
        public AuthResponseBuilder userId(Long userId) { authResponse.userId = userId; return this; }
        public AuthResponseBuilder name(String name) { authResponse.name = name; return this; }
        public AuthResponseBuilder email(String email) { authResponse.email = email; return this; }
        public AuthResponseBuilder role(Role role) { authResponse.role = role; return this; }
        public AuthResponse build() { return authResponse; }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
