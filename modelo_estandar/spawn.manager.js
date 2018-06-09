var roleRecolector = require('role.recolector');

bodyCost = function (body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}

var spawnManager = {

    run: function() {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        console.log('Harvesters: ' + harvesters.length);

        var recolectores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recolector');
        console.log('Recolectores: ' + recolectores.length);

        var cargos = _.filter(Game.creeps, (creep) => creep.memory.role == 'cargo');
        console.log('Cargos: ' + cargos.length);

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('Upgraders: ' + upgraders.length);

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        console.log('Builders: ' + builders.length);

        var soldiers = _.filter(Game.creeps, (creep) => creep.memory.role == 'soldier');
        console.log('Soldiers: ' + soldiers.length);

        var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
        console.log('Healers: ' + soldiers.length);

        var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
        console.log('Claimers: ' + claimers.length);
        
        var minharvesters = 2;
        var minrecolectores = 4;
        var mincargos = 2;
        var minupgraders = 2;
        var minbuilders = 2;
        var minsoldiers = 2;
        var minhealers = 1;
        var minclaimers = 0;

        for (var name in Game.spawns) {
            var nombre = Game.spawns[name].room.name
            console.log('Room "'+ nombre +'" has ' + Game.rooms[nombre].energyAvailable + ' energy'); 
        } 

        if (
            harvesters.length < minharvesters
        ) {
            if (Game.rooms[nombre].energyAvailable <= 300 && harvesters.length == 0) {
	        	var newName = 'Recolector' + Game.time;
		        console.log('Spawning new harvester: ' + newName);
		        Game.spawns['Base'].spawnCreep([WORK, CARRY, MOVE], newName,
			        {memory: {role: 'harvester', sourceId: -1}});
            }
            else {
	        	var newName = 'Recolector' + Game.time;
		        console.log('Spawning new harvester: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], newName,
                    {memory: {role: 'harvester', sourceId: -1}});
            }
        }

        if (
            harvesters.length >= minharvesters &&
            cargos.length < mincargos &&
            Game.rooms[nombre].energyAvailable >= 700
        ) {
            	var newName = 'Cargador' + Game.time;
	            console.log('Generando nuevo cargo: ' + newName);
                Game.spawns['Base'].spawnCreep(
                    [
                        CARRY,  CARRY,  CARRY,  CARRY,  CARRY,  CARRY,  CARRY,
                        MOVE,   MOVE,   MOVE,   MOVE,   MOVE,   MOVE,   MOVE
                    ], newName,
                    {memory: {role: 'cargo'}});
        }

        if (
            harvesters.length >= minharvesters &&
            cargos.length >= mincargos &&
            recolectores.length < minrecolectores &&
            Game.rooms[nombre].energyAvailable >= bodyCost([
                WORK, WORK, 
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
            ])
        ) {
	        	var newName = 'RecolectorM' + Game.time;
		        console.log('Spawning new harvester: ' + newName);
                Game.spawns['Base'].spawnCreep([
        WORK, WORK, 
        CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
    ], newName,
                    {memory: {role: 'recolector', sourceId: -1}});
        }

        if (
                upgraders.length < minupgraders
        ) {
            if (Game.rooms[nombre].energyAvailable < 300 && upgraders.length < 1) {
                var newName = 'Actualizador' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK, CARRY, MOVE], newName,
                            {memory: {role: 'upgrader'}});
            }
            else if (
                harvesters.length >= minharvesters &&
                cargos.length >= mincargos &&
                Game.rooms[nombre].energyAvailable >= 650) {
                var newName = 'Actualizador' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Base'].spawnCreep(
                    [
                        WORK, WORK, WORK,
                        CARRY, CARRY, 
                        MOVE, MOVE, MOVE, MOVE, MOVE
                    ], newName,
                            {memory: {role: 'upgrader'}});
            }
        }


        if (
            harvesters.length >= minharvesters &&
            cargos.length >= mincargos &&
            builders.length < minbuilders
        ) {
            if (Game.rooms[nombre].energyAvailable < 300 && builders.length < 1) {
                var newName = 'Constructor' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'builder'}});
            }
            else if (Game.rooms[nombre].energyAvailable >= 650) {
                var newName = 'Constructor' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                    {memory: {role: 'builder'}});
            }

        }


        if (
            builders.length >= minbuilders &&
            harvesters.length >= minharvesters &&
            upgraders.length >= minupgraders &&
            cargos.length >= mincargos
        ) {
            if (Game.rooms[nombre].energyAvailable >= 600 && soldiers.length < minsoldiers) {
                var newName = 'Soldier' + Game.time;
                console.log('Spawning new Soldier: ' + newName);
                Game.spawns['Base'].spawnCreep([
                    TOUGH, TOUGH, TOUGH,
                    ATTACK, ATTACK, ATTACK, ATTACK,
                    MOVE,   MOVE,   MOVE,   MOVE,   MOVE, MOVE, MOVE], newName,
                    {memory: {role: 'soldier'}});
            }
        }

        if (
            builders.length >= minbuilders &&
            harvesters.length >= minharvesters &&
            upgraders.length >= minupgraders &&
            cargos.length >= mincargos &&
            soldiers.length >= minsoldiers
        ) {
            if (Game.rooms[nombre].energyAvailable >= 600 && healers.length < minhealers) {
                var newName = 'Healer' + Game.time;
                console.log('Spawning new Healer: ' + newName);
                Game.spawns['Base'].spawnCreep([
                    TOUGH, TOUGH, TOUGH,
                    HEAL, HEAL,
                    MOVE,   MOVE,   MOVE, MOVE, MOVE], newName,
                    {memory: {role: 'healer'}});
            }
        }

        if (
            builders.length >= minbuilders &&
            harvesters.length >= minharvesters &&
            upgraders.length >= minupgraders &&
            cargos.length >= mincargos &&
            soldiers.length >= minsoldiers &&
            healers.length >= minhealers
        ) {
            if (Game.rooms[nombre].energyAvailable >= 120000 && claimers.length < minclaimers) {
                var newName = 'Claimer' + Game.time;
                console.log('Spawning new Claimer: ' + newName);
                Game.spawns['Base'].spawnCreep([
                    ATTACK,
                    CLAIM,
                    MOVE, MOVE], newName,
                    {memory: {role: 'claimer'}});
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
    }
};

module.exports = spawnManager;

