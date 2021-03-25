# Permissions

Permissions are the feature allowing you to determine if a player is able to perform an action or not.

[`Permission`](https://javadoc.minestom.com/net/minestom/server/permission/Permission.html) is an immutable class that can be added to any [`PermissionHandler`](https://minestom.github.io/Minestom/net/minestom/server/permission/PermissionHandler.html).

A permission contains 2 things, a unique name \(same as with Bukkit if you are familiar with it\), and an optional `NBTCompound` which can be used to add additional data to the permission \(no more "my.permission.X" where X represents a number\).

## Handling permission access

In order to add a permission to a PermissionHandler you should use `PermissionHandler#addPermission(Permission)`.

To remove a permission, `PermissionHandler#removePermission(Permission)` and `PermissionHandler#removePermission(String)` are available.

## Checking permissions

To verify if a PermissionHandler has a permission, you have the choice between simply checking if the handler has a permission with the same name, or verifying that the handler has both the permission name and the right data associated with it.

To check if the handler has a permission with a specific name, `PermissionHandler#hasPermission(String)` should be used. If you want to verify that the handler has the right NBT data `PermissionHandler#hasPermission(String, PermissionVerifier)` is the right choice.

A [`PermissionVerifier`](https://minestom.github.io/Minestom/net/minestom/server/permission/PermissionVerifier.html) is a simple functional interface used to check if the given `NBTCompound` is valid.

Alternatively, `PermissionHandler#hasPermission(Permission)` can be used. It does require both the permission name and the data to be equal.

## Permission serialisation

Nothing is automatically saved persistently in Minestom, permissions are not an exception.

Permissions must be serialized and deserialized back manually if you want such a feature. You are lucky since the `Permission` class can easily be interpreted as 2 strings, one being the permission name, and the second representing the optional data using `NBTCompound#toSNBT()` \(and deserialized with `SNBTParser#parse()`\).

