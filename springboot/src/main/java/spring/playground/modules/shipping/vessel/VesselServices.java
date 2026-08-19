package spring.playground.modules.shipping.vessel;

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
public class VesselServices {

    private final VesselRepository vesselRepository;
    private final VesselMapper vesselMapper;

    @Transactional
    @CacheEvict(value = "vessels_all", allEntries = true)
    public VesselResponseDTO createVessel(VesselRequestDTO requestDTO) {
        Vessel entity = vesselMapper.toEntity(requestDTO);
        Vessel saved = vesselRepository.save(entity);
        return vesselMapper.toResponseDTO(saved);
    }

    @Cacheable(value = "vessels_all")
    public List<VesselResponseDTO> getAllVessels() {
        return vesselRepository.findAll().stream()
                .map(vesselMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "vessels", key = "#id")
    public VesselResponseDTO getVesselById(UUID id) {
        Vessel entity = vesselRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vessel not found with id: " + id));
        return vesselMapper.toResponseDTO(entity);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "vessels", key = "#id"),
        @CacheEvict(value = "vessels_all", allEntries = true)
    })
    public VesselResponseDTO updateVessel(UUID id, VesselRequestDTO requestDTO) {
        Vessel existing = vesselRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vessel not found with id: " + id));

        existing.setImo(requestDTO.getImo());
        existing.setName(requestDTO.getName());
        existing.setFlag(requestDTO.getFlag());
        existing.setIsActive(requestDTO.getIsActive());

        Vessel saved = vesselRepository.save(existing);
        return vesselMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "vessels", key = "#id"),
        @CacheEvict(value = "vessels_all", allEntries = true)
    })
    public VesselResponseDTO patchVessel(UUID id, VesselPatchRequestDTO patchDTO) {
        Vessel existing = vesselRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vessel not found with id: " + id));

        if (patchDTO.getImo() != null) {
            existing.setImo(patchDTO.getImo());
        }
        if (patchDTO.getName() != null) {
            existing.setName(patchDTO.getName());
        }
        if (patchDTO.getFlag() != null) {
            existing.setFlag(patchDTO.getFlag());
        }
        if (patchDTO.getIsActive() != null) {
            existing.setIsActive(patchDTO.getIsActive());
        }

        Vessel saved = vesselRepository.save(existing);
        return vesselMapper.toResponseDTO(saved);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "vessels", key = "#id"),
        @CacheEvict(value = "vessels_all", allEntries = true)
    })
    public void deleteVessel(UUID id) {
        if (!vesselRepository.existsById(id)) {
            throw new NotFoundException("Vessel not found with id: " + id);
        }
        vesselRepository.deleteById(id);
    }
}
