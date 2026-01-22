package com.smartreconcile.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartReconciliationApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartReconciliationApplication.class, args);
	}

}
