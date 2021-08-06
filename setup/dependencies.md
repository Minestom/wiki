---
description: Describes how to add Minestom as a dependency in your project.
---

# Dependencies

Adding Minestom to your java project is really simple, you only need to add a few repositories:

```groovy
repositories {
    // ...
    mavenCentral()
    maven { url 'https://repo.spongepowered.org/maven' }
    maven { url 'https://jitpack.io' }
}
```

And add the wanted Minestom version to your dependencies \([https://jitpack.io/\#Minestom/Minestom](https://jitpack.io/#Minestom/Minestom)\).

```groovy
dependencies {
    // ...
    implementation 'com.github.Minestom:Minestom:-SNAPSHOT'
}
```

{% hint style="info" %}
Minestom needs Java 11 or newer in order to run. Launching the server for the first time will also require an internet connection to retrieve some information like block & entity ids.
{% endhint %}

## Maven

When using Maven it is recommended to exclude the artifact `shrinkwrap-resolver-depchain` from the group `org.jboss.shrinkwrap.resolver` as otherwise resolving the dependencies will fail. Shrinkwrap can be added as a separate dependency if needed without issues to restore its functionality. Minestom as a dependency would look like this:

```markup
<dependency>
  <groupId>com.github.Minestom</groupId>
  <artifactId>Minestom</artifactId>
  <version><!--Minestom commit here--></version>
  <exclusions>
    <exclusion>
      <groupId>org.jboss.shrinkwrap.resolver</groupId>
      <artifactId>shrinkwrap-resolver-depchain</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

{% hint style="info" %}
Do not forget to add the repositories as described earlier, it is not a Gradle-thing only!
{% endhint %}

