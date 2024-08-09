package com.giani.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    private String email;
    private String name;
    private String password;

}
