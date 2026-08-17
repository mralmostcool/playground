package spring.playground.modules.shipping.berthAllocation;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;
import spring.playground.modules.shipping.berth.Berth;
import spring.playground.modules.shipping.berth.BerthRepository;
import spring.playground.modules.shipping.vessel.Vessel;
import spring.playground.modules.shipping.vessel.VesselRepository;

@Service
@RequiredArgsConstructor
public class BerthAllocationServices {

    private final BerthAllocationRepository berthAllocationRepository;
    private final BerthRepository berthRepository;
    private final VesselRepository vesselRepository;
    private final BerthAllocationMapper berthAllocationMapper;

    @Transactional
    public BerthAllocationResponseDTO createAllocation(BerthAllocationRequestDTO requestDTO) {
        Berth berth = berthRepository.findById(requestDTO.getBerthId())
                .orElseThrow(() -> new NotFoundException("Berth not found with id: " + requestDTO.getBerthId()));
        Vessel vessel = vesselRepository.findById(requestDTO.getVesselId())
                .orElseThrow(() -> new NotFoundException("Vessel not found with id: " + requestDTO.getVesselId()));

        BerthAllocation entity = berthAllocationMapper.toEntity(requestDTO);
        entity.setBerth(berth);
        entity.setVessel(vessel);
        BerthAllocation saved = berthAllocationRepository.save(entity);
        return berthAllocationMapper.toResponseDTO(saved);
    }

    public List<BerthAllocationResponseDTO> getAllAllocations() {
        return berthAllocationRepository.findAll().stream()
                .map(berthAllocationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public BerthAllocationResponseDTO getAllocationById(UUID id) {
        BerthAllocation entity = berthAllocationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth allocation not found with id: " + id));
        return berthAllocationMapper.toResponseDTO(entity);
    }

    @Transactional
    public BerthAllocationResponseDTO updateAllocation(UUID id, BerthAllocationRequestDTO requestDTO) {
        BerthAllocation existing = berthAllocationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth allocation not found with id: " + id));

        Berth berth = berthRepository.findById(requestDTO.getBerthId())
                .orElseThrow(() -> new NotFoundException("Berth not found with id: " + requestDTO.getBerthId()));
        Vessel vessel = vesselRepository.findById(requestDTO.getVesselId())
                .orElseThrow(() -> new NotFoundException("Vessel not found with id: " + requestDTO.getVesselId()));

        existing.setBerth(berth);
        existing.setVessel(vessel);
        existing.setStartDate(requestDTO.getStartDate());
        existing.setEndDate(requestDTO.getEndDate());

        BerthAllocation saved = berthAllocationRepository.save(existing);
        return berthAllocationMapper.toResponseDTO(saved);
    }

    @Transactional
    public BerthAllocationResponseDTO patchAllocation(UUID id, BerthAllocationPatchRequestDTO patchDTO) {
        BerthAllocation existing = berthAllocationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth allocation not found with id: " + id));

        if (patchDTO.getBerthId() != null) {
            Berth berth = berthRepository.findById(patchDTO.getBerthId())
                    .orElseThrow(() -> new NotFoundException("Berth not found with id: " + patchDTO.getBerthId()));
            existing.setBerth(berth);
        }
        if (patchDTO.getVesselId() != null) {
            Vessel vessel = vesselRepository.findById(patchDTO.getVesselId())
                    .orElseThrow(() -> new NotFoundException("Vessel not found with id: " + patchDTO.getVesselId()));
            existing.setVessel(vessel);
        }
        if (patchDTO.getStartDate() != null) {
            existing.setStartDate(patchDTO.getStartDate());
        }
        if (patchDTO.getEndDate() != null) {
            existing.setEndDate(patchDTO.getEndDate());
        }

        BerthAllocation saved = berthAllocationRepository.save(existing);
        return berthAllocationMapper.toResponseDTO(saved);
    }

    @Transactional
    public void deleteAllocation(UUID id) {
        if (!berthAllocationRepository.existsById(id)) {
            throw new NotFoundException("Berth allocation not found with id: " + id);
        }
        berthAllocationRepository.deleteById(id);
    }
}
