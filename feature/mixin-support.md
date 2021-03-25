# Mixin support

## Base set-up for Minestom extensions

In your extension.json file, add this line:

```text
  "mixinConfig": "mixins.testextension.json"
```

Replace `mixins.testextension.json` with the name of the JSON configuration file for Mixin.

Example of Mixin configuration for Minestom \(`mixins.testextension.json`\):

```text
{
  "required": true,
  "minVersion": "0.8",
  "package": "testextension.mixins",
  "target": "@env(DEFAULT)",
  "compatibilityLevel": "JAVA_11",
  "mixins": [
    "InstanceContainerMixin",
    "DynamicChunkMixin"
  ]
}
```

For more information, check the Mixin wiki and documentation: [Wiki](https://github.com/SpongePowered/Mixin/wiki) and [Documentation](https://docs.spongepowered.org/stable/en/contributing/implementation/mixins.html)

