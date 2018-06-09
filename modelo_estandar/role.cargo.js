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
        
        /* Almacenamiento */
        if (creep.memory.storing) {
            var targetStructures = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER
                        ) && (
                            structure.energy < structure.energyCapacity
                        ) || (
                            (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity   
                        )
                    );
                }
            });

            var targetVital = targetStructures.filter(
                function (target) {
                    return (
                        target.structureType == STRUCTURE_SPAWN ||
                        target.structureType == STRUCTURE_EXTENSION
                    );
                }
            );

            var targetImportante = targetStructures.filter(
                function (target) {
                    return (
                        target.structureType == STRUCTURE_TOWER
                    );
                }
            );

            var targetSecundario = targetStructures.filter(
                function (target) {
                    return (
                        target.structureType == STRUCTURE_CONTAINER ||
                        target.structureType == STRUCTURE_STORAGE
                    );
                }
            );

            if (targetVital.length > 0) {
                targets = targetVital;
            }
            else if (targetImportante.length > 0) {
                targets = targetImportante;
            }
            else if (targetSecundario.length > 0) {
                targets = targetSecundario;
            }
            else {
                targets = null;
            }

            var target = creep.pos.findClosestByRange(targets)

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        /* Recoleccion de energia */
        else {
            var harvester = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: function(creep){
                    return (creep.memory.role == 'harvester' && creep.carry.energy >= 50);
                }
            });
            if (harvester) {
                if (harvester.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(harvester, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                creep.memory.storing = true;
            }
        }
    }
};

module.exports = roleCargo;

