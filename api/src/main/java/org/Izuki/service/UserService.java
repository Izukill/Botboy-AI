package org.Izuki.service;

import org.Izuki.entity.User;
import org.Izuki.repository.UserRepository;
import org.Izuki.rest.dto.userDTO.UserSaveRequestDTO;
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

    public User create(UserSaveRequestDTO user){
        Optional<User> userExist= userRepository.findByEmail(user.getEmail());

        if(userExist.isPresent()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Este email já está em uso");
        }
        User userNew= new User();
        userNew.setEmail(user.getEmail());
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        userNew.setPassword(encryptedPassword);
        return userRepository.save(userNew);
    }


}
