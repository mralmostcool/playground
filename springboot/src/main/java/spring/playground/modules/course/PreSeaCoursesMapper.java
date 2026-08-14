package spring.playground.modules.course;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PreSeaCoursesMapper {

    PreSeaCoursesMapper INSTANCE = Mappers.getMapper(PreSeaCoursesMapper.class);

    @Mapping(source = "institute.id", target = "instituteId")
    PreSeaCoursesResponseDTO toResponseDTO(PreSeaCourses entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "instituteId", target = "institute.id")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PreSeaCourses toEntity(PreSeaCoursesRequestDTO requestDTO);
}
