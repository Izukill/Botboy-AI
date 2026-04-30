package org.Izuki.rest.dto.authDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterSaveRequestDTO {

    private String email;

    private String password;

}
