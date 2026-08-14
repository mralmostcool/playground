package spring.playground.modules.shipping.berthAllocation;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BerthAllocationRepository extends JpaRepository<BerthAllocation, UUID> {

}
