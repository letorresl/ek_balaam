var towerAI = {

    /** @param {Tower} tower **/
    run: function(tower) {
        
        // Bandera que deshabilita la torre en caso de ejercicio
        var test_flag = Game.flags.test_flag;
        // El enemigo mas cercano
	    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        /* ubica un creep aliado herido */
        var targetHerido = tower.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: function(creep){
                return (creep.hits < creep.hitsMax);
            }
        });

        var ejercicio = false;
        if (test_flag) {
            if (test_flag.pos.roomName == tower.pos.roomName) {
                var ejercicio = true;
            }
        }
        if (!ejercicio) {
            if (targetHerido) {
                tower.heal(targetHerido);
            }
            else if(closestHostile) {
                tower.attack(closestHostile);
            }
            else {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < 2000
                });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }
    }
};

module.exports = towerAI;
