package com.giani.services.auth;

import com.giani.dto.SignUpRequest;
import com.giani.dto.UserDto;

public interface AuthService {

    UserDto createCustomer(SignUpRequest signUpRequest);

    boolean hasCustomerWithEmail(String email);

}
