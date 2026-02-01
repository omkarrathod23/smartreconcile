package com.smartreconcile.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppController {

    @GetMapping("/")
    public String root() {
        return "SmartReconcile Backend is Live 🚀";
    }

    @GetMapping("/healthz")
    public String health() {
        return "OK";
    }
}
