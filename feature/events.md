---
description: Events are the way to trigger code based on actions.
---

# Events

### Who can listen to events

Events can go forwarded to any object implementing the [`EventHandler`](https://minestom.github.io/Minestom/net/minestom/server/event/handler/EventHandler.html) interface. Examples include `Entity`, `Instance`, and the `GlobalEventHandler`.

### Listen to events

Events are everywhere, they are as simple as

```java
player.addEventCallback(EVENT_CLASS, event -> {
   // Do your event things
});
```

for example

```java
player.addEventCallback(PlayerBlockInteractEvent.class, event -> {
   if (event.getHand() != Player.Hand.MAIN)
      return;

   short blockId = player.getInstance().getBlockId(event.getBlockPosition());
   Block block = Block.fromId(blockId);
   player.sendMessage("You clicked at the block " + block);
});
```

Basics events are listed [here](https://github.com/Minestom/Minestom/tree/master/src/main/java/net/minestom/server/event)

The recommended way of how and where to put the listeners is by using `GlobalEventHandler`, which contains the global event listeners.

```java
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addEventCallback(EVENT_CLASS, event -> {
   // Do your event things
});
```

Another viable solution is to use `ConnectionManager#addPlayerInitialization` which is called just after the creation of the player object \(you SHOULDN'T do anything other than registering events\) and allow to have player-specific listeners.

```java
ConnectionManager connectionManager = MinecraftServer.getConnectionManager();
connectionManager.addPlayerInitialization(player -> {
   // Do what you want with the player
   // player.addEventCallback ...
});
```

{% hint style="info" %}
Event callbacks can also be added to an Instance, all events called to an entity will also be forwarded to its instance.
{% endhint %}

### Create a custom event

In order to do so, you need a class which extends Event or CancellableEvent and finally call it by doing

```java
MyCustomEvent customEvent = new MyCustomEvent();
player.callEvent(MyCustomEvent.class, customEvent);
```

You can then retrieve data from your event object and do whatever you want with it.

