package spring.playground.modules.referenceData.institute;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;

@Service
@RequiredArgsConstructor
public class InstituteServices {

    private final InstituteRepository instituteRepository;
    private final InstituteMapper instituteMapper;

    Logger logger = LoggerFactory.getLogger(InstituteServices.class);

    @Transactional
    public InstituteResponseDTO createInstitute(InstituteRequestDTO requestDTO) {
        Institute institute = instituteMapper.toEntity(requestDTO);
        Institute saved = instituteRepository.save(institute);

        logger.debug(saved.toString());

        return instituteMapper.toResponseDTO(saved);
    }

    public List<InstituteResponseDTO> getAllInstitutes() {
        return instituteRepository
                .findAll()
                .stream()
                .map(instituteMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InstituteResponseDTO getInstituteById(UUID id) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Institute not found with id: " + id));
        return instituteMapper.toResponseDTO(institute);
    }

    @Transactional
    public InstituteResponseDTO updateInstitute(UUID id, InstituteRequestDTO requestDTO) {
        Institute entity = instituteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Institute not found with id: " + id));
        entity.setName(requestDTO.getName());
        Institute updated = instituteRepository.saveAndFlush(entity);
        return instituteMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deleteInstitute(UUID id) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Institute not found with id: " + id));
        instituteRepository.delete(institute);
    }

}
