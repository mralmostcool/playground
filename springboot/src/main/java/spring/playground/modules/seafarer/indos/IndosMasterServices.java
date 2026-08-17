package spring.playground.modules.seafarer.indos;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;
import spring.playground.modules.referenceData.rank.RankMaster;
import spring.playground.modules.referenceData.rank.RankMasterRepository;

@Service
@RequiredArgsConstructor
public class IndosMasterServices {

    private final IndosMasterRepository indosMasterRepository;
    private final RankMasterRepository rankMasterRepository;
    private final IndosMasterMapper indosMasterMapper;

    @Transactional
    public IndosMasterResponseDTO createIndos(IndosMasterRequestDTO requestDTO) {
        RankMaster rank = rankMasterRepository.findById(requestDTO.getRankId())
                .orElseThrow(() -> new NotFoundException("Rank not found with id: " + requestDTO.getRankId()));
        IndosMaster entity = indosMasterMapper.toEntity(requestDTO);
        entity.setRank(rank);
        IndosMaster saved = indosMasterRepository.save(entity);
        return indosMasterMapper.toResponseDTO(saved);
    }

    public List<IndosMasterResponseDTO> getAllIndos() {
        return indosMasterRepository.findAll().stream()
                .map(indosMasterMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public IndosMasterResponseDTO getIndosById(UUID id) {
        IndosMaster entity = indosMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + id));
        return indosMasterMapper.toResponseDTO(entity);
    }

    @Transactional
    public IndosMasterResponseDTO updateIndos(UUID id, IndosMasterRequestDTO requestDTO) {
        IndosMaster existing = indosMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + id));
        RankMaster rank = rankMasterRepository.findById(requestDTO.getRankId())
                .orElseThrow(() -> new NotFoundException("Rank not found with id: " + requestDTO.getRankId()));

        existing.setIndos(requestDTO.getIndos());
        existing.setFirstName(requestDTO.getFirstName());
        existing.setRank(rank);
        existing.setIsActive(requestDTO.getIsActive());

        IndosMaster saved = indosMasterRepository.save(existing);
        return indosMasterMapper.toResponseDTO(saved);
    }

    @Transactional
    public void deleteIndos(UUID id) {
        if (!indosMasterRepository.existsById(id)) {
            throw new NotFoundException("INDoS master not found with id: " + id);
        }
        indosMasterRepository.deleteById(id);
    }
}
