# HERO MAZE

Hero maze is a simple maze crawling game. As a mighty, but not immortal hero, you need to escape the maze. Find keys to unlock doors and decide to fight or evade monsters. You are unlikely to survive if you choose to always fight, so pick your battles wisely!

## About

This is an extension of a school project, slowly being upgraded to be a real game. All graphics are placeholders, but gameplay is already approaching completion. Current stable version is published here: [http://johru.wz.cz](http://johru.wz.cz), development version in this repo.

## Monster AI

There are four types of monsters:

1. Boss\: a single dangerous monster, best avoided!
2. Witches \: blue robed little creatures hold key to the main doors.
3. Goblins\: pesky little creatures, low danger\. Kill them to level up\. 
4. Guards\: strong and numerous, they will be the main obstacle in higher levels\. Best avoided!

Every monster except Witches will pursue the player, with following order of priority.
1. if the monster sees player when it's about to move, it will find the shortest path to the player square
2. if it can't see the player, it will continue towards last seen player location
3. Once last player location is explored, monster moves randomly

**To be implemented:** monsters will have fixed patrol path and instead of random movement will return to last visited step on patrol path when they reach last known player location.

Note: monsters can now pursue the player through doors but will not pass doors otherwise.

## Algo

Visual demonstration of algos for line of sight and pathfinding below. Both key algos can be found in monster.ts

**Line of Sight** algo is based on Bresenham's line drawing algorithm. Bresenham only draws a single line from square pixels, but uses a simple system of angles to operate only with whole numbers. My LOS is extended to return a list of every square significantly intersected by the line between the player and a monster.

**Pathfinding** algo is an simple version of A* search. It creates a linked list of nodes. It's heuristic is based on number of previous steps and remaining distance to target. Thus the shortest path to target through unobstructed squares is returned.


Yellow markers show which squares are checked for walls. If there is at least one wall blocking sight, green line connects the hero square and the monster square.
If line of sight is unblocked, connecting line turns red and shortest path painted in grey is calculated for the monster to reach hero square.

# ![path](https://user-images.githubusercontent.com/74294571/220378384-8e84808d-1dd2-49cd-859c-ce98e781022e.gif)
