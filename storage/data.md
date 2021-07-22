# Data

{% hint style="warning" %}
Consider using the [Tag API](../feature/tags.md) instead
{% endhint %}

A data object is basically a Map wrapper. A [DataContainer](https://minestom.github.io/Minestom/net/minestom/server/data/DataContainer.html) is an object which contains a Data object, there are multiple containers such as Instance, ItemStack, Entity, Block \(in a particular way, the data object is specified when setting a block\).

Basically, it is used to link values to an element of the game.

For instance:

```java
Data data = dataContainer.getData();
data.set("test", 1, Integer.class);
int test = data.get("test");
```

## Serializable data

A SerialiableData object can, as the name imply, be serialized.

It should be used in hand with our [Storage system](data.md#serializable-data).

