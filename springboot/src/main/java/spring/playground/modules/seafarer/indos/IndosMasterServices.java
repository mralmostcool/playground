package spring.playground.modules.seafarer.indos;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    @Caching(evict = {
        @CacheEvict(value = "indos", allEntries = true),
        @CacheEvict(value = "indos_all", allEntries = true)
    })
    public IndosMasterResponseDTO createIndos(IndosMasterRequestDTO requestDTO) {
        RankMaster rank = rankMasterRepository.findById(requestDTO.getRankId())
                .orElseThrow(() -> new NotFoundException("Rank not found with id: " + requestDTO.getRankId()));
        IndosMaster entity = indosMasterMapper.toEntity(requestDTO);
        entity.setRank(rank);
        IndosMaster saved = indosMasterRepository.save(entity);
        return indosMasterMapper.toResponseDTO(saved);
    }

    @Cacheable(value = "indos_all")
    public List<IndosMasterResponseDTO> getAllIndos() {
        return indosMasterRepository.findAll().stream()
                .map(indosMasterMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "indos", key = "#id")
    public IndosMasterResponseDTO getIndosById(UUID id) {
        IndosMaster entity = indosMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + id));
        return indosMasterMapper.toResponseDTO(entity);
    }

    @Cacheable(value = "indos", key = "#indos")
    public IndosMasterResponseDTO getIndosByIndos(String indos) {
        IndosMaster entity = indosMasterRepository.findByIndos(indos)
                .orElseThrow(() -> new NotFoundException("INDoS master not found with INDOS: " + indos));
        return indosMasterMapper.toResponseDTO(entity);
    }

    public Page<IndosMasterResponseDTO> getIndosPaginated(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String searchVal = (search == null || search.trim().isEmpty()) ? null : search.trim();
        
        Page<IndosMaster> entities;
        if (searchVal == null) {
            entities = indosMasterRepository.findAll(pageable);
        } else {
            entities = indosMasterRepository.findAllWithSearch(searchVal, pageable);
        }
        
        return entities.map(indosMasterMapper::toResponseDTO);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "indos", allEntries = true),
        @CacheEvict(value = "indos_all", allEntries = true)
    })
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
    @Caching(evict = {
        @CacheEvict(value = "indos", allEntries = true),
        @CacheEvict(value = "indos_all", allEntries = true)
    })
    public IndosMasterResponseDTO patchIndos(UUID id, IndosMasterPatchRequestDTO patchDTO) {
        IndosMaster existing = indosMasterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + id));

        if (patchDTO.getIndos() != null) {
            existing.setIndos(patchDTO.getIndos());
        }
        if (patchDTO.getFirstName() != null) {
            existing.setFirstName(patchDTO.getFirstName());
        }
        if (patchDTO.getRankId() != null) {
            RankMaster rank = rankMasterRepository.findById(patchDTO.getRankId())
                    .orElseThrow(() -> new NotFoundException("Rank not found with id: " + patchDTO.getRankId()));
            existing.setRank(rank);
        }
        if (patchDTO.getIsActive() != null) {
            existing.setIsActive(patchDTO.getIsActive());
        }

        IndosMaster saved = indosMasterRepository.save(existing);
        return indosMasterMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "indos", allEntries = true),
        @CacheEvict(value = "indos_all", allEntries = true)
    })
    public void deleteIndos(UUID id) {
        if (!indosMasterRepository.existsById(id)) {
            throw new NotFoundException("INDoS master not found with id: " + id);
        }
        indosMasterRepository.deleteById(id);
    }
}
