var roleCargo = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.memory.storing && creep.carry.energy == 0) {
            creep.memory.storing = false;
            creep.say('Recuperar');
        }
        if (!creep.memory.storing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.storing = true;
            creep.say('Almacenar');
        }
        
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
        else {
            var harvester = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: function(creep){
                    return (creep.memory.role == 'harvester' && creep.carry.energy > 0);
                }
            });
            if (harvester !== null && harvester.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(harvester, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleCargo;
