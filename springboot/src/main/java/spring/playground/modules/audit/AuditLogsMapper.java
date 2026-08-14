package spring.playground.modules.audit;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AuditLogsMapper {

    AuditLogsMapper INSTANCE = Mappers.getMapper(AuditLogsMapper.class);

    AuditLogsResponseDTO toResponseDTO(AuditLogs entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "changedAt", ignore = true)
    AuditLogs toEntity(AuditLogsRequestDTO requestDTO);
}
