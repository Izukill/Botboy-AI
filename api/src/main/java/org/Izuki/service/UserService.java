package org.Izuki.service;

import org.Izuki.entity.User;
import org.Izuki.mapper.UserMapper;
import org.Izuki.repository.UserRepository;
import org.Izuki.rest.dto.auth.RegisterSaveRequestDTO;
import org.Izuki.rest.dto.user.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    public UserResponseDTO create(RegisterSaveRequestDTO requestDTO) {
        Optional<User> userExist = userRepository.findByEmail(requestDTO.getEmail());

        if (userExist.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este email já está em uso");
        }

        User userNew = userMapper.toEntity(requestDTO);
        userNew.setPassword(passwordEncoder.encode(userNew.getPassword()));
        User savedUser = userRepository.save(userNew);
        return userMapper.toResponse(savedUser);
    }
}