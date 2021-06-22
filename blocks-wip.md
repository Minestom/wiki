# Blocks WIP

## Overview

A `Block` is an **immutable** object containing:

* Namespace & protocol id
* `Map<String, String>` containing properties \(e.g. waterlogged\)
* State id which is the numerical id defining the block visual used in chunk packets and a few others
* Optional nbt
* A `BlockHandler`

