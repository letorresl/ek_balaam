var roleSoldier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /* ubica un creep hostil de tipo attack */
        var targetAtacante = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: function(creep){
                return (creep.getActiveBodyparts(ATTACK) >= 0);
            }
        });
        /* ubica un creep hostil de tipo worker */
        var targetWorker = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: function(creep){
                return (creep.getActiveBodyparts(ATTACK) == 0);
            }
        });

        var attack_flag = Game.flags.attack_flag;
        var base_flag = Game.flags.base_flag;

        /* si hay soldados, atacalos primero */
        if (targetAtacante) {
            if (creep.attack(targetAtacante) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetAtacante);
            }
        }
        /* si hay cualquier tipo de creep hostil*/
        else if (targetWorker) {
            if (creep.attack(targetAtacante) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetAtacante);
            }
        }
        /* si existe bandera de ataque */
        else if (attack_flag) {
            if (creep.pos.roomName === attack_flag.pos.roomName) {
                let hostile_spawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];

                if (creep.attack(hostile_spawn) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostile_spawn);
                }
            }
            else {
                creep.moveTo(attack_flag);
            }
        }
        /* si existe un spawn hostil y se tiene CLAIM body parts */
        else if(creep.room.controller && !creep.room.controller.my && creep.getActiveBodyparts(CLAIM) > 0) {
            if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        /* si no encuentra hostilidad ni bandera, regresar a base flag */
        else if (base_flag) {
            creep.moveTo(base_flag);
        }
        /* regresar a la base */
        else {
            creep.moveTo(Game.spawns['Base']);
        }

    }
};

module.exports = roleSoldier;


