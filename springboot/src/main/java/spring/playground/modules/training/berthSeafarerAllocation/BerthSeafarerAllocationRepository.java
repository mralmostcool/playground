package spring.playground.modules.training.berthSeafarerAllocation;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BerthSeafarerAllocationRepository extends JpaRepository<BerthSeafarerAllocation, UUID> {

}
