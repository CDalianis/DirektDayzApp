package com.honeyapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableRetry
public class DirectDayzappApplication {

    public static void main(String[] args) {
        normalizeDatabaseUrl();
        SpringApplication.run(DirectDayzappApplication.class, args);
    }

    private static void normalizeDatabaseUrl() {
        String url = System.getenv("SPRING_DATASOURCE_URL");
        if (url != null && url.startsWith("postgres://")) {
            System.setProperty("SPRING_DATASOURCE_URL", "jdbc:postgresql://" + url.substring("postgres://".length()));
        }
    }
}
