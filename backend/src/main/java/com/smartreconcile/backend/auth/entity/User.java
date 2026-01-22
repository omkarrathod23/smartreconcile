package com.smartreconcile.backend.auth.entity;

import com.smartreconcile.backend.model.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
public class User extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank
    @Size(max = 255)
    private String passwordHash;

    @NotBlank
    @Size(max = 100)
    private String fullName;

    private Boolean isActive = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    public User() {
    }

    public User(String email, String passwordHash, String fullName) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
    }
}
