# Extensions

Summary:

* [Writing your own extension for Minestom](extensions.md#writing-your-own-extension-for-minestom)
* [How extensions are loaded](extensions.md#how-extensions-are-loaded)
* [Dependencies](extensions.md#dependencies)
* [Callback order](extensions.md#callback-order)
* [Testing in a dev environment](extensions.md#testing-in-a-dev-environment)
* [Dynamically unloading and \(re\)loading extensions](extensions.md#dynamically-unloading-and-re-loading-extensions)

## Writing your own extension for Minestom

_To test in a dev environnement, see last section._

Start by creating a new extension class:

```java
package testextension;

import net.minestom.server.extensions.Extension;

public class TestExtension extends Extension {
    @Override
    public void initialize() {
        System.out.println("Hello from extension!");
    }

    @Override
    public void terminate() {

    }
}
```

Then, create a `extension.json` at the root of the resources folder \(`src/main/resources` for instance\) and fill it up:

```javascript
{
  "entrypoint": "testextension.TestExtension",
  "name": "TestExtension",
  "version": "1.0.0",
  "codeModifiers": [
    "testextension.TestModifier"
  ],
  "mixinConfig": "mixins.testextension.json",
  "dependencies": [
    "DependentExtension",
    "Extension2"
  ],
  "externalDependencies": {
    "repositories": [
      {"name": "Central", "url": "https://repo1.maven.org/maven2/"}
    ],
    "artifacts": [
      "com.squareup:javapoet:1.13.0"
    ]
  }
}
```

* `entrypoint`: Fully qualified name of your extension class
* `name`: Name to use to represent the extension to users. Must match regex `[A-Za-z][_A-Za-z0-9]+`
* `version`: Version of your  extension
* `codeModifiers (optional)`: List of code modifier fully qualified-named classes to modify Minestom classes at launch time
* `mixinConfig (optional)`: Name of a JSON file for support of Mixin injection
* `dependencies (optional)`: List of extension names required for this extension to work.
* `externalDependencies (optional)`: List of external libraries used for this extension \(see Dependencies\)

## How extensions are loaded

This section is purely informational and not required to work on extensions, but it is a good thing to know how extensions are loaded inside Minestom.

#### 1. Discovery

At launch, Minestom inspects the `extensions` folder \(resolved from the current working folder\) for jar files. For each file found, it then checks if there is an `extension.json` file and attempts to parse it. If the file exists, and parsing succeeds, the extension is considered discovered.

Discovery can also be forced when using `ExtensionManager#loadDynamicExtension(File)` but works the same.

#### 2. Load order generation / Dependency solving

Then, Minestom ensures all required dependencies for the extension are found. For external dependencies, it will download them if necessary. For extension dependencies, it simply checks if they are already loaded, or about to be loaded \(because discovered in the current load-cycle\).

#### 3. Classloading and code modifiers setup

If the extension survived dependency solving, a new classloader is created for the extension to load its classes, and any potential code modifiers declared inside `extension.json` \(including the Mixin config\) are loaded.

#### 4. Instanciation and callbacks

The extension is then instanciated from the class provided inside `entrypoint`, and the `preInitialize`, `initialize` and `postInitialize` callbacks are called. \(see [Callback order](extensions.md#callback-order) for more information\)

## Dependencies

Minestom extensions can have two types of dependencies: 

1. Extension dependencies 

2. External dependencies

### Extension dependencies

Extensions can require other extensions to be present at runtime in order to be loaded. This is done via the `dependencies` array inside `extension.json`.

Extensions and their dependencies will be loaded in parent-first order: the root extensions of the dependency graph will always be loaded first, then extensions with one dependency, then extensions with two, and so on. If an extension is a dependency of at least two other, it is guaranteed that it will be loaded only once.

### External dependencies

Your extension is free to depend on external libraries. For the moment, only maven-accessible libraries are supported.

To declare external dependencies, use the `externalDependencies` object inside `extension.json`:

```javascript
"externalDependencies": {
    "repositories": [
      {"name": "Central", "url": "https://repo1.maven.org/maven2/"}
    ],
    "artifacts": [
      "com.squareup:javapoet:1.13.0"
    ]
  }
```

* `repositories` is the list of repositories to contact to get the artifacts
  * `name`: Name of the repository, used to recognize the repository inside logs
  * `url`: URL of the repository to contact
* `artifacts` is the list of Maven coordinates from the dependencies you want to use

Minestom will download and cache the libraries inside `extensions/.libs/`, so that it does not require to redownload them at each launch.

Different extensions can depend on the same library \(with same coordinates\) and will share the code.

## Callback order

During `MinecraftServer#start`, Minestom calls `preInitialize` on all extensions, then `initialize` on all extensions, and finally `postInitialize` on all extensions. Minestom does **NOT** guarantee the loading order of extensions, but it should be deterministic.

## Testing in a dev environment

The easiest option to ensure your extension is recognized, and that you can register code modifiers, is to wrap your main method inside a special launcher calling `Bootstrap#bootstrap`:

* First argument: `mainClass` fully qualified name of your main class
* Second argument: `args` program arguments

  `Bootstrap` will then setup extensions, modifiable classloader and mixin support, then call your `main(String[] args)` method.

Finally, when launching your wrapping launcher, add the following VM arguments:

* `-Dminestom.extension.indevfolder.classes=<folder to compiled classes of your extension>` Specifies the folder in which compiled classes of your extension are. With a default Gradle setup, `build/classes/java/main/` _should_ work.
* `-Dminestom.extension.indevfolder.resources=<folder to resources of your extension>` Specifies the folder in which resources of your extension are. With a default Gradle setup, `build/resources/main/` _should_ work.

Launcher example:

```java
package testextension;

import net.minestom.server.Bootstrap;
import org.spongepowered.asm.launch.MixinBootstrap;
import org.spongepowered.asm.mixin.Mixins;

// To launch with VM arguments:
// -Dminestom.extension.indevfolder.classes=build/classes/java/main/ -Dminestom.extension.indevfolder.resources=build/resources/main/
public class TestExtensionLauncher {

    public static void main(String[] args) {
        Bootstrap.bootstrap("YOUR_MAIN_CLASS", args);
    }
}
```

## Dynamically unloading and \(re\)loading extensions

* [Unloading](extensions.md#unloading)
* [Reloading](extensions.md#reloading-an-extension)
* [Dynamic load](extensions.md#dynamic-load)
* [Swapping extension jar at runtime](extensions.md#swapping-extension-jar-at-runtime)

### Unloading

Under the hood, Minestom registers each extension inside its own classloader. This allows extensions to be reloaded from disk without having to reboot the server.

This feature comes at a cost: because we want to fully reload an extension, all its classes must be reloaded. To do so, their classloader must be garbage-collected. This requires all references to the classloader and its classes to be garbage-collected.

This means that Minestom code _cannot_ have any reference to your extension when reloading/unloading. That includes event callbacks \(for ANY type of event\), custom biomes, custom blocks, commands, and so on.

To ensure your callbacks and code is unregistered from Minestom, override the `terminate` method of your extensions, and unregister everything there.

**If your extension is depended upon by other extensions, this will unload the dependent extensions too.**

Now that you are aware of the requirements, let's see how to unload an extension:

```java
// get an ExtensionManager, for instance via MinecraftServer.getExtensionManager();
extensionManager.unloadExtension("MyExtensionName"); // MyExtensionName must match the name given inside the extension.json file
```

That's it, this line will unload the extension and all its dependents.

### Reloading an extension

_See Unloading for more information_

**If your extension is depended upon by other extensions, this will reload the dependent extensions too.**

This allows to reload an extension from the same jar file that it was loaded before.

```java
// get an ExtensionManager, for instance via MinecraftServer.getExtensionManager();
extensionManager.reload("MyExtensionName"); // MyExtensionName must match the name given inside the extension.json file
```

### Dynamic load

Minestom allows dynamic loading of extensions. You do have to be aware that the extension will have its `preInitialize`, `initialize` and `postInitialize` callbacks called immediatly upon load.

This dynamic loading goes through the exact same phases as an extension loaded during server startup.

```java
// get an ExtensionManager, for instance via MinecraftServer.getExtensionManager();
File extensionJar = ...; // the location of the extension jar to dynamically load
extensionManager.loadDynamicExtension(extensionJar);
```

### Swapping extension jar at runtime

Now that you know how to dynamically unload and load an extension, the procedure is rather simple: 

1. Unload the extension via `ExtensionManager#unload(String)` 

2. Replace the jar 

3. \(Re-\)Load the extension via `ExtensionManager#loadDynamicExtension(File)`

