package spring.playground.modules.seafarer.indos;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IndosMasterRepository extends JpaRepository<IndosMaster, UUID> {

    Optional<IndosMaster> findByIndos(String indos);

    @Query("SELECT i FROM IndosMaster i WHERE " +
           "LOWER(i.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.indos) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.rank.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<IndosMaster> findAllWithSearch(@Param("search") String search, Pageable pageable);
}
