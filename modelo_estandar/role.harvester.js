var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.memory.storing && creep.carry.energy == 0) {
            creep.memory.storing = false;
            creep.say('Recolectar');
        }
        if (!creep.memory.storing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.storing = true;
            if (creep.memory.sourceId) {
                var source = Game.getObjectById(creep.memory.sourceId);
                source.memory.workers = source.memory.workers - 1;
                creep.memory.sourceId = -1;
            }
            creep.say('Almacenar');
        }
        
        if (creep.memory.storing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_CONTAINER
                    ) && (
                        structure.energy < structure.energyCapacity ||
                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                    );
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: function(source){
                    return source.memory.workers < 2; //Access this sources memory and if this source has less then 2 workers return this source
                }
            });
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else {
                if (creep.memory.sourceId < 0 && source) {
                    creep.memory.sourceId = source.id;
                    source.memory.workers = source.memory.workers + 1;   
                }
            }
        }
    }
};

module.exports = roleHarvester;
