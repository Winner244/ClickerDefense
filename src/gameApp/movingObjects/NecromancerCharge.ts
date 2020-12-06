import { ImageHandler } from '../ImageHandler';
import { Draw } from '../gameSystems/Draw';

import { ILogicalObject } from '../../models/objects/ILogicalObject';

import { Building } from "../../gameApp/buildings/Building"
import { Monster } from "../../gameApp/monsters/Monster"
import { Unit } from "../../gameApp/units/Unit"
import { MovingObject } from '../../models/objects/MovingObject';

import ChargeImage from '../../assets/img/monsters/necromancer/charge.png'; 

export class NecromancerCharge implements ILogicalObject {
    static readonly imageHandler: ImageHandler = new ImageHandler();
	static readonly chargeImage: HTMLImageElement = new Image();
    
    charge: MovingObject;
    damage: number;
    isEnd: boolean = false; //объект пора уничтожать? 

    public constructor(charge: MovingObject, damage: number) {
        this.charge = charge;
        this.damage = damage;
    }
    
    static init(isLoadResources: boolean = true): void{
        if(isLoadResources){
            NecromancerCharge.imageHandler.new(NecromancerCharge.chargeImage).src = ChargeImage;
        }
    }

    logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number): void{
        this.charge.rotate += 1000 * Math.random() / drawsDiffMs;
        this.charge.leftTimeMs -= drawsDiffMs;
        this.charge.location.x -= this.charge.dx * (drawsDiffMs / 1000);
        this.charge.location.y -= this.charge.dy * (drawsDiffMs / 1000);

        //delete - выход за границу экрана или по истечению времени жизни
        if (this.charge.location.x + this.charge.size.width < 0 || this.charge.location.x > Draw.canvas.width || 
            this.charge.location.y + this.charge.size.height < 0 || this.charge.location.y > Draw.canvas.height ||
            this.charge.leftTimeMs < 0)
        {
            this.isEnd = true;
        }
        else {
            let buildingGoal = buildings.find(building => 
                this.charge.centerX > building.x + building.reduceHover && this.charge.centerX < building.x + building.width - building.reduceHover && 
                this.charge.centerY > building.y + building.reduceHover && this.charge.centerY < building.y + building.height - building.reduceHover);

            //попадание в цель
            if (buildingGoal){ 
                buildingGoal.applyDamage(this.damage, this.charge.centerX, this.charge.centerY);
                this.isEnd = true;
            }
        }
    }

    draw(drawsDiffMs: number, isGameOver: boolean): void {
        if(!NecromancerCharge.imageHandler.isImagesCompleted){
            return;
        }

        Draw.ctx.setTransform(1, 0, 0, 1, this.charge.location.x + this.charge.size.width / 2, this.charge.location.y + this.charge.size.height / 2); 
        Draw.ctx.rotate(this.charge.rotate * Math.PI / 180);
        Draw.ctx.drawImage(NecromancerCharge.chargeImage, -this.charge.size.width / 2, -this.charge.size.height / 2, this.charge.size.width, this.charge.size.height);
        Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
        Draw.ctx.rotate(0);
    }
}