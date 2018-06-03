var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {


        var claim_flag = Game.flags.claim_flag;
        var base_flag = Game.flags.base_flag;

        if (claim_flag && creep.getActiveBodyparts(CLAIM) > 0) {
                if (creep.pos.roomName === claim_flag.pos.roomName) {
                    if(creep.room.controller && !creep.room.controller.my) {
                        var resultado = creep.claimController(creep.room.controller);
                        if (resultado == ERR_INVALID_TARGET) {
                            if (creep.attack(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller);
                            }
                        }
                        else if (resultado == ERR_GCL_NOT_ENOUGH) {
                            if (cree.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller);
                            }
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


