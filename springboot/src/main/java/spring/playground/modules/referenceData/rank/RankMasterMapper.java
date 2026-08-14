package spring.playground.modules.referenceData.rank;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RankMasterMapper {

    RankMasterMapper INSTANCE = Mappers.getMapper(RankMasterMapper.class);

    RankMasterResponseDTO toResponseDTO(RankMaster entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    RankMaster toEntity(RankMasterRequestDTO requestDTO);
}
