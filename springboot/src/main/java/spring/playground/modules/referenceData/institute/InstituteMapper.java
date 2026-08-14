package spring.playground.modules.referenceData.institute;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface InstituteMapper {

    InstituteMapper INSTANCE = Mappers.getMapper(InstituteMapper.class);

    InstituteResponseDTO toResponseDTO(Institute entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Institute toEntity(InstituteRequestDTO requestDTO);
}
