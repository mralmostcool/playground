package spring.playground.modules.referenceData.rank;

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
@RequiredArgsConstructor
@RequestMapping("/api/ranks")
public class RankMasterController {

    private final RankMasterServices rankMasterServices;

    @PostMapping
    public ResponseEntity<RankMasterResponseDTO> createRank(@Valid @RequestBody RankMasterRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rankMasterServices.createRank(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<RankMasterResponseDTO>> getAllRanks() {
        return ResponseEntity.ok(rankMasterServices.getAllRanks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RankMasterResponseDTO> getRankById(@PathVariable UUID id) {
        return ResponseEntity.ok(rankMasterServices.getRankById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RankMasterResponseDTO> updateRank(
            @PathVariable UUID id,
            @Valid @RequestBody RankMasterRequestDTO requestDTO) {
        return ResponseEntity.ok(rankMasterServices.updateRank(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RankMasterResponseDTO> patchRank(
            @PathVariable UUID id,
            @Valid @RequestBody RankMasterPatchRequestDTO requestDTO) {
        return ResponseEntity.ok(rankMasterServices.patchRank(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRank(@PathVariable UUID id) {
        rankMasterServices.deleteRank(id);
        return ResponseEntity.noContent().build();
    }
}
