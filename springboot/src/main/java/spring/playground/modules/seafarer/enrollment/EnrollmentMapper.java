package spring.playground.modules.seafarer.enrollment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {

    EnrollmentMapper INSTANCE = Mappers.getMapper(EnrollmentMapper.class);

    @Mapping(source = "preSeaCourse.id", target = "preSeaCourseId")
    @Mapping(source = "indosMaster.id", target = "indosMasterId")
    EnrollmentResponseDTO toResponseDTO(Enrollment entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "preSeaCourseId", target = "preSeaCourse.id")
    @Mapping(source = "indosMasterId", target = "indosMaster.id")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Enrollment toEntity(EnrollmentRequestDTO requestDTO);
}
