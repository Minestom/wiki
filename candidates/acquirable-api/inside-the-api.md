---
description: >-
  Describes how ticks are executed internally and how objects can be acquired
  safely
---

{% hint style="info" %}
This API is currently not in mainstream Minestom.
The working version can be found [here](https://github.com/Minestom/Minestom/tree/thread-safety-experimental).
{% endhint %}

# The inside

I will begin by saying that you do not need to know anything written here to utilize the acquirable API. It can however teach you about our code structure and how it achieves thread-safety. Be sure to read all the previous pages in order to properly understand everything said here.

## Tick architecture 

As described in [Server ticks](../tick-threads.md), ticks are separated in multiple batches. After those are created, every batch gets assigned to a thread from the ThreadProvider thread pool.

How are batches assigned? Well, each batch has a "cost" based on the number of entities/chunks/instances it contains. This is less efficient compared to the famous `ExecutorService` interface in the JDK, but it has a huge advantage in our case for acquisitions.

After all this, threads start and the `UpdateManager` will wait until all of them are done. The cycle continues until the server stops.

## Object acquisition

After a batch gets assigned to a thread, the same happens to every element added to it. Meaning that each entity knows in which thread it will be ticked before it even happens!

What advantage does it have? It allows us to know if the object in question can be safely accessed! When you execute Acquirable\#acquire, it will first check if the current thread is the same as the one where the object to acquire will be ticked, meaning no synchronization required, the overhead in this case is a simple `Thread#currentThread` call.

This is obviously the best scenario but it does not always happen, how does the system react if the two threads are different? Well firstly it will signal to the object's thread that an acquisition needs to happen and then block the current thread, and secondly, it will wait for the signaled thread to handle the acquisition. Acquisition signals are checked at the start of every entity tick, and at the end of the thread tick execution.

During acquisition handling, the thread is blocked until all of them are processed and can then continue its execution safely.

## Conclusion

Nothing is magical, and this API is not an exception. It has the potential to make your application faster when acquisitions are controlled \(to limit synchronization\) and with a `ThreadProvider` specific to your need. If you want to have one world per player, then using one batch per `Instance` is probably the best solution. If you have a very precise pattern where every 3 chunks are completely independent of each other, manage your bathes in this direction!

