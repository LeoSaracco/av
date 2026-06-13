package com.av.fitness.architecture;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class HexagonalArchitectureTest {

    private static final String DOMAIN = "com.av.fitness.domain..";
    private static final String APPLICATION = "com.av.fitness.application..";
    private static final String INFRASTRUCTURE = "com.av.fitness.infrastructure..";
    private static final String WEB = "com.av.fitness.web..";

    private static JavaClasses classes;

    @BeforeAll
    static void setUp() {
        classes = new ClassFileImporter().importPackages("com.av.fitness");
    }

    @Test
    void domainShouldNotDependOnInfrastructure() {
        ArchRule rule = noClasses()
                .that().resideInAPackage(DOMAIN)
                .should().dependOnClassesThat().resideInAPackage(INFRASTRUCTURE);
        rule.check(classes);
    }

    @Test
    void domainShouldNotDependOnSpringFramework() {
        ArchRule rule = noClasses()
                .that().resideInAPackage(DOMAIN)
                .should().dependOnClassesThat().resideInAnyPackage(
                        "org.springframework..", "jakarta.persistence..",
                        "org.hibernate..", "com.fasterxml.jackson..");
        rule.check(classes);
    }

    @Test
    void applicationShouldNotDependOnWebOrPersistence() {
        ArchRule rule = noClasses()
                .that().resideInAPackage(APPLICATION)
                .should().dependOnClassesThat().resideInAnyPackage(
                        WEB, "com.av.fitness.infrastructure.persistence..");
        rule.check(classes);
    }

    @Test
    void controllersShouldResideInWebPackage() {
        ArchRule rule = classes()
                .that().areAnnotatedWith("org.springframework.web.bind.annotation.RestController")
                .should().resideInAPackage(WEB);
        rule.check(classes);
    }

    @Test
    void repositoriesShouldResideInPersistencePackage() {
        ArchRule rule = classes()
                .that().areAnnotatedWith("org.springframework.stereotype.Repository")
                .should().resideInAPackage("com.av.fitness.infrastructure.persistence..");
        rule.check(classes);
    }
}
