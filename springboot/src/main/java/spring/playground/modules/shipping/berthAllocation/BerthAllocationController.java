package spring.playground.modules.shipping.berthAllocation;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/berth-allocations")
@RequiredArgsConstructor
public class BerthAllocationController {

    private final BerthAllocationServices berthAllocationServices;

    @PostMapping
    public ResponseEntity<BerthAllocationResponseDTO> createAllocation(@Valid @RequestBody BerthAllocationRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(berthAllocationServices.createAllocation(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<BerthAllocationResponseDTO>> getAllAllocations() {
        return ResponseEntity.ok(berthAllocationServices.getAllAllocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BerthAllocationResponseDTO> getAllocationById(@PathVariable UUID id) {
        return ResponseEntity.ok(berthAllocationServices.getAllocationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BerthAllocationResponseDTO> updateAllocation(
            @PathVariable UUID id,
            @Valid @RequestBody BerthAllocationRequestDTO requestDTO) {
        return ResponseEntity.ok(berthAllocationServices.updateAllocation(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BerthAllocationResponseDTO> patchAllocation(
            @PathVariable UUID id,
            @Valid @RequestBody BerthAllocationPatchRequestDTO requestDTO) {
        return ResponseEntity.ok(berthAllocationServices.patchAllocation(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAllocation(@PathVariable UUID id) {
        berthAllocationServices.deleteAllocation(id);
        return ResponseEntity.noContent().build();
    }
}
