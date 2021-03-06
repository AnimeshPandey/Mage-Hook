const RANGED_ATTACK_SPEED = 2;
const BLOOD_SPLATTER_SPEED = 1;
const PARTICLES_PER_ENEMY_HIT = 16;

function magicClass(magic, enemyList) {
	this.x = magic.x;
	this.y = magic.y;
	this.maxHealth = magic.maxHealth;
	this.isFacing = magic.isFacing;
	 
	this.collider = new boxColliderClass(this.x, this.y, 0, 0, 0, 0);
	 
	this.attackFrames = magic.attackFrames;
	this.attackDir = magic.attackDir;
	
	this.sprite = new spriteClass();
	this.sprite.setSprite(	magic.spriteSheet,
							magic.spriteWidth, magic.spriteHeight,
							magic.spriteFrames, magic.spriteSpeed, true);
	this.remove = false;
	this.onHitEnemy = magic.onHitEnemy;
	if(!enemyList){
		this.enemyList = currentRoom.enemyList;
	} else {
		this.enemyList = enemyList;
	}
	this.draw = function() {
		this.sprite.draw(this.x,this.y);
		if(_DEBUG_DRAW_HITBOX_COLLIDERS) {
			this.collider.draw('red');
		}
	}

	this.update = function() {
		if(this.sprite.isDone() || this.remove){
			var index = currentRoom.magic.indexOf(this);
			if(index !== -1) {
				currentRoom.magic.splice(index, 1);
				console.log("attack removed")
				return;
			}
		}
		this.x += this.attackDir[0]*RANGED_ATTACK_SPEED;
		this.y += this.attackDir[1]*RANGED_ATTACK_SPEED;
		var frame = this.sprite.getFrame();
		if(this.attackFrames[frame]){
			this.collider.offsetX = this.attackFrames[frame].x1;
			this.collider.offsetY = this.attackFrames[frame].y1;
			this.collider.width = this.attackFrames[frame].x2;
			this.collider.height = this.attackFrames[frame].y2;
			this.hitEnemy();
		} else {
			this.collider.offsetX = 0;
			this.collider.offsetY = 0;
			this.collider.width = 0;
			this.collider.height = 0;
		}
		this.collider.setCollider(this.x, this.y);
		this.sprite.update();
	}

	this.hitEnemy = function() {
		for (var i = 0; i < this.enemyList.length; i++) {
			var enemy = this.enemyList[i];
			if (this.collider.isCollidingWith(enemy.hitbox))
				this.onHitEnemy(enemy);
		}
	}

	currentRoom.magic.push(this);
}
 
