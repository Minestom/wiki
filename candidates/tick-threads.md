{% hint style="info" %}
This API is currently not in mainstream Minestom.
The working version can be found [here](https://github.com/Minestom/Minestom/tree/thread-safety-experimental).
{% endhint %}

# Server ticks

In Minestom, you have the choice to organize how you want threads to execute your instances, chunks & entities tick. This is possible by creating your own `ThreadProvider` \(or use an already existing one\).

A `ThreadProvider` gets callbacks for relevant events such as instance create/delete and chunk load/unload. It does generate, each tick, one or multiple **batches** to define groups of `Tickable` elements to update in the same thread.

Here is a small example, the class extends `ThreadProvider` and show here the `ThreadProvider#update(long)` method:

```java
    // PER CHUNK BATCH
    @Override
    public void update(long time) {
        for (Instance instance : INSTANCE_MANAGER.getInstances()) {
            // Tick instance
            createBatch(batchHandler -> batchHandler.updateInstance(instance, time), time);

            for (Chunk chunk : instance.getChunks()) {
                // Tick chunks & entities
                createBatch(batchHandler -> {
                    batchHandler.updateChunk(instance, chunk, time);
                    batchHandler.updateEntities(instance, chunk, time);
                }, time);
            }
        }
    }
```

In this example, you have one batch per instance, and a single batch per chunks to execute both the chunk and entities tick. Here is a more likely example to show how to update a whole instance \(instance/chunk/entity tick in a single batch\):

```java
    // PER INSTANCE BATCH
    @Override
    public void update(long time) {
        for (Instance instance : INSTANCE_MANAGER.getInstances()) {
            createBatch(batchHandler -> {
                // Tick instance
                batchHandler.updateInstance(instance, time);

                for (Chunk chunk : instance.getChunks()) {
                    // Tick chunks & entities
                    batchHandler.updateChunk(instance, chunk, time);
                    batchHandler.updateEntities(instance, chunk, time);
                }

            }, time);
        }
    }
```

To use your thread provider, simply call `UpdateManager#setThreadProvider(ThreadProvider)` before the server starts.

