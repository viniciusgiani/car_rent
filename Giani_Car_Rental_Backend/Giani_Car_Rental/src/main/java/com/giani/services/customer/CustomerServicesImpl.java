package com.giani.services.customer;

import com.giani.dto.BookACarDto;
import com.giani.dto.CarDto;
import com.giani.dto.CarDtoListDto;
import com.giani.dto.SearchCarDto;
import com.giani.entities.BookACar;
import com.giani.entities.Car;
import com.giani.entities.User;
import com.giani.enums.BookCarStatus;
import com.giani.repository.BookACarRepository;
import com.giani.repository.CarRepository;
import com.giani.repository.UserRepository;
import com.giani.utils.mapper.CarMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RequiredArgsConstructor
@Service
public class CustomerServicesImpl implements CustomerServices {
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final BookACarRepository bookACarRepository;
    private static final Logger logger = LoggerFactory.getLogger(CustomerServicesImpl.class);

    @Override
    public List<CarDto> getAllCars() {
        return carRepository.findAll().stream().map(CarMapper::getCarDto).collect(Collectors.toList());
    }

    @Override
    public boolean bookACar(BookACarDto bookACarDto) {
        logger.debug("Booking a car with DTO: {}", bookACarDto);

        if (bookACarDto.getCarId() == null || bookACarDto.getUserId() == null) {
            logger.error("Car ID or User ID is missing: Car ID: {}, User ID: {}", bookACarDto.getCarId(), bookACarDto.getUserId());
            return false;
        }

        try {
            Optional<Car> optionalCar = carRepository.findById(bookACarDto.getCarId());
            Optional<User> optionalUser = userRepository.findById(bookACarDto.getUserId());

            if (optionalCar.isPresent() && optionalUser.isPresent() && bookACarDto.getFromDate() != null && bookACarDto.getToDate() != null) {
                Car existingCar = optionalCar.get();
                BookACar bookACar = new BookACar();
                bookACar.setUser(optionalUser.get());
                bookACar.setCar(existingCar);
                bookACar.setFromDate(bookACarDto.getFromDate());
                bookACar.setToDate(bookACarDto.getToDate());
                bookACar.setBookCarStatus(BookCarStatus.PENDING);

                long differenceInMilliSeconds = bookACarDto.getToDate().getTime() - bookACarDto.getFromDate().getTime();
                long days = TimeUnit.MILLISECONDS.toDays(differenceInMilliSeconds);
                bookACar.setDays(days);
                bookACar.setPrice(existingCar.getPrice() * days);

                bookACarRepository.save(bookACar);
                return true;
            } else {
                logger.error("Invalid booking details: Car or User not found or dates are null");
            }
        } catch (Exception e) {
            logger.error("Exception occurred while booking a car: ", e);
        }
        return false;
    }


    @Override
    public CarDto getCarById(Long carId) {
        Optional<Car> optionalCar = carRepository.findById(carId);
        return optionalCar.map(CarMapper::getCarDto).orElse(null);
    }

    @Override
    public List<BookACarDto> getBookingsByUserId(Long userId) {
        return bookACarRepository.findAllByUserId(userId).stream().map(CarMapper::getBookACarDto).collect(Collectors.toList());
    }

    @Override
    public CarDtoListDto searchCar(SearchCarDto searchCarDto) {
        Car car = new Car();
        car.setBrand(searchCarDto.getBrand());
        car.setType(searchCarDto.getType());
        car.setTransmission(searchCarDto.getTransmission());
        car.setColor(searchCarDto.getColor());
        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll()
                .withMatcher("brand", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
                .withMatcher("type", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
                .withMatcher("transmission", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
                .withMatcher("color", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase());
        Example<Car> carExample = Example.of(car, exampleMatcher);
        List<Car> carList = carRepository.findAll(carExample);
        CarDtoListDto carDtoListDto = new CarDtoListDto();
        carDtoListDto.setCarDtoList(carList.stream().map(CarMapper::getCarDto).collect(Collectors.toList()));
        return carDtoListDto;
    }
}