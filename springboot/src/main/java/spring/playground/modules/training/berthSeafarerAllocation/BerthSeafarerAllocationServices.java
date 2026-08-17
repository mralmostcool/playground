package spring.playground.modules.training.berthSeafarerAllocation;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;
import spring.playground.modules.seafarer.indos.IndosMaster;
import spring.playground.modules.seafarer.indos.IndosMasterRepository;
import spring.playground.modules.shipping.berth.Berth;
import spring.playground.modules.shipping.berth.BerthRepository;
import spring.playground.modules.shipping.berthAllocation.BerthAllocation;
import spring.playground.modules.shipping.berthAllocation.BerthAllocationRepository;

@Service
@RequiredArgsConstructor
public class BerthSeafarerAllocationServices {

    private final BerthSeafarerAllocationRepository berthSeafarerAllocationRepository;
    private final BerthRepository berthRepository;
    private final IndosMasterRepository indosMasterRepository;
    private final BerthAllocationRepository berthAllocationRepository;
    private final BerthSeafarerAllocationMapper mapper;

    @Transactional
    public BerthSeafarerAllocationResponseDTO createAllocation(BerthSeafarerAllocationRequestDTO requestDTO) {
        Berth berth = berthRepository.findById(requestDTO.getBerthId())
                .orElseThrow(() -> new NotFoundException("Berth not found with id: " + requestDTO.getBerthId()));
        IndosMaster indosMaster = indosMasterRepository.findById(requestDTO.getIndosMasterId())
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + requestDTO.getIndosMasterId()));

        BerthAllocation berthAllocation = null;
        if (requestDTO.getBerthAllocationId() != null) {
            berthAllocation = berthAllocationRepository.findById(requestDTO.getBerthAllocationId())
                    .orElseThrow(() -> new NotFoundException("Berth allocation not found with id: " + requestDTO.getBerthAllocationId()));
        }

        BerthSeafarerAllocation entity = mapper.toEntity(requestDTO);
        entity.setBerth(berth);
        entity.setIndosMaster(indosMaster);
        entity.setBerthAllocation(berthAllocation);

        BerthSeafarerAllocation saved = berthSeafarerAllocationRepository.save(entity);
        return mapper.toResponseDTO(saved);
    }

    public List<BerthSeafarerAllocationResponseDTO> getAllAllocations() {
        return berthSeafarerAllocationRepository.findAll().stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public BerthSeafarerAllocationResponseDTO getAllocationById(UUID id) {
        BerthSeafarerAllocation entity = berthSeafarerAllocationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth seafarer allocation not found with id: " + id));
        return mapper.toResponseDTO(entity);
    }

    @Transactional
    public BerthSeafarerAllocationResponseDTO updateAllocation(UUID id, BerthSeafarerAllocationRequestDTO requestDTO) {
        BerthSeafarerAllocation existing = berthSeafarerAllocationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth seafarer allocation not found with id: " + id));

        Berth berth = berthRepository.findById(requestDTO.getBerthId())
                .orElseThrow(() -> new NotFoundException("Berth not found with id: " + requestDTO.getBerthId()));
        IndosMaster indosMaster = indosMasterRepository.findById(requestDTO.getIndosMasterId())
                .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + requestDTO.getIndosMasterId()));

        BerthAllocation berthAllocation = null;
        if (requestDTO.getBerthAllocationId() != null) {
            berthAllocation = berthAllocationRepository.findById(requestDTO.getBerthAllocationId())
                    .orElseThrow(() -> new NotFoundException("Berth allocation not found with id: " + requestDTO.getBerthAllocationId()));
        }

        existing.setBerth(berth);
        existing.setIndosMaster(indosMaster);
        existing.setBerthAllocation(berthAllocation);
        existing.setStartDate(requestDTO.getStartDate());
        existing.setEndDate(requestDTO.getEndDate());

        BerthSeafarerAllocation saved = berthSeafarerAllocationRepository.save(existing);
        return mapper.toResponseDTO(saved);
    }

    @Transactional
    public BerthSeafarerAllocationResponseDTO patchAllocation(UUID id, BerthSeafarerAllocationPatchRequestDTO patchDTO) {
        BerthSeafarerAllocation existing = berthSeafarerAllocationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth seafarer allocation not found with id: " + id));

        if (patchDTO.getBerthId() != null) {
            Berth berth = berthRepository.findById(patchDTO.getBerthId())
                    .orElseThrow(() -> new NotFoundException("Berth not found with id: " + patchDTO.getBerthId()));
            existing.setBerth(berth);
        }
        if (patchDTO.getIndosMasterId() != null) {
            IndosMaster indosMaster = indosMasterRepository.findById(patchDTO.getIndosMasterId())
                    .orElseThrow(() -> new NotFoundException("INDoS master not found with id: " + patchDTO.getIndosMasterId()));
            existing.setIndosMaster(indosMaster);
        }
        if (patchDTO.getBerthAllocationId() != null) {
            BerthAllocation berthAllocation = berthAllocationRepository.findById(patchDTO.getBerthAllocationId())
                    .orElseThrow(() -> new NotFoundException("Berth allocation not found with id: " + patchDTO.getBerthAllocationId()));
            existing.setBerthAllocation(berthAllocation);
        }
        if (patchDTO.getStartDate() != null) {
            existing.setStartDate(patchDTO.getStartDate());
        }
        if (patchDTO.getEndDate() != null) {
            existing.setEndDate(patchDTO.getEndDate());
        }

        BerthSeafarerAllocation saved = berthSeafarerAllocationRepository.save(existing);
        return mapper.toResponseDTO(saved);
    }

    @Transactional
    public void deleteAllocation(UUID id) {
        if (!berthSeafarerAllocationRepository.existsById(id)) {
            throw new NotFoundException("Berth seafarer allocation not found with id: " + id);
        }
        berthSeafarerAllocationRepository.deleteById(id);
    }
}