function anchorMagic(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackFrames = {
		4: {x1: 5, y1: 8, x2: 20, y2:10 },
		5: {x1: 5, y1: 8, x2: 20, y2:10 },
		6: {x1: 5, y1: 8, x2: 20, y2:10 }};
		
	this.spriteSheet = sprites.Player.anchorAttack;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 7;
	this.spriteSpeed = 13;
	
	this.attackDir = [0,0];
	
	switch(this.isFacing) { //Draw attack in facing dirction
			case NORTH:
				this.x -= 6;
				this.y -= 16;
				break;
			case SOUTH:
				this.x -= 6;
				this.y += 16;
				break;
			case EAST:
				this.x += 13;
				break;
			case WEST:
				this.x -= 25;
				break;
		}
	
	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		player.enemyHitCount++;
		enemy.currentHealth--;
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	return new magicClass(this);
 }
 
 function missileMagic(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackFrames = {
		0: {x1: 0, y1: 0, x2: 20, y2:20 },
		1: {x1: 0, y1: 0, x2: 20, y2:20 },
		2: {x1: 0, y1: 0, x2: 20, y2:20 },
		3: {x1: 0, y1: 0, x2: 20, y2:20 }};
		
	this.spriteSheet = sprites.Player.rangedAttack;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 4;
	this.spriteSpeed = 13;
	
	switch(this.isFacing) { //Draw attack in facing dirction
		case NORTH:
			this.x -= 6;
			this.y -= 16;
			this.attackDir = [0,-1];
			break;
		case SOUTH:
			this.x -= 6;
			this.y += 16;
			this.attackDir = [0,1];
			break;
		case EAST:
			this.x += 13;
			this.attackDir = [2,0];
			break;
		case WEST:
			this.x -= 25;
			this.attackDir = [-2,0];
			break;
	}

	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		player.enemyHitCount++;
		enemy.currentHealth--;
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	return new magicClass(this);
}

 function boneThrow(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackFrames = {
		0: {x1: 0, y1: 0, x2: 20, y2:20 },
		1: {x1: 0, y1: 0, x2: 20, y2:20 },
		2: {x1: 0, y1: 0, x2: 20, y2:20 },
		3: {x1: 0, y1: 0, x2: 20, y2:20 }};
		
	this.spriteSheet = sprites.Player.rangedAttack;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 4;
	this.spriteSpeed = 13;
	
	switch(this.isFacing) { //Draw attack in facing dirction
		case NORTH:
			this.x -= 6;
			this.y -= 16;
			this.attackDir = [0,-1];
			break;
		case SOUTH:
			this.x -= 6;
			this.y += 16;
			this.attackDir = [0,1];
			break;
		case EAST:
			this.x += 13;
			this.attackDir = [2,0];
			break;
		case WEST:
			this.x -= 25;
			this.attackDir = [-2,0];
			break;
	}

	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		player.enemyHitCount++;
		enemy.currentHealth--;
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	return new magicClass(this, [player]);
}

 function bulletMagic(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackFrames = {
		0: {x1: 0, y1: 0, x2: 8, y2:8 },
		1: {x1: 0, y1: 0, x2: 8, y2:8 },
		2: {x1: 0, y1: 0, x2: 8, y2:8 },
		3: {x1: 0, y1: 0, x2: 8, y2:8 },};
		
	this.spriteWidth = 16;
	this.spriteHeight = 16;
	this.spriteFrames = 12;
	this.spriteSpeed = 6;
	
	switch(this.isFacing) { //Draw attack in facing dirction
		case NORTH:
			this.y -= 8;
			this.attackDir = [0,-2];
			this.spriteSheet = sprites.Player.bulletAttackNorth;
			break;
		case SOUTH:
			this.y += 8;
			this.attackDir = [0,2];
			this.spriteSheet = sprites.Player.bulletAttackSouth;
			break;
		case EAST:
			this.x += 8;
			this.attackDir = [2,0];
			this.spriteSheet = sprites.Player.bulletAttackEast;
			break;
		case WEST:
			this.x -= 8;
			this.attackDir = [-2,0];
			this.spriteSheet = sprites.Player.bulletAttackWest;
			break;
	}

	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		this.remove = true;
		player.enemyHitCount++;
		enemy.currentHealth--;
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	var bullet1 = new magicClass(this);
	
	switch(this.isFacing) { //Draw attack in facing dirction
		case NORTH:
			this.y -5;
			this.attackDir = [-0.5,-1.5];
			break;
		case SOUTH:
			this.y += 5;
			this.attackDir = [0.5,1.5];
			break;
		case EAST:
			this.x += 5;
			this.attackDir = [1.5,0.5];
			break;
		case WEST:
			this.x -= 5;
			this.attackDir = [-1.5,-0.5];
			break;
	}
	
	var bullet2 = new magicClass(this);
	
	
	switch(this.isFacing) { //Draw attack in facing dirction
		case NORTH:
			this.y += 5;
			this.attackDir = [0.5,-1.5];
			break;
		case SOUTH:
			this.y -= 5;
			this.attackDir = [-0.5,1.5];
			break;
		case EAST:
			this.x -= 5;
			this.attackDir = [1.5,-0.5];
			break;
		case WEST:
			this.x += 5;
			this.attackDir = [-1.5,0.5];
			break;
	}
	
	var bullet3 = new magicClass(this);
}