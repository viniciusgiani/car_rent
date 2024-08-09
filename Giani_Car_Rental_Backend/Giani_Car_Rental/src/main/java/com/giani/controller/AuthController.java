package com.giani.controller;

import com.giani.dto.AuthenticationRequest;
import com.giani.dto.AuthenticationResponse;
import com.giani.dto.SignUpRequest;
import com.giani.dto.UserDto;
import com.giani.entities.User;
import com.giani.repository.UserRepository;
import com.giani.services.auth.AuthService;
import com.giani.services.jwt.UserService;
import com.giani.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signupCustomer(@RequestBody SignUpRequest signUpRequest) {
        if (authService.hasCustomerWithEmail(signUpRequest.getEmail())) {
            return new ResponseEntity<>("Customer already exists", HttpStatus.CONFLICT);
        }
        UserDto createdCustomerDto = authService.createCustomer(signUpRequest);
        if (createdCustomerDto == null) {
            return new ResponseEntity<>("Customer not created", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(createdCustomerDto, HttpStatus.CREATED);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getEmail(),
                            authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        } catch (DisabledException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        final UserDetails userDetails = userService.userDetailService().loadUserByUsername(authenticationRequest.getEmail());
        Optional<User> optionalUser = userRepository.findFirstByEmail(userDetails.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();

        if (optionalUser.isPresent()) {
            authenticationResponse.setJwt(jwt);
            authenticationResponse.setUserId(optionalUser.get().getId());
            authenticationResponse.setUserRole(optionalUser.get().getUserRole());
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(authenticationResponse, HttpStatus.OK);
    }
}

