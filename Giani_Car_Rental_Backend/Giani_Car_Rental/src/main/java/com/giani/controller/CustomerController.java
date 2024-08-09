package com.giani.controller;

import com.giani.dto.BookACarDto;
import com.giani.dto.CarDto;
import com.giani.dto.SearchCarDto;
import com.giani.services.customer.CustomerServices;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerServices customerServices;
    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

    @GetMapping("/cars")
    public ResponseEntity<List<CarDto>> getAllCars() {
        List<CarDto> carDtoList = customerServices.getAllCars();
        return ResponseEntity.ok(carDtoList);
    }

    @PostMapping("/car/book")
    public ResponseEntity<Void> bookACar(@RequestBody BookACarDto bookACarDto) {
        logger.debug("Received booking request: {}", bookACarDto);
        boolean success = customerServices.bookACar(bookACarDto);
        if (success) return ResponseEntity.status(HttpStatus.CREATED).build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<CarDto> getCarId(@PathVariable Long carId) {
        CarDto carDto = customerServices.getCarById(carId);
        if (carDto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(carDto);
    }

    @GetMapping("/car/bookings/{userId}")
    public ResponseEntity<List<BookACarDto>> getBookingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(customerServices.getBookingsByUserId(userId));
    }

    @PostMapping("/car/search")
    public ResponseEntity<?> searchCar(@RequestBody SearchCarDto searchCarDto) {
        return ResponseEntity.ok(customerServices.searchCar(searchCarDto));
    }

}

