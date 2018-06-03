var spawnManager = {

    run: function() {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        console.log('Harvesters: ' + harvesters.length);

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

        var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimers');
        console.log('Claimers: ' + claimers.length);

        for (var name in Game.spawns) {
            var nombre = Game.spawns[name].room.name
            console.log('Room "'+ nombre +'" has ' + Game.rooms[nombre].energyAvailable + ' energy'); 
        } 

        if (harvesters.length < 2) {
            if (Game.rooms[nombre].energyAvailable <= 300 && harvesters.length == 0) {
	        	var newName = 'Recolector' + Game.time;
		        console.log('Spawning new harvester: ' + newName);
		        Game.spawns['Base'].spawnCreep([WORK, CARRY, MOVE], newName,
			        {memory: {role: 'harvester', sourceId: -1}});
            }
            else {
	        	var newName = 'Recolector' + Game.time;
		        console.log('Spawning new harvester: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE], newName,
                    {memory: {role: 'harvester', sourceId: -1}});
            }
        }

        if (
            cargos.length < 2 &&
            harvesters.length >= 2 &&
            Game.rooms[nombre].energyAvailable >= 300
        ) {
            	var newName = 'Cargador' + Game.time;
	            console.log('Generando nuevo cargo: ' + newName);
                Game.spawns['Base'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                    {memory: {role: 'cargo'}});
        }

        if (upgraders.length < 2) {
            if (Game.rooms[nombre].energyAvailable < 300 && upgraders.length < 1) {
                var newName = 'Actualizador' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK, CARRY, MOVE], newName,
                            {memory: {role: 'upgrader'}});
            }
            else if (harvesters.length >= 2) {
                var newName = 'Actualizador' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,
                            {memory: {role: 'upgrader'}});
            }
        }


        if (builders.length < 3 && harvesters.length >= 2) {
            if (Game.rooms[nombre].energyAvailable < 300 && builders.length < 1) {
                var newName = 'Constructor' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'builder'}});
            }
            else {
                var newName = 'Constructor' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Base'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                    {memory: {role: 'builder'}});
            }

        }


        if (
            builders.length >= 2 &&
            harvesters.length >= 2 &&
            upgraders.length >= 2 &&
            cargos.length >= 2
        ) {
            if (Game.rooms[nombre].energyAvailable >= 600 && soldiers.length < 1) {
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
            builders.length >= 2 &&
            harvesters.length >= 2 &&
            upgraders.length >= 2 &&
            cargos.length >= 2 &&
            soldiers.length >= 1
        ) {
            if (Game.rooms[nombre].energyAvailable >= 600 && healers.length < 1) {
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
            builders.length >= 2 &&
            harvesters.length >= 2 &&
            upgraders.length >= 2 &&
            cargos.length >= 2 &&
            soldiers.length >= 1 &&
            healers.length >= 1
        ) {
            if (Game.rooms[nombre].energyAvailable >= 600 && claimers.length < 1) {
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
