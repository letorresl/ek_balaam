var roleHarvester = require('role.harvester');
var roleRecolector = require('role.recolector');
var roleRecolector2 = require('role.recolector2');
var roleRecolector3 = require('role.recolector3');
var roleCargo     = require('role.cargo');
var roleUpgrader  = require('role.upgrader');
var roleBuilder   = require('role.builder');
var roleHealer   = require('role.healer');
var roleSoldier   = require('role.soldier');
var roleClaimer   = require('role.claimer');
var roleClaimer2   = require('role.claimer2');
var roleClaimer3   = require('role.claimer3');
var towerAI = require('tower.ai');
var sourceManager = require('source.manager');
var spawnManager  = require('spawn.manager');

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

    var tower = Game.getObjectById('5b1036b83d518c25f92c0149');

    towerAI.run(tower);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == 'recolector') {
            roleRecolector.run(creep);
        }

        if (creep.memory.role == 'recolector2') {
            roleRecolector.run(creep);
        }

        if (creep.memory.role == 'recolector3') {
            roleRecolector.run(creep);
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

        if (creep.memory.role == 'healer') {
            roleHealer.run(creep);
        }

        if (creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
        }

        if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }
}
