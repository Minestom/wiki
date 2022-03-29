# Generation

{% hint style="warning" %}
The new generation API is in progress, below here is a draft
{% endhint %}

## Basics

Each `Instance` has an optional `Generator` that is responsible for generating areas of various sizes.

The area size is abstracted as a `GenerationUnit` representing an aggregate of sections, the generator has then the ability to place blocks (and biomes) using relative and absolute coordinates. The dynamically sized area allows the API to be more flexible, and the instance to choose whether to generate full chunks at once or section by section without changing the generator.

Generation tasks are currently forwarded to the common JDK pool. Virtual threads will be used once Project Loom is integrated into the mainline.

## Your first flat world

Here is the naive way of generating a flat world from y=0 to y=40

```java
Instance instance = ...;
instance.setGenerator(unit -> {
    final Point start = unit.absoluteStart();
    for (int x = 0; x < 16; x++) {
        for (int z = 0; z < 16; z++) {
            for (int y = 0; y < 40; y++) {
                unit.modifier().setBlock(start.add(x, y, z), Block.STONE);
            }
        }
    }
});
```

`GenerationUnit#absoluteStart` returns the lowest coordinate of the unit which is useful for absolute placements. Now, we can heavily simplify the code by using one of our hand-optimized method:

```java
Instance instance = ...;
instance.setGenerator(unit -> 
    unit.modifier().fillHeight(0, 40, Block.STONE));
```
