var roleHarvester = require('role.harvester');
var roleCargo = require('role.cargo');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var towerAI = require('tower.ai');
var sourceManager = require('source.manager');
var spawnManager = require('spawn.manager');

module.exports.loop = function () {

    /* administra la interaccion con los sources */
    sourceManager.run();

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /* administra la logica del spawning */
    spawnManager.run();

    for (var name in Game.rooms) {
        console.log('Room "'+name+'" has ' + Game.rooms[name].energyAvailable + ' energy');
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
