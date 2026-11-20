package cl.gaslachispa.api.blog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, String> {

    List<Blog> findByActivoTrue();
}
