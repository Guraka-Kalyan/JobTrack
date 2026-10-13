package com.jobtrack;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class JobTrackApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext loads without errors
    }
}
