# Chunk generator

Every instance need a chunk generator, they can be easily created by extending the ChunkGenerator class

Example found [here](https://github.com/Minestom/Minestom/tree/master/src/test/java/demo/generator/NoiseTestGenerator.java)

We have ChunkGenerator\#generateChunkData which is called once for all chunk, the batch is then executed and the chunk packet sent to all nearby players.

Populators can also be specified, they are executed after the chunk generator as a way to "populate" the world \(trees, structures, etc...\)

