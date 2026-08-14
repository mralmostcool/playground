package spring.playground.modules.training.berthSeafarerAllocation;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BerthSeafarerAllocationMapper {

    BerthSeafarerAllocationMapper INSTANCE = Mappers.getMapper(BerthSeafarerAllocationMapper.class);

    @Mapping(source = "berth.id", target = "berthId")
    @Mapping(source = "indosMaster.id", target = "indosMasterId")
    @Mapping(source = "berthAllocation.id", target = "berthAllocationId")
    BerthSeafarerAllocationResponseDTO toResponseDTO(BerthSeafarerAllocation entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "berthId", target = "berth.id")
    @Mapping(source = "indosMasterId", target = "indosMaster.id")
    @Mapping(source = "berthAllocationId", target = "berthAllocation.id")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BerthSeafarerAllocation toEntity(BerthSeafarerAllocationRequestDTO requestDTO);
}
