var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /* ubica un creep aliado herido */
        var targetHerido = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: function(creep){
                return (creep.hits < creep.hitsMax);
            }
        });

        /* si hay soldados, atacalos primero */
        if (targetHerido) {
            if (creep.heal(targetAtacante) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetAtacante);
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

module.exports = roleHealer;

