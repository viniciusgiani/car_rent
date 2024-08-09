package com.giani.services.customer;

import com.giani.dto.BookACarDto;
import com.giani.dto.CarDto;
import com.giani.dto.CarDtoListDto;
import com.giani.dto.SearchCarDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CustomerServices {

    List<CarDto> getAllCars();

    boolean bookACar(BookACarDto bookACarDto);

    CarDto getCarById(Long carId);

    List<BookACarDto> getBookingsByUserId(Long userId);

    CarDtoListDto searchCar(SearchCarDto searchCarDto);

}
