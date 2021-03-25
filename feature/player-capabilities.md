# Player capabilities

Minestom features a number of interaction methods exist for players. Many of them are described below, however this list is not exhaustive.

It is worth reviewing the [Chat API](chat.md) before this, because these systems depend heavily on `JsonMessage`.

## Titles

Titles can be sent either as just a title, just a subtitle, or both:

```java
Player#sendTitleMessage(JsonMessage);
Player#sendSubtitleMessage(JsonMessage);
Player#sendTitleSubtitleMessage(JsonMessage, JsonMessage);

// For example
player.sendTitleMessage(ColoredText.of(ChatColor.RED, "Hello, Title!"));
```

> Titles accept any `JsonMessage`, however events will be ignored when rendering.

### Timing

Title timings can be set for a player, and they will apply to all future titles until the timings are reset \(see below\) or changed again. The times are in ticks.

```java
Player#sendTitleTimes(Int /* fadeIn */, Int /* stay */, Int /* fadeOut */);

// For example
// Fade in over 1 second, show for 5 seconds, fade out over 1 second.
player.sendTitleTimes(20, 100, 20);
```

### **Hide/Reset**

Titles can be hidden and reset. Hiding a title makes it disappear instantly from the client. Resetting a title sets the timings to their default values, and hides the title instantly.

> Once a title is hidden future titles will be ignored until `resetTitle` is called.

```java
Player#resetTitle();
Player#hideTitle();
```

## Action Bars

An action bar renders above the player hotbar. The action bar is a form of title, and will render all styling, but will ignore text events.

```java
Player#sendActionBar(JsonMessage /* message */);

// For example
player.sendActionBar(ColoredText.of(ChatColor.RED, "Hello, world!"))
```

## Boss Bars

Boss bars are handled using the `BossBar` class, which can have a number of viewers. Creating a `BossBar` is as simple as calling the constructor. Setting the progress can be done after creation.

```java
BossBar#<init>(JsonMessage /* title */, BarColor, BarDivision);
// To set progress
BossBar#setProgress(float);

// For example
BossBar bar = new BossBar(ColoredText.of(ChatColor.YELLOW, "Hello, BossBar!"), BarColor.YELLOW, BarDivision.SOLID);
bar.setProgress(0.5f) // Half full
```

> `BossBar` flags can be set with `BossBar#setFlags(Int)`, see [BossBar](https://wiki.vg/Protocol#Boss_Bar) for more information on the possible flags.

Once created, it can be added and removed from players:

```java
BossBar#addViewer(Player);
BossBar#removeViewer(Player);
```

> It is possible to get all of the bars currently viewed by a player using `BossBar.getBossBars(Player)`.

## Books

The book GUI can be opened for a player, regardless of whether they have a book in their hand or not.

> The `WrittenBookMeta` must have a title and an author, even though they will not be shown in the book GUI.

```java
Player#openBook(WrittenBookMeta);

// For example
WrittenBookMeta book = new WrittenBookMeta();
book.setTitle("ignored");
book.setAuthor("ignored");
book.setPages(List.of(
        ColoredText.of(ChatColor.RED, "Page 1"),
        ColoredText.of(ChatColor.BRIGHT_GREEN, "Page 2"),
        ColoredText.of(ChatColor.BLUE, "Page 3")
));
player.openBook(WrittenBookMeta);
```

The book length is limited only by max NBT tag length. There is no hard limit on the client.

## Sidebars \(Scoreboards\)

`Sidebar`s can be used to display up to 16 lines on a scoreboard for the player. They are created given a title as follows:

```javascript
Sidebar#<init>(String /* title */)
```

> Sidebar titles do not support JSON chat components, however legacy \(`§`\) color codes work fine.

Once created, a scoreboard can be added and removed from players as follows:

```java
Sidebar#addViewer(Player);
Sidebar#removeViewer(Player);
```

### Sidebar Line

Lines on a sidebar are made up of `ScoreboardLine`s. They render on the scoreboard in order of their line number \(score\), where the vertically highest line represents the highest line number \(score\). If two lines have the same line number \(score\), they will be sorted alphabetically.

`ScoreboardLine`s can be created using their constructor:

```java
Sidebar.ScoreboardLine#<init>(String /* unique id*/, JsonMessage /* content */, Int /* line */);

// For example
Sidebar.ScoreboardLine line = new Sidebar.ScoreboardLine(
        "some_line_0",
        ColoredText.of(ChatColor.RED, "Hello, Sidebar!"),
        0
);
```

Once created, scoreboard lines may be added to `Sidebar`s as follows:

```java
Sidebar#createLine(Sidebar.ScoreboardLine);
```

Lines are indexed by their unique id, and can be modified with it:

```javascript
Sidebar#getLine(String /* unique id */);
Sidebar#updateLineContent(String /* unique id */, JsonMessage /* new content */);
Sidebar#updateLineScore(String /* unique id */, Int /* new score */);
```

## Notifications

`Notification`s are a system to send advancement completion toasts to a player as a form of communication.

They are a wrapper around `Advancement`s, so you do not need to create any advancements to use them, just a `Notification`. See the [Advancements](advancements.md) page for more information on advancements.

```java
Notification#<init>(JsonMessage /* title */, FrameType, ItemStack /* icon */);

// For example
Notification notification = new Notification(
        ColoredText.of(ChatColor.BRIGHT_GREEN, "Hello, Notifications!"),
        FrameType.GOAL,
        new ItemStack(Material.GOLD_INGOT, (byte) 1)
);
```

To send the notification, use one of the static methods on `NotificationCenter`:

```java
NotificationCenter.send(Notification, Player);
NotificationCenter.send(Notification, Collection<Player>);
```

The example renders as the following:

![](../.gitbook/assets/notification.png)

