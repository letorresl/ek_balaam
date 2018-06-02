var roleHarvester = require('role.harvester');
var roleCargo = require('role.cargo');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var towerAI = require('tower.ai');
var sourceManager = require('source.manager');

module.exports.loop = function () {

    sourceManager.run();

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    var cargos = _.filter(Game.creeps, (creep) => creep.memory.role == 'cargo');
    console.log('Cargos: ' + cargos.length);

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

    for (var name in Game.rooms) {
        console.log('Room "'+name+'" has ' + Game.rooms[name].energyAvailable + ' energy');
    }

    if (harvesters.length < 2) {
        if (Game.rooms[name].energyAvailable <= 300 && harvesters.length == 0) {
	    	var newName = 'Recolector' + Game.time;
		    console.log('Spawning new harvester: ' + newName);
		    Game.spawns['Base'].spawnCreep([WORK, CARRY, MOVE], newName,
			    {memory: {role: 'harvester', sourceId: -1}});
        }
        else {
	    	var newName = 'Recolector' + Game.time;
		    console.log('Spawning new harvester: ' + newName);
            Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE], newName,
                {memory: {role: 'harvester', sourceId: -1}});
        }
    }

    if (cargos.length < 2 &&
        harvesters.length >= 2 &&
        Game.rooms[name].energyAvailable >= 300) {
        	var newName = 'Cargador' + Game.time;
	        console.log('Generando nuevo cargo: ' + newName);
            Game.spawns['Base'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
                {memory: {role: 'cargo'}});
    }

    if (upgraders.length < 3) {
        if (Game.rooms[name].energyAvailable < 300 && upgraders.length < 1) {
            var newName = 'Actualizador' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Base'].spawnCreep([WORK, CARRY, MOVE], newName,
                        {memory: {role: 'upgrader'}});
        }
        else if (harvesters.length >= 2) {
            var newName = 'Actualizador' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE], newName,
                        {memory: {role: 'upgrader'}});
        }
    }


    if (builders.length < 2 && harvesters.length >= 2) {
        if (Game.rooms[name].energyAvailable < 300 && builders.length < 1) {
            var newName = 'Constructor' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Base'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'builder'}});
        }
        else {
            var newName = 'Constructor' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, CARRY,MOVE, MOVE, MOVE], newName,
                {memory: {role: 'builder'}});
        }

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

        if (creep.memory.role == 'cargo') {
            roleCargo.run(creep);
        }

        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
