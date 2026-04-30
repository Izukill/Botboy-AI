package org.Izuki.rest;

import org.Izuki.rest.dto.userDTO.UserResponseDTO;
import org.Izuki.rest.dto.userDTO.UserSaveRequestDTO;
import org.Izuki.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserRestController implements UserRestControllerAPI{

    @Autowired
    private UserService userService;

    @Override
    public ResponseEntity<UserResponseDTO> create(UserSaveRequestDTO dto) throws RuntimeException {
        return userService.create(dto);
    }
}
