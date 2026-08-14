package spring.playground.modules.course;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreSeaCoursesRepository extends JpaRepository<PreSeaCourses, UUID> {

}
