{% hint style="info" %}
This API is currently not in mainstream Minestom. 
The working version can be found [here](https://github.com/Minestom/Minestom/tree/thread-safety-experimental).
{% endhint %}

# Acquirable API

## Presentation

An `Acquirable<T>` object represents an object of type `T` that you can retrieve but where its thread-safe access is not certain.

To give an example, imagine two entities very far from each other and therefore ticked in different threads. Let's imagine that entity A wants to trade items with entity B, it is something that would require synchronization to ensure that the trade happens successfully. From entity A's thread, you can retrieve a `Acquirable<Entity>` containing entity B, and from there acquire it to have safe access to the entity in a different thread.

The API provides multiple benefits:

* Thread-safety with synchronous code
* Same code whether you use one thread per chunk or a single for the whole server
* Better control over your data to identify bottlenecks

Here how the acquirable API looks in practice:

```java
Acquirable<Entity> acquirableEntity = ...;
System.out.println("Start acquisition...");
acquirableEntity.acquire(entity -> {
    // You can use "entity" safely in this consumer!
});
System.out.println("Acquisition happened successfully");
```

`Acquirable#acquire` will block the current thread until `acquirableEntity` becomes accessible, and execute the consumer **in the same thread** once it is the case.

It is important to understand that the consumer is called in the same thread, it is the whole magic of the Acquirable API, your code stays the exact same.

The entity object from the consumer should however **only** be used inside of the consumer. Meaning that if you need to save the entity somewhere for further processing, you shall use the acquirable object instead of the acquired one.

```java
    private Acquirable<Entity> myEntity; // <- GOOD
    // private Entity myEntity <- NO GOOD, DONT DO THAT

    public void randomMethod(Acquirable<Entity> acquirableEntity) {
        this.myEntity = acquirableEntity;
        acquirableEntity.acquire(entity -> {
            // "myEntity = entity" is not safe, always cache the acquirable object
        });
    }
```

Now, if you do not need the acquisition to happen synchronously you have the choice to create the request and handle it later on \(at the end of the tick\), for this you simply need to "schedule" the acquisition.

```java
Acquirable<Entity> acquirableEntity = getAcquiredElement();
System.out.println("Hey I am starting the acquisition");
acquirableEntity.scheduledAcquire(entity -> {
    System.out.println("Hallo");
});
System.out.println("Hey I scheduled the acquisition");
```

Will print you:

```text
Hey I am starting the acquisition
Hey I scheduled the acquisition
Hallo
```

## Acquirable Collections

Let's say you have a `Collection<Acquirable<Player>>` and you want to access **safely** all of the players it contains. You have multiple solutions, each having pros & cons.

#### Naive loop

The one that you probably have in mind is:

```java
// NAIVE ACQUIRABLE LOOP
Collection<Acquirable<Player>> acquirablePlayers = getOnlinePlayers();
for(Acquirable<Player> acquirablePlayer : acquirablePlayers){
    acquirablePlayer.acquire(player -> {
        // Do something...
    });
}
```

It does work, but not efficient at all since you have to acquire each element one by one.

#### Acquisition\#acquireCollection

This solution will create a new collection, acquire efficiently every element, and execute the callback.

```java
Collection<Acquirable<Player>> acquirablePlayers = getOnlinePlayers();
Acquisition.acquireCollection(acquirablePlayers, ArrayList::new, players -> {
    // Do something...
});
```

Useful when you absolutely need to have a collection with the same elements. Can be quite expensive since a new collection is allocated every time and that all elements are blocked until the collection is created and released.

#### Acquisition\#acquireForEach

It is the most efficient way to loop through a collection, the callback is executed for each individual element and stop only once all elements have been acquired.

```java
Collection<Acquirable<Player>> acquirablePlayers = getOnlinePlayers();
Acquisition.acquireForEach(acquirablePlayers, player -> {
    // Do something...
});
```

It is the most used one, simply because it doesn't create as much overhead as the previous ones. The element in the consumer is released directly without having to wait for the others.



## Access the acquirable object without acquiring it

I can understand that having callbacks everywhere even if you know what you are doing is not ideal. You also have the choice to directly unwrap the acquirable object to retrieve the value inside.

```java
Acquirable<Entity> acquirableEntity = ...;
Entity entity = acquirableEntity.unsafeUnwrap();
```

A similar method exists for collections.

```java
ConnectionManager connectionManager = MinecraftServer.getConnectionManager();
// Create an unsafe collection view from an acquirable one
Collection<Player> players = new AcquirableCollectionView<>(connectionManager.getOnlinePlayers());
// Shortcut
Collection<Player> players = connectionManager.getUnsafeOnlinePlayers();
```

{% hint style="warning" %}
Those are not safe operations, be sure to read the [Thread safety](../../thread-architecture/thread-safety.md) page to understand the implications.
{% endhint %}

I would personally recommend commenting everywhere you use those unsafe methods to indicate why this operation does not compromise the application thread-safety. If you cannot find any reason, you likely shouldn't.

## What type to request and return in methods

You have obviously the right to do what you prefer. But as a general rule, you should return `Acquirable<T>` objects and request for `T`.

The reason behind this choice is that you are sure \(unless unsafe methods are used\) that you will have safe access to the given parameter, but that you do not know what the user will want to do with it once you return.

