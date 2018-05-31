var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var towerAI = require('tower.ai');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

    for (var name in Game.rooms) {
        console.log('Room "'+name+'" has ' + Game.rooms[name].energyAvailable + ' energy');
    }

    if (harvesters.length < 4) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        if (Game.rooms[name].energyAvailable <= 300) {
            Game.spawns['Base'].spawnCreep([WORK, CARRY, MOVE], newName,
                        {memory: {role: 'harvester'}});
        }
        else {
            Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE], newName,
                        {memory: {role: 'harvester'}});
        }
    }

    if (upgraders.length < 6 && Game.rooms[name].energyAvailable > 300) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE], newName,
                    {memory: {role: 'upgrader'}});
    }
    if (upgraders.length < 2 && Game.rooms[name].energyAvailable <= 300) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Base'].spawnCreep([WORK, CARRY, MOVE], newName,
                    {memory: {role: 'upgrader'}});
    }

    if (builders.length < 4) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Base'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'builder'}});
    }

    if(Game.spawns['Base'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Base'].spawning.name];
        Game.spawns['Base'].room.visual.text(
            spawningCreep.memory.role,
            Game.spawns['Base'].pos.x + 1,
            Game.spawns['Base'].pos.y,
            {align: 'left', opacity: 0.8});
    }


    var tower = Game.getObjectById('TOWER_ID');

    if (tower) {
	towerAI.run(tower);
    }


    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
