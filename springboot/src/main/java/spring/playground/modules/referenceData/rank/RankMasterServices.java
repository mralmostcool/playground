package spring.playground.modules.referenceData.rank;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;

@Service
@RequiredArgsConstructor
public class RankMasterServices {

    private final RankMasterRepository rankMasterRepository;
    private final RankMasterMapper rankMasterMapper;

    @Transactional
    @CacheEvict(value = "ranks_all", allEntries = true)
    public RankMasterResponseDTO createRank(RankMasterRequestDTO requestDTO) {
        RankMaster entity = rankMasterMapper.toEntity(requestDTO);
        RankMaster saved = rankMasterRepository.save(entity);
        return rankMasterMapper.toResponseDTO(saved);
    }

    @Cacheable(value = "ranks_all")
    public List<RankMasterResponseDTO> getAllRanks() {
        return rankMasterRepository.findAll().stream()
                .map(rankMasterMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "ranks", key = "#id")
    public RankMasterResponseDTO getRankById(UUID id) {
        RankMaster entity = rankMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rank not found with id: " + id));
        return rankMasterMapper.toResponseDTO(entity);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "ranks", key = "#id"),
        @CacheEvict(value = "ranks_all", allEntries = true)
    })
    public RankMasterResponseDTO updateRank(UUID id, RankMasterRequestDTO requestDTO) {
        RankMaster entity = rankMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rank not found with id: " + id));
        entity.setName(requestDTO.getName());
        entity.setLevel(requestDTO.getLevel());
        RankMaster saved = rankMasterRepository.save(entity);
        return rankMasterMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "ranks", key = "#id"),
        @CacheEvict(value = "ranks_all", allEntries = true)
    })
    public RankMasterResponseDTO patchRank(UUID id, RankMasterPatchRequestDTO patchDTO) {
        RankMaster entity = rankMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rank not found with id: " + id));
        if (patchDTO.getName() != null) {
            entity.setName(patchDTO.getName());
        }
        if (patchDTO.getLevel() != null) {
            entity.setLevel(patchDTO.getLevel());
        }
        RankMaster saved = rankMasterRepository.save(entity);
        return rankMasterMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "ranks", key = "#id"),
        @CacheEvict(value = "ranks_all", allEntries = true)
    })
    public void deleteRank(UUID id) {
        if (!rankMasterRepository.existsById(id)) {
            throw new NotFoundException("Rank not found with id: " + id);
        }
        rankMasterRepository.deleteById(id);
    }
}
