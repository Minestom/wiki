# Block States

Manipulating block states within Minestom is easy provided you understand the systems in place.

In order to increase performance, Minestom stores block states as a block id that also represents the type of block \(These IDs changes in between protocol versions\). As an example; in 1.16.4, blocks with a state ID of between 6840 and 6850 inclusive, are the various block states of the dropper. However, blocks with a state ID of 6851 are white terracotta, and blocks with a state ID of 6852 are orange terracotta. Sections of the entire range of ~17000 \(as of 1.16\) different block states, all correspond to a different state of a block. To see the entire mappings for each block, you can use this small piece of code in your Minestom project:

```java
int prim = 0;
Block blockLast = Block.AIR;

for (int i = 0; i < 17111; i++) {
    final Block block = Block.fromStateId((short) i);

    if (block == null) {
        continue;
    }

    if (block.equals(blockLast)) {
        continue;
    }

    System.out.println(blockLast.getName() + ": " + prim + " -> " + (i - 1));
    prim = i;
    blockLast = block;
}
```

Remembering each state ID that corresponds to each block state of a block is impractical, which is why systems. Instead of remembering each block state, common practice would be to calculate the block state that is used directly in the Minecraft protocol.

This is done by getting the gross amount of permutations for each block property in a block state and multiplying each of them together.

For example:

Here I have an iron bar's block state's specification \(found on [https://minecraft.gamepedia.com/](https://minecraft.gamepedia.com/)\) \(notice order is important\):

**east** \| `false` - `false` `true`

**north** \| `false` - `false` `true`

**south** \| `false` - `false` `true`

**waterlogged** \| `false` - `false` `true`

**west** \| `false` - `false` `true`

For the **east** property, there are two values.

For the **north** property, there are two values.

For the **south** property, there are two values.

For the **waterlogged** property, there are two values.

For the **west** property, there are two values.

This means that this block has `2 * 2 * 2 * 2 * 2` block states.

let's verify this:

Excerpt from block mappings:

```text
IRON_BARS: 4633 -> 4665
```

There is a difference of 32 here.

`2 * 2 * 2 * 2 * 2 = 32`

Now to calculate the ID with our chosen values, we need to loop the property values from top to bottom \(left to right\). Identically to how binary bits operate. For example:

4633 \| **east**: `false`, **north**: `false`, **south**: `false`, **waterlogged**: `false`, **west**: `false`

4634 \| **east**: `true`, **north**: `false`, **south**: `false`, **waterlogged**: `false`, **west**: `false`

4635 \| **east**: `false`, **north**: `true`, **south**: `false`, **waterlogged**: `false`, **west**: `false`

4636 \| **east**: `true`, **north**: `true`, **south**: `false`, **waterlogged**: `false`, **west**: `false`

4637 \| **east**: `false`, **north**: `false`, **south**: `true`, **waterlogged**: `false`, **west**: `false`

Like always, your implementation of this is up to you and how you would like to use the code.

If you would like to see a complete working example of a block state system, the [Vanilla Reimplementation](https://github.com/Minestom/VanillaReimplementation/tree/master/src/main/java/net/minestom/vanilla/blocks)'s block state system works well, assuming that the correct properties are provided.

