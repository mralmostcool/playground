package spring.playground.modules.shipping.berthAllocation;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BerthAllocationMapper {

    BerthAllocationMapper INSTANCE = Mappers.getMapper(BerthAllocationMapper.class);

    @Mapping(source = "berth.id", target = "berthId")
    @Mapping(source = "vessel.id", target = "vesselId")
    BerthAllocationResponseDTO toResponseDTO(BerthAllocation entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "berthId", target = "berth.id")
    @Mapping(source = "vesselId", target = "vessel.id")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BerthAllocation toEntity(BerthAllocationRequestDTO requestDTO);
}
