# Persistent data

{% hint style="warning" %}
Consider using the [Tag API](../feature/tags.md) instead
{% endhint %}

Minestom allows you to specify your own way of managing/creating/removing persistent data. The storage manager can be accessed as such:

```java
StorageManager storageManager = MinecraftServer.getStorageManager();
```

You can and should define the StorageSystem \(it defines how data is accessed, can be by using your OS file system or an external database for example\)

```java
// FileStorageSystem is the default system and uses your OS files to store data
storageManager.defineDefaultStorageSystem(FileStorageSystem::new);
```

You can easily create your own by implementing the StorageSystem interface.

### Storage location

Storage locations are a way to separate your data in multiple categories. There are created/retrieved by calling:

```java
StorageLocation storageLocation = storageManager.getLocation(YOUR_LOCATION_IDENTIFIER);
```

Please note that the "location" is not related in any way to a folder or a file, it can be but this is dependent on the StorageSystem implementation you are using \(the storage system "FileStorageSystem" that we took as an example above WILL use/create a folder with the exact same name as the location, but this will not always be the case for all\)

You can then write/read anything from it as long as you know the key

```java
byte[] data;
...
storageLocation.set("test", data);
data = storageLocation.get("test");
```

WARNING: You shouldn't open a data location using a different StorageSystem than the one it has been created with

### Integration with SerializableData

Most of the data that you will store will be in the form of SerializableData. \([see data](https://wiki.minestom.com/storage/data)\)

There are two kinds of SerializableData that you would want to store:

1. Data which should not change but be unique and applied to multiple objects
2. Data linked to an element \(or shared to multiple\) and which should be synchronized

For the first type you would need:

```java
// The data is gonna be retrieved, cloned and applied to the DataContainer specified
storageLocation.getAndCloneData(key, dataContainer);
```

And for the second:

```java
// The data is gonna be retrieved, applied to the DataContainer
// And the storage location will cache it for further saving
storageLocation.getAndCacheData(key, dataContainer);
...
// Save all the cached SerializableData
storageLocation.saveCachedData();
```

