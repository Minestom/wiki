# Schedulers

Schedulers are fairly straightforward, they allow you to perform an action based on time.

Be aware that scheduled tasks are executed in their own thread pool, synchronization can be required depending on what you do.

There are 4 types of schedulers, each one of them can be accessed by calling the `SchedulerManager`.

```java
ScheudleManager schedulerManager = MinecraftServer.getSchedulerManager();

// First scheduler to repeat the task each time
schedulerManager.buildTask(new Runnable() {
            @Override
            public void run() {
                // This method is gonna be called every 5 ticks
            }
}).repeat(5 /*Time in tick*/, TimeUnit.TICK).schedule();

// Second scheduler that delays a task for a certain time
schedulerManager.buildTask(new Runnable() {
            @Override
            public void run() {
                // This method is gonna be called after 1 tick
            }
}).delay(1 /*Time in tick*/, TimeUnit.TICK).schedule();

// Third scheduler, is a combination of a delayed task and a repeated task
schedulerManager.buildTask(new Runnable() {
            @Override
            public void run() {
                // This method is called with a 5 second delay and then called every 1 second.
            }
}).delay( 5/*Time in seconds*/, TimeUnit.SECOND).repeat(1 /*Time in seconds*/, TimeUnit.SECOND).schedule();

// The fourth and last task is the shutdown task
schedulerManager.buildShutdownTask(new Runnable() {
    @Override
    public void run() {
        // This method is called when the server is shut down
        // Can be used to save cached data, for example
    }
}).schedule();
```

