package com.smartreconcile.backend.auth.service;

import com.smartreconcile.backend.auth.dto.JwtResponse;
import com.smartreconcile.backend.auth.dto.LoginRequest;
import com.smartreconcile.backend.auth.dto.MessageResponse;
import com.smartreconcile.backend.auth.dto.SignupRequest;
import com.smartreconcile.backend.auth.entity.ERole;
import com.smartreconcile.backend.auth.entity.Role;
import com.smartreconcile.backend.auth.entity.User;
import com.smartreconcile.backend.auth.repository.RoleRepository;
import com.smartreconcile.backend.auth.repository.UserRepository;
import com.smartreconcile.backend.auth.security.JwtUtils;
import com.smartreconcile.backend.auth.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                roles);
    }

    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new MessageResponse("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFullName());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_FINANCE_MANAGER) // Default role
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "manager":
                        Role managerRole = roleRepository.findByName(ERole.ROLE_FINANCE_MANAGER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(managerRole);
                        break;
                    case "accounts":
                        Role accountsRole = roleRepository.findByName(ERole.ROLE_ACCOUNTS)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(accountsRole);
                        break;
                    case "vendor":
                        Role vendorRole = roleRepository.findByName(ERole.ROLE_VENDOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(vendorRole);
                        break;
                    default:
                        Role defaultRole = roleRepository.findByName(ERole.ROLE_ACCOUNTS)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(defaultRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }
}
