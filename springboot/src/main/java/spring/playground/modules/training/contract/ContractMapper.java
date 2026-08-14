package spring.playground.modules.training.contract;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ContractMapper {

    ContractMapper INSTANCE = Mappers.getMapper(ContractMapper.class);

    @Mapping(source = "indosMaster.id", target = "indosMasterId")
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "enrollment.id", target = "enrollmentId")
    @Mapping(source = "berthSeafarerAllocation.id", target = "berthSeafarerAllocationId")
    ContractResponseDTO toResponseDTO(Contract entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "indosMasterId", target = "indosMaster.id")
    @Mapping(source = "companyId", target = "company.id")
    @Mapping(source = "enrollmentId", target = "enrollment.id")
    @Mapping(source = "berthSeafarerAllocationId", target = "berthSeafarerAllocation.id")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Contract toEntity(ContractRequestDTO requestDTO);
}
