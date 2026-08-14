package spring.playground.modules.shipping.vessel;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface VesselMapper {

    VesselMapper INSTANCE = Mappers.getMapper(VesselMapper.class);

    VesselResponseDTO toResponseDTO(Vessel entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Vessel toEntity(VesselRequestDTO requestDTO);
}
