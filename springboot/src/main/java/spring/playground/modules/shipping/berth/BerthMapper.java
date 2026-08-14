package spring.playground.modules.shipping.berth;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BerthMapper {

    BerthMapper INSTANCE = Mappers.getMapper(BerthMapper.class);

    BerthResponseDTO toResponseDTO(Berth entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Berth toEntity(BerthRequestDTO requestDTO);
}
