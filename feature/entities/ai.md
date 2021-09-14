# AI

## Overview

Entity AI is done by giving an entity an ordered list of goals to do if a condition is validated. Once an action is found, the entity will be affected by it until asked to stop.

For example, a very simple aggressive creature could have:

1. Attack target
2. Walk randomly around
3. Do nothing

Every tick, the entity will find the goal to follow based on its priority. If the entity has a target the first goal will be used, and the rest be ignored.

## Groups

You might find yourself wanting to have multiple goals being executed at the same time. For example, having an entity attacking its target while swimming to avoid dying. This is done by adding multiple `EntityAIGroup` to the entity, each group contains a list of goals to be executed independently.

```java
package demo.entity;

import net.minestom.server.entity.ai.EntityAIGroupBuilder;
import net.minestom.server.entity.ai.goal.RandomLookAroundGoal;
import net.minestom.server.entity.type.monster.EntityZombie;
import net.minestom.server.entity.EntityType;

public class ZombieCreature extends EntityCreature {

    public ZombieCreature() {
        super(EntityType.ZOMBIE);
        addAIGroup(
                new EntityAIGroupBuilder()
                        .addGoalSelector(new RandomLookAroundGoal(this, 20))
                        .build()
        );
    }
}
```

