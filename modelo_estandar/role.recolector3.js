var roleRecolector3 = {

    // Nombre del rol
//    var nombrerol="RecolectorM";


    /** @param {Creep} creep **/
    run: function(creep) {
        
        var cargos = _.filter(Game.creeps, (creep) => creep.memory.role == 'recolector');
        var fuente_flag = Game.flags.fuente3_flag;
        
        if (creep.memory.storing && creep.carry.energy == 0) {
            creep.memory.storing = false;
            creep.say('Recolectar');
        }
        if (!creep.memory.storing &&
            creep.carry.energy == creep.carryCapacity 
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
                            (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity   
                        )
                    );
                }
            });
            

            // Si hay almacenes disponibles, ir al mas cercano
            if (targets.length > 0) {
                objetivo = creep.pos.findClosestByPath(targets)
                if (creep.transfer(objetivo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(objetivo, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // Ir a la base si no hay almacenes cerca
            else if (creep.pos.roomName != Game.spawns['Base'].pos.roomName) {
                creep.moveTo(Game.spawns['Base'])
            }
        }
        /* Recoleccion de energia */
        else {
            if (fuente_flag) {
                if (creep.pos.roomName != fuente_flag.pos.roomName) {
                    creep.moveTo(fuente_flag);
                }
                else {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                        filter: function(source){
                            //Access this sources memory and if this source has less then 2 workers return this source
                            return source.memory.workers <= 2; 
                        }
                    });
        
                    if (source) {
                        // Si el creep puede cargar mas energia, recolectarla
                        if  (creep.carry.energy < creep.carryCapacity) {
                            creep.memory.sourceId = source.id;
                            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                                creep.memory.sourceId = -1;
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleRecolector3;

