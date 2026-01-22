package com.smartreconcile.backend.auth.repository;

import com.smartreconcile.backend.auth.entity.ERole;
import com.smartreconcile.backend.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
