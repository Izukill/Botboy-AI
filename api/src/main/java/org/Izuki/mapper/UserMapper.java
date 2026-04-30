package org.Izuki.mapper;

import org.Izuki.entity.User;
import org.Izuki.rest.dto.auth.RegisterSaveRequestDTO;
import org.Izuki.rest.dto.user.UserResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterSaveRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        return user;
    }

    public UserResponseDTO toResponse(User entity) {
        if (entity == null) {
            return null;
        }

        UserResponseDTO dto = new UserResponseDTO();
        dto.setLookupId(entity.getLookupId());
        dto.setEmail(entity.getEmail());

        return dto;
    }
}