package org.Izuki.rest;

import org.Izuki.rest.dto.auth.RegisterSaveRequestDTO;
import org.Izuki.rest.dto.user.UserResponseDTO;
import org.Izuki.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserRestController implements UserRestControllerAPI {

    @Autowired
    private UserService userService;

    @Override
    public ResponseEntity<UserResponseDTO> create(@RequestBody RegisterSaveRequestDTO dto) {
        UserResponseDTO response = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}