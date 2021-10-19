---
description: Includes everything you need to have your first server running.
---

# Your first server

Some things are needed before being able to connect to your Minestom server.

* Initialize the server
* Registering events/commands
* Optional: create a ResponseDataConsumer (can be specified in the start() method)
* Start the server at the specified port and address

Here is a correct example:

```java
    public static void main(String[] args) {
        // Initialize the server
        MinecraftServer minecraftServer = MinecraftServer.init();

        // REGISTER EVENTS (set spawn instance, teleport player at spawn)

        // Start the server
        minecraftServer.start("0.0.0.0", 55555);
    }
```

However even after those steps, you will not be able to connect, what we miss here is an instance (the world)

_Please check the_ [_instances_](../world/instances.md) _and_ [_events_](../feature/events/) _pages if you have any question about how to create/listen to one_

```java
player.addEventCallback(PlayerLoginEvent.class, event -> {
   event.setSpawningInstance(YOUR_SPAWNING_INSTANCE);
});
```

Here is an example of a working Minestom server

```java
package demo;

import net.minestom.server.MinecraftServer;
import net.minestom.server.entity.Player;
import net.minestom.server.event.GlobalEventHandler;
import net.minestom.server.event.player.PlayerLoginEvent;
import net.minestom.server.instance.*;
import net.minestom.server.instance.batch.ChunkBatch;
import net.minestom.server.instance.block.Block;
import net.minestom.server.coordinate.Pos;
import net.minestom.server.world.biomes.Biome;

import java.util.Arrays;
import java.util.List;

public class MainDemo {

    public static void main(String[] args) {
        // Initialization
        MinecraftServer minecraftServer = MinecraftServer.init();

        InstanceManager instanceManager = MinecraftServer.getInstanceManager();
        // Create the instance
        InstanceContainer instanceContainer = instanceManager.createInstanceContainer();
        // Set the ChunkGenerator
        instanceContainer.setChunkGenerator(new GeneratorDemo());

        // Add an event callback to specify the spawning instance (and the spawn position)
        GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
        globalEventHandler.addListener(PlayerLoginEvent.class, event -> {
            final Player player = event.getPlayer();
            event.setSpawningInstance(instanceContainer);
            player.setRespawnPoint(new Pos(0, 42, 0));
        });

        // Start the server on port 25565
        minecraftServer.start("0.0.0.0", 25565);
    }

    private static class GeneratorDemo implements ChunkGenerator {

        @Override
        public void generateChunkData(@NotNull ChunkBatch batch, int chunkX, int chunkZ) {
            // Set chunk blocks
            for (byte x = 0; x < Chunk.CHUNK_SIZE_X; x++) {
                for (byte z = 0; z < Chunk.CHUNK_SIZE_Z; z++) {
                    for (byte y = 0; y < 40; y++) {
                        batch.setBlock(x, y, z, Block.STONE);
                    }
                }
            }
        }

        @Override
        public void fillBiomes(Biome[] biomes, int chunkX, int chunkZ) {
            Arrays.fill(biomes, Biome.PLAINS);
        }

        @Override
        public List<ChunkPopulator> getPopulators() {
            return null;
        }
    }

}
```

## Build the server JAR

After being able to launch the program you will probably want to build it and distribute it to a host or even a friend.

Minestom does not provide a jar of itself for the simple reason that this is your job. You will need to build your server and include all the Minestom dependencies.

First of all, the fat jar can be built using the Gradle shadow plugin as simple as adding

```groovy
id "com.github.johnrengelman.shadow" version "6.1.0"
```

If the jar is meant to be run, you also need to specify the class containing the main method.

```groovy
// Code sample, be sure to modify the 'Main-Class' value
// based on your application
jar {
    manifest {
        attributes 'Main-Class': 'fr.themode.minestom.MinestomTest',
                "Multi-Release": true
    }
}
```

With all of this set, all that is remaining is the build command, shadow provides the handy `shadowJar` task that you need to run and a working jar will magically appear!

Now, just to be sure that you understood everything, here is the complete `build.gradle` file that I have used to demonstrate it.

```groovy
plugins {
    id 'java'
    id "com.github.johnrengelman.shadow" version "6.1.0"
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()

    maven { url 'https://repo.spongepowered.org/maven' }
    maven { url 'https://jitpack.io' }
}

dependencies {
    // WARNING: outdated version, replace it to the latest
    // Reminder: can be found at https://jitpack.io/#Minestom/Minestom
    implementation 'com.github.Minestom:Minestom:1eea505da0'
}

jar {
    manifest {
        // WARNING: change the 'Main-Class' value
        attributes 'Main-Class': 'fr.themode.minestom.MinestomTest',
                "Multi-Release": true
    }
}
```
