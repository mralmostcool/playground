package spring.playground.modules.shipping.berth;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import spring.playground._config.exception.resource.NotFoundException;

@Service
@RequiredArgsConstructor
public class BerthServices {

    private final BerthRepository berthRepository;
    private final BerthMapper berthMapper;

    @Transactional
    public BerthResponseDTO createBerth(BerthRequestDTO requestDTO) {
        Berth entity = berthMapper.toEntity(requestDTO);
        Berth saved = berthRepository.save(entity);
        return berthMapper.toResponseDTO(saved);
    }

    public List<BerthResponseDTO> getAllBerths() {
        return berthRepository.findAll().stream()
                .map(berthMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public BerthResponseDTO getBerthById(UUID id) {
        Berth entity = berthRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth not found with id: " + id));
        return berthMapper.toResponseDTO(entity);
    }

    @Transactional
    public BerthResponseDTO updateBerth(UUID id, BerthRequestDTO requestDTO) {
        Berth existing = berthRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth not found with id: " + id));

        existing.setBerthName(requestDTO.getBerthName());
        existing.setIsActive(requestDTO.getIsActive());

        Berth saved = berthRepository.save(existing);
        return berthMapper.toResponseDTO(saved);
    }

    @Transactional
    public BerthResponseDTO patchBerth(UUID id, BerthPatchRequestDTO patchDTO) {
        Berth existing = berthRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Berth not found with id: " + id));

        if (patchDTO.getBerthName() != null) {
            existing.setBerthName(patchDTO.getBerthName());
        }
        if (patchDTO.getIsActive() != null) {
            existing.setIsActive(patchDTO.getIsActive());
        }

        Berth saved = berthRepository.save(existing);
        return berthMapper.toResponseDTO(saved);
    }

    @Transactional
    public void deleteBerth(UUID id) {
        if (!berthRepository.existsById(id)) {
            throw new NotFoundException("Berth not found with id: " + id);
        }
        berthRepository.deleteById(id);
    }
}
