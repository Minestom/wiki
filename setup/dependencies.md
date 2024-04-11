---
description: How to add Minestom as a dependency in your project.
---

# Dependencies

{% hint style="warning" %}
Minestom needs Java 21 or newer in order to run. If you are using Gradle, you must use version 8.5 or higher.
{% endhint %}

{% hint style="info" %}
To find a VERSION string, go to [Minestom's commit history](https://github.com/Minestom/Minestom/commits/master/) and click the copy button next to the commit you want to use. Maven central uses the first 10 characters.
{% endhint %}

Adding Minestom to your project is really simple, you only need to add a few repositories:

## Repositories

{% tabs %}
{% tab title="Gradle" %}
```groovy
repositories {
    // ...
    mavenCentral()
    maven { url 'https://jitpack.io' }
}
```
{% endtab %}

{% tab title="Gradle (Kotlin)" %}
```groovy
repositories {
    // ...
    mavenCentral()
    maven(url = "https://jitpack.io")
}
```
{% endtab %}

{% tab title="Maven" %}
```markup
<repositories>
    <!-- ... -->
    <repository>
        <id>jitpack</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>
```
{% endtab %}
{% endtabs %}

## Dependencies

{% tabs %}
{% tab title="Gradle" %}
```groovy
dependencies {
    // ...
    implementation 'net.minestom:minestom-snapshots:VERSION'
}
```
{% endtab %}

{% tab title="Gradle (Kotlin)" %}
```groovy
dependencies {
    //...
    implementation("net.minestom:minestom-snapshots:VERSION")
}
```
{% endtab %}

{% tab title="Maven" %}
```markup
<dependencies>
    <!-- ... -->
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>minestom-snapshots</artifactId>
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
