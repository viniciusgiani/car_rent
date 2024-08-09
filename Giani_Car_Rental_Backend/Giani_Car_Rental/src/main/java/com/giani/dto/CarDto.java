package com.giani.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CarDto {

    private Long id;

    @NotBlank(message = "Brand is mandatory")
    private String brand;

    @NotBlank(message = "Color is mandatory")
    private String color;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Type is mandatory")
    private String type;

    @NotBlank(message = "Transmission is mandatory")
    private String transmission;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotNull(message = "Price is mandatory")
    @Positive(message = "Price must be positive")
    private Long price;

    @NotNull(message = "Year is mandatory")
    private Integer year;

    private MultipartFile image;

    private byte[] returnImage;

    private String imageBase64;
}


