package spring.playground.modules.referenceData.rank;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankMasterServices {

    private final RankMasterRepository rankMasterRepository;
    private final RankMasterMapper rankMasterMapper;

    @Transactional
    public RankMasterResponseDTO createRank(RankMasterRequestDTO requestDTO) {
        RankMaster entity = rankMasterMapper.toEntity(requestDTO);
        RankMaster saved = rankMasterRepository.save(entity);
        return rankMasterMapper.toResponseDTO(saved);
    }

    public List<RankMasterResponseDTO> getAllRanks() {
        return rankMasterRepository.findAll().stream()
                .map(rankMasterMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public RankMasterResponseDTO getRankById(UUID id) {
        RankMaster entity = rankMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rank not found with id: " + id));
        return rankMasterMapper.toResponseDTO(entity);
    }

    @Transactional
    public RankMasterResponseDTO updateRank(UUID id, RankMasterRequestDTO requestDTO) {
        RankMaster entity = rankMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rank not found with id: " + id));
        entity.setName(requestDTO.getName());
        entity.setLevel(requestDTO.getLevel());
        RankMaster saved = rankMasterRepository.save(entity);
        return rankMasterMapper.toResponseDTO(saved);
    }

    @Transactional
    public void deleteRank(UUID id) {
        if (!rankMasterRepository.existsById(id)) {
            throw new NotFoundException("Rank not found with id: " + id);
        }
        rankMasterRepository.deleteById(id);
    }
}
