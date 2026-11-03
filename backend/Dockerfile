# The content API. For now it runs only for the site's build (D20, D26: compose.build.yml).
# Tests run before the image is built (./mvnw verify), so the image build skips them.

FROM eclipse-temurin:21-jdk-noble AS build
WORKDIR /app
# The pom picks JDK 21 from a Maven toolchain (docs/tdd.md); here it is the image's own JDK.
RUN mkdir -p /root/.m2 && printf '%s\n' \
    '<toolchains><toolchain><type>jdk</type>' \
    '<provides><version>21</version></provides>' \
    "<configuration><jdkHome>${JAVA_HOME}</jdkHome></configuration>" \
    '</toolchain></toolchains>' > /root/.m2/toolchains.xml
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN ./mvnw -q dependency:go-offline
COPY src src
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:21-jre-noble
RUN useradd --system --uid 10001 app
USER app
COPY --from=build /app/target/zuacaldeira-backend-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
