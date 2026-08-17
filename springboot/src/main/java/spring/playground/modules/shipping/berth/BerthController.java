package spring.playground.modules.shipping.berth;

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
@RequestMapping("/api/berths")
@RequiredArgsConstructor
public class BerthController {

    private final BerthServices berthServices;

    @PostMapping
    public ResponseEntity<BerthResponseDTO> createBerth(@Valid @RequestBody BerthRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(berthServices.createBerth(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<BerthResponseDTO>> getAllBerths() {
        return ResponseEntity.ok(berthServices.getAllBerths());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BerthResponseDTO> getBerthById(@PathVariable UUID id) {
        return ResponseEntity.ok(berthServices.getBerthById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BerthResponseDTO> updateBerth(
            @PathVariable UUID id,
            @Valid @RequestBody BerthRequestDTO requestDTO) {
        return ResponseEntity.ok(berthServices.updateBerth(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BerthResponseDTO> patchBerth(
            @PathVariable UUID id,
            @Valid @RequestBody BerthPatchRequestDTO requestDTO) {
        return ResponseEntity.ok(berthServices.patchBerth(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBerth(@PathVariable UUID id) {
        berthServices.deleteBerth(id);
        return ResponseEntity.noContent().build();
    }
}
