package com.giani.controller;

import com.giani.dto.BookACarDto;
import com.giani.dto.CarDto;
import com.giani.dto.SearchCarDto;
import com.giani.services.admin.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private static final Logger LOGGER = Logger.getLogger(AdminController.class.getName());

    private final AdminService adminService;

    @PostMapping("/car")
    public ResponseEntity<?> postCar(@Valid @ModelAttribute CarDto carDto, BindingResult result) throws IOException {
        LOGGER.info("Received CarDto: " + carDto);
        if (result.hasErrors()) {
            LOGGER.warning("Validation errors: " + result.getAllErrors());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getAllErrors());
        }

        boolean success = adminService.postCar(carDto);
        if (success) {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
        LOGGER.warning("Failed to post car");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/cars")
    public ResponseEntity<?> getAllCars() {
        return ResponseEntity.ok(adminService.getAllCars());
    }

    @DeleteMapping("/car/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        adminService.deleteCar(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/car/{id}")
    public ResponseEntity<CarDto> getCarById(@PathVariable Long id) {
        CarDto carDto = adminService.getCarById(id);
        return ResponseEntity.ok(carDto);
    }

    @PutMapping("/car/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @Valid @ModelAttribute CarDto carDto, BindingResult result) throws IOException {
        LOGGER.info("Received CarDto for update: " + carDto);
        if (result.hasErrors()) {
            LOGGER.warning("Validation errors: " + result.getAllErrors());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getAllErrors());
        }

        try {
            boolean success = adminService.updateCar(id, carDto);
            if (success) {
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            LOGGER.severe("Error updating car: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/car/bookings")
    public ResponseEntity<List<BookACarDto>> getBookings() {
        return ResponseEntity.ok(adminService.getBookings());
    }

    @GetMapping("/car/booking/{bookingId}/{status}")
    public ResponseEntity<?> changeBookingStatus(@PathVariable Long bookingId, @PathVariable String status) {
        boolean success = adminService.changeBookingStatus(bookingId, status);
        if (success) return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/car/search")
    public ResponseEntity<?> searchCar(@RequestBody SearchCarDto searchCarDto) {
        return ResponseEntity.ok(adminService.searchCar(searchCarDto));
    }

}