package com.giani.utils.mapper;

import com.giani.dto.BookACarDto;
import com.giani.dto.CarDto;
import com.giani.entities.BookACar;
import com.giani.entities.Car;

import java.io.IOException;
import java.util.Base64;

public class CarMapper {

    public static CarDto getCarDto(Car car) {
        CarDto carDto = new CarDto();
        carDto.setId(car.getId());
        carDto.setName(car.getName());
        carDto.setBrand(car.getBrand());
        carDto.setColor(car.getColor());
        carDto.setPrice(car.getPrice());
        carDto.setDescription(car.getDescription());
        carDto.setType(car.getType());
        carDto.setTransmission(car.getTransmission());
        carDto.setYear(car.getYear());

        if (car.getImage() != null) {
            carDto.setImageBase64(Base64.getEncoder().encodeToString(car.getImage()));
        }
        return carDto;
    }

    public static Car getCar(CarDto carDto) throws IOException {
        Car car = new Car();
        car.setId(carDto.getId());
        car.setName(carDto.getName());
        car.setBrand(carDto.getBrand());
        car.setColor(carDto.getColor());
        car.setPrice(carDto.getPrice());
        car.setDescription(carDto.getDescription());
        car.setType(carDto.getType());
        car.setTransmission(carDto.getTransmission());
        car.setYear(carDto.getYear());

        if (carDto.getImage() != null && !carDto.getImage().isEmpty()) {
            car.setImage(carDto.getImage().getBytes());
        }
        return car;
    }

    public static BookACarDto getBookACarDto(BookACar bookACar) {
        BookACarDto bookACarDto = new BookACarDto();
        bookACarDto.setId(bookACar.getId());
        bookACarDto.setDays(bookACar.getDays());
        bookACarDto.setBookCarStatus(bookACar.getBookCarStatus());
        bookACarDto.setPrice(bookACar.getPrice());
        bookACarDto.setToDate(bookACar.getToDate());
        bookACarDto.setFromDate(bookACar.getFromDate());
        bookACarDto.setEmail(bookACar.getUser().getEmail());
        bookACarDto.setUsername(bookACar.getUser().getName());
        bookACarDto.setUserId(bookACar.getUser().getId());
        bookACarDto.setCarId(bookACar.getCar().getId());
        return bookACarDto;
    }

}

