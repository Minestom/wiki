# Blocks



Blocks are a bit special on Minestom, there are normal vanilla blocks that are only visual and `CustomBlock` which contains multiple callbacks in order to expand their functionalities.

### Custom block

In order to create your own `CustomBlock` you need to create a class extending it, implement all of its abstract methods, and finally register it using `BlockManager`.

```java
BlockManager blockManager = MinecraftServer.getBlockManager();
blockManager.registerCustomBlock(YOUR_CUSTOMBLOCK_CONSTRUCTOR);
```

Examples of custom blocks can be found [here](https://github.com/Minestom/Minestom/tree/master/src/test/java/demo/blocks)

Some things to point out are the `CustomBlock#getCustomBlockId` which should return a UNIQUE id independent from the vanilla block id and should never be changed after having chunks saved since it could lead to corruption.

There is also a special `CustomBlock#getBreakDelay` which can be used to customize the breaking time of any custom block, can be disabled when &lt; 0

