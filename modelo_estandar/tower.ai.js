var towerAI = {

    /** @param {Tower} tower **/
    run: function(tower) {
        
	    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
	        filter: (structure) => structure.hits < 2000
	    });
	    if(closestDamagedStructure) {
	        tower.repair(closestDamagedStructure);
	    }

	    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	    if(closestHostile) {
	        tower.attack(closestHostile);
	    }
    }
};

module.exports = towerAI;
