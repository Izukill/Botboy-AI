package org.Izuki.rest;

import jakarta.validation.Valid;
import org.Izuki.rest.dto.auth.LoginRequestDTO;
import org.Izuki.rest.dto.auth.LoginResponseDTO;
import org.Izuki.entity.User;
import org.Izuki.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthRestController implements AuthRestControllerAPI {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager manager;

    @Override
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> efetuarLogin(@RequestBody @Valid LoginRequestDTO dados) {

        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.getEmail(), dados.getPassword());

        Authentication authentication = manager.authenticate(authenticationToken);

        var tokenJWT = tokenService.generateToken((User) authentication.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(tokenJWT));


    }
}
