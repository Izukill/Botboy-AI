package org.Izuki.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.Izuki.rest.dto.auth.LoginRequestDTO;
import org.Izuki.rest.dto.auth.LoginResponseDTO;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

@Tag(name = "Auth", description = "Endpoint para autenticação de usuarios")
public interface AuthRestControllerAPI {

    @Operation(summary = "Fazer login no site.",
            description = "Recebe as credenciais do usuário (e-mail e senha) e retorna um token JWT para acesso aos endpoints protegidos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Login realizado com sucesso. Token retornado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponseDTO.class))),
            @ApiResponse(responseCode = "403",
                    description = "Credenciais inválidas (E-mail ou senha incorretos).",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado no servidor.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<LoginResponseDTO> efetuarLogin(
            @RequestBody(description = "Credenciais do usuário para autenticação.") LoginRequestDTO dados);
}
