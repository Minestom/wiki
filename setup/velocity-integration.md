---
description: Step by step guide on how to set up velocity for Minestom
---

# Velocity Integration

Using Velocity in your Minestom project is very simple, you only need to follow 3 simple steps.

* Install Velocity
* Set up Velocity
* Enable Velocity in your Minestom server

## Installing Velocity
You can download velocity from [the official website](https://papermc.io/downloads/velocity). You need to start it and let it create all necessary file. This shouldn't take too long. It's recommended to use a starter script.

{% tabs %}
{% tab title="Bash (macOS and Linux)" %}
For Linux create a `starter.sh` file and for macOS create a `starter.command` file. Make sure you put them into the same folder where your Velocity server jar is. Replace `<your file without path>` with the name of your Velocity jar file.

```bash
#! /bin/bash --

TIME=30
DIR="$(dirname "$0")"
SERVER=$(basename $DIR)
FILENAME="<your file without path>.jar"

echo "$SERVER: starting..."
cd $DIR
while :
do
	# More memory: change -Xms and -Xmx. Do not change other options.
	java -Xms512M -Xmx512M -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -jar $FILENAME
	echo "$SERVER: Java stopped or crashed. Waiting $TIME seconds..."
	sleep $TIME
done
```
{% endtab %}
{% tab title="Batch (Windows)" %}
{% hint style="warning" %}
This has not been tested yet. If you own a Windows computer, try this and check if it works.
{% endhint %}

Create a `starter.bat` file in the same folder as your Velocity server jar. Replace `<your file without path>` with the name of your Velocity server jar file.

```batch
@echo off

set time=30
set dir=%~dp0
set filename="<your file without path>.jar"

echo "%dir%: starting..."
cd %dir%
:loop
:: More memory: change -Xms and -Xmx. Do not change other options.
java -Xms512M -Xmx512M -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -jar %filename%
echo "%dir%: Java stopped or crashed."
timeout %time% > NUL
goto loop
```
{% endtab %}
{% endtabs %}

After you have started Velocity you should see a few new files and folders appearing such as `velocity.toml` and `forwarding.secret`.

## Setting up Velocity
The default settings in `velocity.toml` should be fine, but there are some things we need to change. In the `[servers]` category you will see some pre-defined servers, which you most likely need to change or remove. In this example we will remove all servers except for `lobby`. Change the `lobby` port to the port you defined when binding your Minestom server. Here's an example:

```toml
[servers]
# Configure your servers here. Each key represents the server's name, and the value
# represents the IP address of the server to connect to.
lobby = "127.0.0.1:25565"

# In what order we should try servers when a player logs in or is kicked from a server.
try = [
    "lobby"
]

[forced-hosts]
# Configure your forced hosts here.
"example.com" = [
    "lobby"
]
```

Make sure to change `player-info-forwarding-mode` to `MODERN`. You can now save the `velocity.toml` file and move onto the `forwarding.secret` file. This is a text file, so you can open it in your preferred text editor. We highly recommend change the secret instead of using the default one! You will need this secret later, so don't forget it. **Do not give out your secret to anybody!** The secret is used to ensure that player info forwarded by Velocity comes from your proxy and not from someone pretending to run Velocity. [More information](https://docs.papermc.io/velocity/configuration)

## Setting up Minestom server
In your main file, just before binding the server use the `VelocityProxy.enable()` method. If you use `MojangAuth` you will need to remove that, but don't worry. Your server will not be in offline mode if you run the proxy.

```java
// Don't use: MojangAuth.init();
VelocityProxy.enable("very secret secret");
minecraftServer.start("0.0.0.0", 25565);
```

You're done! You can now start the proxy and the Minestom server.

## Troubleshooting
- Connection lost: "Invalid proxy response!"
You entered the wrong port or didn't start the proxy. You can find the port of the proxy in the `velocity.toml` under `bind`

- Connection lost: "Unable to connect you to (server). Invalid proxy response!"
Make sure you changed `player-info-forwarding-mode` to `MODERN`

- Connection lost: "Unable to connect you to (server). Please try again later."
You did not set up the proxy correctly. Make sure the Minestom server is running, and you entered the correct port and IP address to the Minestom server.

If you still have issues you can join the [Discord server](https://discord.gg/Pt9Mgd9cgR)
