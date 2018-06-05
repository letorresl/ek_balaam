var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        function ordenaEstructuras(eA, eB) {
            if (eA.structureType == STRUCTURE_RAMPART) {
                var numeradorA = 300000000 //Considera la misma importancia que una pared
            }
            else {
                var numeradorA = eA.hitsMax
            }
            if (eB.structureType == STRUCTURE_RAMPART) {
                var numeradorB = 300000000 //Considera la misma importancia que una pared
            }
            else {
                var numeradorB = eB.hitsMax
            }
            
            hitsA = eA.hits / numeradorA;
            hitsB = eB.hits / numeradorB;
            return (
                hitsA - hitsB
            );
        }

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            var damagedCommon = creep.room.find(FIND_STRUCTURES, {
                filter: function(estructura){
                    return (
                        (estructura.hits / estructura.hitsMax) < 0.80 &&
                        !(
                            estructura.structureType == STRUCTURE_WALL ||
                            estructura.structureType == STRUCTURE_RAMPART
                        )
                    );
                }
            });

            var damagedFortification = creep.room.find(FIND_STRUCTURES, {
                filter: function(estructura){
                    return (
                        (estructura.hits / estructura.hitsMax) < 0.80 &&
                        (
                            estructura.structureType == STRUCTURE_WALL ||
                            estructura.structureType == STRUCTURE_RAMPART
                        )
                    );
                }
            });

            // Los ordenamientos no son in-place
            damagedCommon = damagedCommon.sort(ordenaEstructuras);
            damagedFortification = damagedFortification.sort(ordenaEstructuras);
            damagedStructures = damagedCommon.concat(damagedFortification);

            creep.memory.building = true;
            creep.memory.mostDamaged = damagedStructures[0].id;
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
            /** Reparacion de estructuras daÃ±adas **/
            else if (Game.getObjectById(creep.memory.mostDamaged)) {
                var mostDamaged = Game.getObjectById(creep.memory.mostDamaged);
                creep.say(mostDamaged.hits)
                if (creep.repair(mostDamaged) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mostDamaged, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if (mostDamaged.hits == mostDamaged.hitsMax) {
                    creep.memory.building = false;
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

