---
description: Describes how to add Minestom as a dependency in your project.
---

# Dependencies

Adding Minestom to your java project is really simple, you only need to add a few repositories:

### Repositories

{% tabs %}
{% tab title="Gradle \(Groovy\)" %}
```groovy
repositories {
    // ...
    mavenCentral()
    maven { url 'https://repo.spongepowered.org/maven' }
    maven { url 'https://jitpack.io' }
}
```
{% endtab %}

{% tab title="Gradle \(Kotlin\)" %}
```groovy
repositories {
    // ...
    mavenCentral()
    maven(url = "https://repo.spongepowered.org/maven")
    maven(url = "https://jitpack.io")
}
```
{% endtab %}

{% tab title="Maven" %}
```markup
<respositories>
    <!-- ... -->
    <repository>
        <id>spongepowered</id>
        <url>https://repo.spongepowered.org/maven</url>
    </repository>
    <repository>
        <id>jitpack</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>
```
{% endtab %}
{% endtabs %}

### Dependencies

{% tabs %}
{% tab title="Gradle \(Groovy\)" %}
```groovy
dependencies {
    // ...
    implementation 'com.github.Minestom:Minestom:VERSION'
}
```
{% endtab %}

{% tab title="Gradle \(Kotlin\)" %}
```groovy
dependencies {
    //...
    implementation("com.github.Minestom:Minestom:-SNAPSHOT")
}
```
{% endtab %}

{% tab title="Maven" %}
```markup
<dependencies>
    <!-- ... -->
    <dependency>
        <groupId>com.github.Minestom</groupId>
        <artifactId>Minestom</artifactId>
        <version>VERSION</version>
        <exclusions>
            <exclusion>
                <groupId>org.jboss.shrinkwrap.resolver</groupId>
                <artifactId>shrinkwrap-resolver-depchain</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
</dependencies>
```

When using Maven it is recommended to exclude the artifact `shrinkwrap-resolver-depchain` from the group `org.jboss.shrinkwrap.resolver` as otherwise resolving the dependencies will fail. Shrinkwrap can be added as a separate dependency if needed without issues to restore its functionality.
{% endtab %}
{% endtabs %}

A list of versions can be found at [https://jitpack.io/\#Minestom/Minestom](https://jitpack.io/#Minestom/Minestom).

{% hint style="info" %}
Minestom needs Java 11 or newer in order to run.
{% endhint %}
