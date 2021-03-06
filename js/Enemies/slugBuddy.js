function slugMonster(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 2; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = TILE_OOZE;

	this.tileColliderWidth = 16;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 0;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 16;
	this.hitboxHeight = 10;
	this.hitboxOffsetX = 0;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.Slug.walkAnimation;
	this.spriteSheetEast = sprites.Slug.walkAnimationEast;
	this.spriteSheetCharge = sprites.Slug.attackBegin;
	this.spriteSheetCharge2 = sprites.Slug.continueAttack;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 4;
	this.spriteSpeed = 5;

	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;
	var directionTimer = 0

	var staaates = {
		derpAround : function(){
			var willWander = Math.random() * 5;
			if(willWander > 1){
				this.setState("wander")
			} else if (willWander < 3) {
				this.setState("normal")
			} else {
				this.setState("charge")
			}
		}, 
		charge : function(){
			if(!this.ticksInState){
				this.sprite.setSprite(this.enemyData.spriteSheetCharge, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					5, 12, true);
				this.chargeAngle = Math.atan2(player.y - this.y, player.x - this.x);
			}
			if(this.ticksInState == 5){
				this.sprite.setSprite(this.enemyData.spriteSheetCharge2, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					3, 12, true);
			}
			if(this.ticksInState > 1000 && mDist(this.x, this.y, player.x, player.y) > 10){
				this.setState("derpAround")
				return;
			}
			
			if(directionTimer === undefined)
				directionTimer = 0
			var speed = 4 //TODO: make charge speed a variable in newEnemy
			
			velX = Math.cos(this.chargeAngle) * speed;
			//velY = Math.sin(angle) * speed;
			velY = 0
			
			this.tileCollider.moveOnAxis(this, velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
			
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();

			if(this.lastx == this.x){
				this.setState("derpAround")
				return;
			}
			this.lastx = this.x
			this.lasty = this.y
		},
		normal : function(){		
			if( Math.abs(this.y - player.y) < 10){
				this.setState("charge")
				return;
			}
			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(this.enemyData.spriteSheet, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);

				// this.sprite.setSprite(sprites.Player.rangedAttack, //TODO: maybe derp emote? 
				// 	this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				// 	4, 10, true);
			}
			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		wander : function(){
			if( Math.abs(this.y - player.y) < 10){
				this.setState("charge")
				return;
			}

			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				var speed = minSpeed + Math.random() * maxSpeed;
				var angle = Math.random() * 2*Math.PI;

				velX = Math.cos(angle) * speed;
				velY = Math.sin(angle) * speed;
				this.sprite.setSprite(this.enemyData.spriteSheet,
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
				if(this.sprite.getSpriteSheet() == this.enemyData.spriteSheet && this.enemyData.spriteSheetEast){
					if(velX > 0){
						var frames = this.enemyData.spriteSheetEastFrames ? this.enemyData.spriteSheetEastFrames : this.enemyData.spriteFrames;
						this.sprite.setSprite(this.enemyData.spriteSheetEast,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							frames, this.enemyData.spriteSpeed, true);	
					}
				}else if (this.sprite.getSpriteSheet() == this.enemyData.spriteSheetEast){
					if(velX < 0){

						this.sprite.setSprite(this.enemyData.spriteSheet,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}
				}
			}

			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.tileCollider.moveOnAxis(this, velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		}
	}
	return new enemyClass(this, staaates);
}