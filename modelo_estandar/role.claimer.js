var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {


        var claim_flag = Game.flags.claim_flag;

        if (claim_flag && creep.getActiveBodyparts(CLAIM) > 0) {
                if (creep.pos.roomName === attack_flag.pos.roomName) {
                    if(creep.room.controller && !creep.room.controller.my) {
                        if (creep.attack(controller) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller);
                        }
                    }
                }
                else {
                    creep.moveTo(claim_flag);
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

module.exports = roleClaimer;


