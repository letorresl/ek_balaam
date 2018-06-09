var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var cargos = _.filter(Game.creeps, (creep) => creep.memory.role == 'cargo');
        
        if (creep.memory.storing && creep.carry.energy == 0) {
            creep.memory.storing = false;
            creep.say('Recolectar');
        }
        if (!creep.memory.storing &&
            creep.carry.energy == creep.carryCapacity &&
            cargos.length == 0
            ) {
            creep.memory.storing = true;
            if (creep.memory.sourceId) {
                creep.memory.sourceId = -1;
            }
            creep.say('Almacenar');
        }
        
        /* Almacenamiento */
        if (creep.memory.storing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER
                        ) && (
                            structure.energy < structure.energyCapacity
                        )
                    );
                }
            });

            var contenedores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                            (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity   
                    );
                }
            });

            var target = creep.pos.findClosestByPath(targets);
            var contenedor = creep.pos.findClosestByPath(targets);
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (contenedor) {
                if (creep.transfer(contenedor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(contenedor, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        /* Recoleccion de energia */
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: function(source){
                    return source.memory.workers < 2; //Access this sources memory and if this source has less then 2 workers return this source
                }
            });
            if  (creep.carry.energy < creep.carryCapacity) {
                creep.memory.sourceId = source.id;
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.memory.sourceId = -1;
                }
            }
        }
    }
};

module.exports = roleHarvester;

