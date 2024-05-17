# Events

## Introduction

An event is essentiall when "something" just happened in the game such as a player / entity taking damage, opening a chest, placing a block, breaking a block and so on (you can view the full list of all events [by clicking here](https://javadoc.minestom.net/net/minestom/server/event/Event.html)).

When an event is triggered, that event is passed as a variable which contains relevant data to that event, for example:
```java
var handler = MinecraftServer.getGlobalEventHandler();
handler.addListener(PlayerLoginEvent.class, event -> {
    event.getPlayer().setGameMode(GameMode.CREATIVE);
});
```
In this example, the PlayerLoginEvent event which triggers when a player logs in (obviously) will pass on `event` into the function. Using that event, it's possible to get the player that triggered the event using `event.getPlayer()` and then applying a gamemode with `.setGameMode(gameModeHere)`, in this case creative.

The data contained by the `event` will depend on the type of event that was called, make sure to [read the documentation for that specific event](https://javadoc.minestom.net/net/minestom/server/event/Event.html) to see how you can work with it.

## Types of events

There are effectively "two types" of events, the normal events that will listen "globally" to any event regardless of conditions, and a "node event" which allows for special features such as only listening to an event for players in Creative, they will be explained further down.

## Creating an event

In order to create an event, you need to use the `GlobalEventHandler` like so:
```java
var handler = MinecraftServer.getGlobalEventHandler();
```
Using this handler, you can then attach event listeners, whether being normal or node based like this
```java
handler.addListener(PlayerLoginEvent.class, event -> {
    event.getPlayer().setGameMode(GameMode.CREATIVE);
});

// Or, if you are using nodes, more on this later
node.addListener(PlayerLoginEvent.class, event -> {
    event.getPlayer().setGameMode(GameMode.CREATIVE);
});
handler.addChild(node);
```

Once the event has been added to the GlobalEventHandler, it will start functioning as expected.

## The node events

Unlike other projects such as PaperMC, Spigot, Bukkit etc that only allow "global" events, Minestom has the ability to use a tree-like node system to customize conditions for events to be called.
For example, if you wanted a BlockPlaceEvent to only be called if the player is in creative mode, nodes can be used without checking the player gamemode through the `event` object.

Here's a fancy graph that shows how the same listeners could function differently based on whether a parent node is active

![Event tree with all nodes being executed](../../.gitbook/assets/event-tree.gif)

It provides clear advantages such as

* Context-aware listeners due to node filtering
* Clear execution order
* Ability to store the event tree as an image for documentation purpose
* Listener injection into existing nodes

## Nodes in practice

### Node types

There are three types of nodes
```
var allNode   = EventNode.all("yourName");
var typeNode  = EventNode.type("yourName", EventFilter.ENTITY);
var valueNode = EventNode.value("yourName", EventFilter.PLAYER, Player::isCreative);
```

These nodes can then have listeners added to them in a similar way to the GlobalEventHandler like for example
```java
allNode.addListener(PlayerLoginEvent.class, event -> {
    event.getPlayer().setGameMode(GameMode.CREATIVE);
});
```

The `allNode` is essentially no different than just applying a listener directly to the `GlobalEventHandler` without using nodes at all. It would only be useful if combined with other nodes (to be explained further down)

The `typeNode` will only have its listeners work if the "type" of what called the listener matches what you choose.
```java
var typeNode  = EventNode.type("yourName", EventFilter.ENTITY);
```
In this example, this node would only activate listeners attached to it if the listener that called it was an ENTITY (as defined by EventFilter)
To see all possible eventfilters, see [this page](https://javadoc.minestom.net/net/minestom/server/event/EventFilter.html)

¨The `valueNode` is where things get interesting, as it now only allows (and requires) a en `EventFilter` type, but also allows a condition
```java
var valueNode = EventNode.value("yourName", EventFilter.PLAYER, Player::isCreative);
```
In this example, any events attached to this node would only trigger if a player in creative mode triggered it.
The `Player::isCreative` in this case is a predicate, meaning in simple terms that it has to be a function that returns either true or false, **but you cannot add a boolean statement to it**, for example
```java
var valueNode = EventNode.value("yourName", EventFilter.PLAYER, isAdmin==1);
```
This would not work (or even compile) since there's no way to know "who" the `isAdmin` applies to when compiling. Instead it has to be a function, for example
```java
var isAdminNode  = EventNode.value("yourName", EventFilter.PLAYER, event -> isMyPlayerAdmin(event));
```
Here, the `event` object is passed to the `isMyPlayerAdmin` function so that necessary checks can be made to verify whether this listener should trigger or not. It must return either true or false.

### yourName

As you have seen in the examples above, each node has a string "yourName", this can literally be anything you would like and has 0 purpose or function outside of organizing yourself.

### Node combinations

Imagine a case where you want to have a listener only apply if
1. A player triggered it
2. The player is in creative
3. They are an admin
This would be defined like this:
```java
var baseNode     = EventNode.type("isAPlayer", EventFilter.PLAYER);
var creativeNode = EventNode.value("isCreative", EventFilter.PLAYER, Player::isCreative);
var isAdminNode  = EventNode.value("isAdmin", EventFilter.PLAYER, event -> isMyPlayerAdmin(event));
```
Ideally, I would like these to run "sequentially", as in the same order as the list above. To do this, I make the `creativeNode` a child of `baseNode` and `isAdminNode` a child of `creativeNode`, like this:
```
baseNode
    creativeNode 
        isAdminNode
```
To do this, I would add them as children like this:
```java
var baseNode     = EventNode.type("isAPlayer", EventFilter.PLAYER);
var creativeNode = EventNode.value("isCreative", EventFilter.PLAYER, Player::isCreative);
var isAdminNode  = EventNode.value("isAdmin", EventFilter.PLAYER, event -> isMyPlayerAdmin(event));
baseNode.addChild(creativeNode);
creativeNode.addChild(isAdminNode);
```

And once the node structure has been properly created, it can be added to the GlobalEventHandler with
```java
handler.addChild(baseNode);
// assuming that the GlobalEventHandler is stored in a variable called handler
```
**Note that only the base node needs to be added**

## API

### Node

```java
// Can listen to any Event, without any condition
EventNode<Event> node = EventNode.all("demo");
// Can only listen to entity events
EventNode<EntityEvent> entityNode = EventNode.type("entity-listener", EventFilter.ENTITY);
// Can only listen to player events
EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);
// Listen to player events with the player in creative mode
EventNode<PlayerEvent> creativeNode = EventNode.value("creative-listener", EventFilter.PLAYER, Player::isCreative);
```

Each node needs a name to be debuggable and be retrieved later on, an `EventFilter` containing the event type target and a way to retrieve its actor (i.e. a `Player` from a `PlayerEvent`). All factory methods accept a predicate to provide an additional condition for filtering purposes.

### Listener

```java
EventNode<Event> node = EventNode.all("demo");
node.addListener(EntityTickEvent.class, event -> {
    // Inline listener
});
node.addListener(EventListener.builder(EntityTickEvent.class)
    .expireCount(50) // Stop after 50 executions
    .expireWhen(event -> event.getEntity().isGlowing()) // Stop once the predicate returns true
    .handler(entityTickEvent ->
        System.out.println("Entity tick!"))
    .build());

EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);
// playerNode.addListener(EntityTickEvent.class, event -> {}); -> does not work as playerNode only accept player events
playerNode.addListener(PlayerTickEvent.class, event -> {});
```

### Child

Children take the condition of their parent and are able to append to it.

```java
EventNode<Event> node = EventNode.all("demo");
EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);

node.addChild(playerNode); // Works as PlayerEvent is also an Event

// playerNode.addChild(node); -> Doesn't compile as the parent would be more restrictive than the child
```

### Event execution

Events can be executed from anywhere, not only the root node.

```java
EventNode<Event> node = EventNode.all("demo");
node.call(new MyEvent());
```

## In practice

Now that you are familiar with the API, here is how you should use it inside your Minestom project.

### Node to use 

#### Server JAR

The root node of the server can be retrieved using `MinecraftServer#getGlobalEventHandler()`, you can safely insert new nodes.

```java
var handler = MinecraftServer.getGlobalEventHandler();
handler.addListener(PlayerChatEvent.class,
        event -> event.getPlayer().sendMessage("You sent a message!"));
var node = EventNode.all("demo");
node.addListener(PlayerMoveEvent.class,
        event -> event.getPlayer().sendMessage("You moved!"));
handler.addChild(node);
```

#### Extensions

Extensions should use their defined node from `Extension#getEventNode()`, which is removed from the root node once unloaded. Listeners inserted to external nodes must be removed manually.

### Structure

Having an image of your tree is highly recommended, for documentation purposes and ensuring an optimal filtering path. It is then possible to use packages for major nodes, and classes for minor filtering.

```java
Server/
   Global.java
   Lobby/
      Rank/
         - AdminRank.java
         - VipRank.java
      - DefaultRank.java
   Game/
      Bedwars/
         Kit/
            PvpKit.java
            BuildKit.java
         Bedwars.java
      Skywars/
         Kit/
            PvpKit.java
            BuildKit.java
         Skywars.java
```

### Custom event

`Event` is an interface that you can freely implement, traits like `CancellableEvent` (to stop the execution after a certain point) and `EntityEvent` (telling the dispatcher that the event contains an entity actor) are also present to ensure your code will work with existing logic. You can then choose to run your custom event from an arbitrary node (see [example](./#event-execution)), or from the root with `EventDispatcher#call(Event)`.
