# Tags

## Overview

A `Tag` represents a key, and a way to read/write a specific type of data. Generally exposed as a constant, you can use it to apply or read data from any `TagReadable` \(e.g. `Entity`, `ItemStack`, and soon enough `Block`\).

```java
Tag<String> myTag = Tag.String("key");
Entity entity = ...;
String data = entity.getTag(myTag);
```

Tags benefit are:

* Control writability and readability independently with `TagReadable`/`TagWritable`, ideal for immutable classes.
* Hidden conversion complexity, your code should not have to worry about how a `List<ItemStack>` is serialized.
* Automatic serialization support \(as backed by NBT\), easing data persistence and debuggability.

