var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var seguro_flag = Game.flags.seguro_flag;

        /* ubica un creep aliado herido */
        var targetHerido = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: function(creep){
                return (creep.hits < creep.hitsMax);
            }
        });

        // si el creep tiene 40% o mas de hp, entonces actua
        if (creep.hits / creep.hitsMax >= 40) {
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
        }
        /* si no encuentra nada, regresar a seguro flag */
        else if (seguro_flag) {
            creep.moveTo(seguro_flag);
        }
        /* regresar a la base */
        else {
            creep.moveTo(Game.spawns['Base']);
        }

    }
};

module.exports = roleHealer;

