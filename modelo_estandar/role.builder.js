var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }

        /* Construccion */
        if(creep.memory.building) {
            /* Verificar si existen estructuras pendientes de construir */
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                /** Reparacion de estructuras dañadas **/
	            var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: function(estructura){
                        return estructura.hits < estructura.hitsMax;
                    }
                });

                damagedStructures.sort(
                    function (eA, eB) {
                        hitsA = eA.hits / eA.hitsMax;
                        hitsB = eB.hits / eB.hitsMax;
                        return (
                            hitsA - hitsB
                        );
                    }
                )

	            if(damagedStructures.length > 0) {
                    creep.say(damagedStructures[0].hits)
	                if (creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedStructures[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
	            }
            }
        }
        /* Recoleccion de energia */
        else {
            /* Busqueda de contenedor cercano */
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

module.exports = roleBuilder;
