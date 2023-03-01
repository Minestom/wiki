# Instances

## What is an instance

Instances are what replace "worlds" from Minecraft vanilla, those are lightweight and should offer similar properties. 
Imagine that you wanted to implement two worlds/dimensions: the overworld and the nether, each with their own block data, spawn points and so on. In practice, this would be two separate InstanceContainers (a type of instance), one for each of the two worlds/dimensions. They can then be used to make players go to them through actions like going through a portal, clicking a button and so on.

Each instance contains the following data
- Blocks, whether generated or modified by players / entities / whatever is capable of modifying blocks
- The generator (More on this later, but essentially the "rules" that are used to generate a new chunk (section of the world) whenever a player attempts to load a non existing chunk)
- Entities, like boats, mobs, dropped items etc.

There are two different types of instances, currently `InstanceContainer` and `SharedInstance` which offer similar functionality, they're explained in sections below.

## Example Usage
In order to create an instance, you need use what's called the "InstanceManager". 
Here is a practical example of how you could create a nether and overworld dimension using an InstanceContainer:
```java
InstanceManager instanceManager = MinecraftServer.getInstanceManager();
InstanceContainer overworld     = instanceManager.createInstanceContainer();
InstanceContainer nether        = instanceManager.createInstanceContainer();
```
or
```java
InstanceContainer overworld     = MinecraftServer.getInstanceManager().createInstanceContainer();
InstanceContainer nether        = MinecraftServer.getInstanceManager().createInstanceContainer();
```
Both are essentially the same, there are some performance differences between them but they're so miniscule it essentially doesn't matter. This function returns the world/dimension's InstanceContainer (in this case `overworld` and `nether`) which can then be used to for example teleport a player to that dimension.

## Getting an entity's dimension
Getting the instance of an entity (like a Player), as in in which dimension they are located is as easy as doing
Entity.getInstance()

## SharedInstance

Knowing that an InstanceContainer is essentially a world/dimension, what's the difference between that and a `SharedInstance`?
Imagine you want to run three different minigames using the same map. It would be possible to create three separate `InstanceContainers` for all three minigames using the same map, but this would mean that three "copies" of the same map now exist which, in some cases, could take up a lot of RAM (as an InstanceContainer loads the world data into memory). In order to prevent this, it's possible to create a `SharedInstance` which allows the same map to exist multiple times as if there were multiple InstanceContainers while only allocating one of them into memory. For example:

```
Minigame_1 <- InstanceContainer
Minigame_2 <- SharedInstance of Minigame_1
Minigame_3 <- SharedInstance of Minigame_1
```
Here there's only one InstanceContainer which is the world used for the minigame; it gets allocated into memory once. Minigame_2 is a `SharedInstance` of Minigame_1, meaning that it copies the data from memory of Minigame_1 without allocating it again, effectively making "a copy" (it's not really a copy, it's just being accessed) of Minigame_1, the same being the case with Minigame_3

### But if Minigame_1's data is being "copied", what if I want the maps to have different mobs / entities?
A `SharedInstance` only copies over block data. Entities like players, mobs, item drops, arrows etc will not be "copied".

As all minigames are accessing the same data, if a block is broken or placed in any of those 3 worlds, that same change will be reflected on the others. This could, in theory, be problematic if players were to modify a block from two different "copies" of the world at the exact same time, so just keep that in mind.

You can create a `SharedInstance` using:

```java
SharedInstance sharedInstance = instanceManager.createSharedInstance(instanceContainer);
```

## ChunkGenerator


In order to have a valid world generation, you need to specify which `ChunkGenerator` the instance should use, without it no chunk can be generated. (check [here](https://github.com/Minestom/Minestom/wiki/Chunk-generator) to make your own)

```java
instance.setChunkGenerator(YOUR_GENERATOR);
```

## Create your own Instance type

You are able to create your own class extending `Instance` and add entities to it.

In this case, the only thing you need to be aware of is that all instances need to be registered manually in the instance manager.

```java
instanceManager.registerInstance(YOUR_CUSTOM_INSTANCE);
```

This method is ONLY required if you instantiate your instance object manually, `InstanceManager#createInstanceContainer` and `InstanceManager#createSharedInstance` already register the instance internally.

## Save your instances/chunks

It is also essential to notice that, by default, the chunks of the instance are only stored in memory. In order to have them stored in a persistent way, you need to serialize and deserialize them. Please check the [Chunks management](chunk-management.md) page for further information.

Minestom uses Anvil as its default world format, conveniently located in the `AnvilLoader` class. Just put your world in the `world` folder, and see it work :)

```java
var instance = instanceManager.createInstanceContainer();
// Save all currently loaded chunks to the IChunkLoader
instanceContainer.saveChunksToStorage();
```
