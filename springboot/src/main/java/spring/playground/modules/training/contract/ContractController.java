package spring.playground.modules.training.contract;

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
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractServices contractServices;

    @PostMapping
    public ResponseEntity<ContractResponseDTO> createContract(@Valid @RequestBody ContractRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contractServices.createContract(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<ContractResponseDTO>> getAllContracts() {
        return ResponseEntity.ok(contractServices.getAllContracts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponseDTO> getContractById(@PathVariable UUID id) {
        return ResponseEntity.ok(contractServices.getContractById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContractResponseDTO> updateContract(
            @PathVariable UUID id,
            @Valid @RequestBody ContractRequestDTO requestDTO) {
        return ResponseEntity.ok(contractServices.updateContract(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ContractResponseDTO> patchContract(
            @PathVariable UUID id,
            @Valid @RequestBody ContractPatchRequestDTO requestDTO) {
        return ResponseEntity.ok(contractServices.patchContract(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable UUID id) {
        contractServices.deleteContract(id);
        return ResponseEntity.noContent().build();
    }
}
