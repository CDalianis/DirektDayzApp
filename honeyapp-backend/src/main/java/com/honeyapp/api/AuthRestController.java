package com.honeyapp.api;

import com.honeyapp.authentication.AuthenticationService;
import com.honeyapp.dto.AuthenticationRequestDTO;
import com.honeyapp.dto.AuthenticationResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthRestController {

    private final AuthenticationService authenticationService;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDTO> authenticate(@Valid @RequestBody AuthenticationRequestDTO dto) {
        return ResponseEntity.ok(authenticationService.authenticate(dto));
    }
}
