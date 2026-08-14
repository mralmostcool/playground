package spring.playground.modules.seafarer.indos;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface IndosMasterMapper {

    IndosMasterMapper INSTANCE = Mappers.getMapper(IndosMasterMapper.class);

    @Mapping(source = "rank.id", target = "rankId")
    IndosMasterResponseDTO toResponseDTO(IndosMaster entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "rankId", target = "rank.id")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    IndosMaster toEntity(IndosMasterRequestDTO requestDTO);
}
