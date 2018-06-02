var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var contenedorCercano = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(estructura){
                    return (
                        estructura.structureType == STRUCTURE_CONTAINER &&
                        estructura.store[RESOURCE_ENERGY] > 0
                    );
                }
            });

            /* Si existe un contenedor en el room, entonces retirar energia de ahi */
            if (contenedorCercano && contenedorCercano.store[RESOURCE_ENERGY] > 0) {
                if(creep.withdraw(contenedorCercano, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(contenedorCercano, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            /* De lo contrario, extraerla de una fuente cercana */
            else {
                /* var fuente = creep.pos.findClosestByRange(FIND_SOURCES, {
                    filter: function(source){
                        return source.memory.workers < 2;
                    }
                });*/

                var fuente = creep.room.find(FIND_SOURCES)[0];

                if(creep.harvest(fuente) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(fuente, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleUpgrader;
