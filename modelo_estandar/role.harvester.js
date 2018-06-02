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
                        ) || (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity   
                        )
                    );
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
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
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else if (source) {
                    creep.memory.sourceId = source.id;
                }    
            }
        }
    }
};

module.exports = roleHarvester;
