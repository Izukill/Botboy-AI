package org.Izuki.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API do chatbot Botboy",
                version = "v1",
                description = "Documentação completa dos endpoints do Botboy."
        )
)
public class SwaggerConfig {
}


