package com.giani.services.jwt;

import com.giani.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDetailsService userDetailService() {
        return username -> userRepository.findFirstByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}

