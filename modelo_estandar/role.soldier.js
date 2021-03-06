var roleSoldier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /* ubica un creep hostil de tipo attack */
        var targetAtacante = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: function(creep){
                return (creep.getActiveBodyparts(ATTACK) > 0);
            }
        });
        /* ubica un creep hostil de tipo worker */
        var targetWorker = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: function(creep){
                return (creep.getActiveBodyparts(ATTACK) == 0);
            }
        });

        var attack_flag = Game.flags.attack_flag;
        var seguro_flag = Game.flags.seguro_flag;
        var base_flag = Game.flags.base_flag;
        var wall_flag = Game.flags.wall_flag;

        // si el creep tiene 40% o mas de hp, entonces actua
        if (100 * creep.hits / creep.hitsMax >= 90) {
            if (creep.getActiveBodyparts(HEAL) > 0) {
                // si el healer mismo esta herido, que se cure
                if (creep.hits < creep.hitsMax) {
                    creep.heal(creep);
                }
                // si hay aliados heridos, curalos
                else if (targetHerido) {
                    if (creep.heal(targetHerido) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetHerido);
                    }
                }
            }
            else if (wall_flag) {
                if (creep.pos == wall_flag.pos) {
                    var targetWall = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                        filter: function(estructura){
                            return (
                                estructura.structureType == STRUCTURE_WALL
                            );
                        }
                    });
                    creep.attack(targetWall);
                }
                else {
                    creep.moveTo(wall_flag);
                }
            }
            /* si existe bandera de ataque */
            else if (attack_flag) {
                if (creep.pos.roomName === attack_flag.pos.roomName) {
                    let objetivo = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (
                                    structure.structureType == STRUCTURE_TOWER
                            );
                        }
                    })[0];
                    if (targets) {
                            objetivo = targets;
                    }
                    if (creep.attack(objetivo) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(objetivo);
                    }
                }
                else {
                    creep.moveTo(attack_flag);
                }
            }

            /* si hay cualquier tipo de creep hostil*/
            else if (
                targetWorker &&
                (
                    creep.room.controller.my ||
                    (
                        attack_flag.pos.roomName == creep.pos.roomName
                    )
                )
            ) {
                if (creep.attack(targetWorker) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetWorker);
                }
            }
            /* si hay soldados, atacalos primero */
            else if (
                targetAtacante &&
                (
                    creep.room.controller.my ||
                    (
                        attack_flag.pos.roomName == creep.pos.roomName
                    )
                )
            ) {
                if (creep.attack(targetAtacante) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetAtacante);
                }
            }
                    /* si no encuentra hostilidad ni bandera, regresar a base flag */
            else if (seguro_flag) {
                creep.moveTo(seguro_flag);
            }
            /* regresar a la base */
            else {
                creep.moveTo(Game.spawns['Base']);
            }

        }
        /* si no encuentra hostilidad ni bandera, regresar a base flag */
        else if (seguro_flag) {
            creep.moveTo(seguro_flag);
        }
        /* regresar a la base */
        else {
            creep.moveTo(Game.spawns['Base']);
        }

    }
};

module.exports = roleSoldier;


