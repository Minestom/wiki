# Attributes

Attributes are one of the easiest ways to change certain aspects about a player. This api allows for simple and traceable player attribute modification.

Go [here](https://javadoc.minestom.net/net/minestom/server/attribute/Attribute.html) to see all the possible attributes.

## Attribute Instances

All attributes have a corresponging attribute instance. To get the attribute instance, do as follows:

```java
LivingEntity#getAttribute(Attribute)
```

Once you have an attribute instance, you can modify the value and base value of the attribute along with adding modifiers. It is recommended that you use modifiers as they can be identified and easily removed later.

> For more information, check out the [javadocs](https://javadoc.minestom.net/net/minestom/server/attribute/package-summary.html).
