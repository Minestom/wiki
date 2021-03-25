---
description: >-
  This page describes what you need to know about chunks management, more
  specifically for InstanceContainer
---

# Chunk management

## Load/Save Steps

When trying to load a chunk, the instance container does multiple checks in this order: 

1. Verify if the chunk is already loaded \(stop here if yes\)
2. Try to load the chunk from the instance [IChunkLoader](https://javadoc.minestom.com/net/minestom/server/instance/IChunkLoader.html) using [IChunkLoader\#loadChunk](https://javadoc.minestom.com/net/minestom/server/instance/IChunkLoader.html#loadChunk%28net.minestom.server.instance.Instance,int,int,net.minestom.server.utils.chunk.ChunkCallback%29) \(stop here if the chunk loading is successful\)
3. Create a new chunk and execute the instance ChunkGenerator \(if any\) to it to generate all of the chunk's blocks.

When trying to save a chunk, [IChunkLoader\#saveChunk](https://javadoc.minestom.com/net/minestom/server/instance/IChunkLoader.html#saveChunk%28net.minestom.server.instance.Chunk,java.lang.Runnable%29) is called.

### Default behavior

[BasicChunkLoader](https://javadoc.minestom.com/net/minestom/server/instance/MinestomBasicChunkLoader.html) is the default chunk loader used by all `InstanceContainer`, it does make use of the storage location of the instance \(WARNING: will not work if the storage location is null\)

### I still cannot join the instance

Even if your instance is able to load chunks it doesn't mean that it will do so automatically. However, you can configure it to do so with the following:

```java
instanceContainer.enableAutoChunkLoad(true);
```

It is required because some servers could prefer to have complete control over which chunks are loaded, in order to save memory or for performance purpose.

## Create your own chunk type

[Chunk](https://javadoc.minestom.com/net/minestom/server/instance/Chunk.html) is an abstract class, you can simply create a new class extending it to create your own implementation.

Making your own chunk implementation allows you to customize how you want blocks to be stored, how you want chunks tick to happen, etc...

### How to make my instance use my implementation

If you are using a simple [InstanceContainer](https://javadoc.minestom.com/net/minestom/server/instance/InstanceContainer.html) with the default [IChunkLoader](https://javadoc.minestom.com/net/minestom/server/instance/IChunkLoader.html) you will just need to change the instance's chunk supplier

```java
instanceContainer.setChunkSupplier(YOUR_CHUNK_SUPPLIER);
```

It will be called when a chunk object needs to be provided.

