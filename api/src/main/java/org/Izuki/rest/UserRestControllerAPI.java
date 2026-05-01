package org.Izuki.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.Izuki.rest.dto.auth.RegisterSaveRequestDTO;
import org.Izuki.rest.dto.user.UserResponseDTO;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

@Tag(name = "User", description = "Endpoints de usuário")
public interface UserRestControllerAPI {

    @PostMapping
    @Operation(summary = "Criar um novo Cliente.",
            description = "Cria um novo Cliente com base na descrição informada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Operação realizada com sucesso.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(
                    responseCode = "400", description = "Erro ao cadastrar Cliente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "500",
                    description = "Erro inesperado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProblemDetail.class))),
    })
    ResponseEntity<UserResponseDTO> create(@RequestBody(description = "Dados do cliente a ser criado.")
                                           RegisterSaveRequestDTO dto) throws RuntimeException;
}
